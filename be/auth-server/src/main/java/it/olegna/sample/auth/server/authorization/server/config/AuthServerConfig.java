package it.olegna.sample.auth.server.authorization.server.config;

import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.security.oauth2.core.ClientAuthenticationMethod;
import org.springframework.security.oauth2.core.oidc.OidcScopes;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.server.authorization.client.InMemoryRegisteredClientRepository;
import org.springframework.security.oauth2.server.authorization.client.RegisteredClient;
import org.springframework.security.oauth2.server.authorization.client.RegisteredClientRepository;
import org.springframework.security.oauth2.server.authorization.config.annotation.web.configuration.OAuth2AuthorizationServerConfiguration;
import org.springframework.security.oauth2.server.authorization.config.annotation.web.configurers.OAuth2AuthorizationServerConfigurer;
import org.springframework.security.oauth2.server.authorization.context.AuthorizationServerContext;
import org.springframework.security.oauth2.server.authorization.context.AuthorizationServerContextHolder;
import org.springframework.security.oauth2.server.authorization.settings.AuthorizationServerSettings;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.LoginUrlAuthenticationEntryPoint;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.util.UriComponentsBuilder;

import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Configuration
@Slf4j
public class AuthServerConfig {

    @Value("#{'${authorization.server.auth-server.enable.cors.for}'.split(',')}")
    private List<String> enbaleCorsFor;
    @Value("${authorization.server.auth-server.enable.cors.enabled}")
    private boolean corsEnabled;
    @Value("${authorization.server.auth-server.issuer}")
    private String issuer;
    @Value("${server.servlet.context-path}")
    private String contextPath;

    private static KeyPair generateRsaKey() {
        KeyPair keyPair;
        try {
            KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("RSA");
            keyPairGenerator.initialize(2048);
            keyPair = keyPairGenerator.generateKeyPair();
        } catch (Exception ex) {
            throw new IllegalStateException(ex);
        }
        return keyPair;
    }

    @Bean
    @Order(Ordered.HIGHEST_PRECEDENCE)
    public SecurityFilterChain authorizationServerSecurityFilterChain(HttpSecurity http)
            throws Exception {
        OAuth2AuthorizationServerConfiguration.applyDefaultSecurity(http);
        http.getConfigurer(OAuth2AuthorizationServerConfigurer.class)
                .oidc(oidc ->
                        oidc
                                .providerConfigurationEndpoint(providerConfigurationEndpoint ->
                                        providerConfigurationEndpoint
                                                .providerConfigurationCustomizer(providerConfigurationCustomizer -> {
                                                    AuthorizationServerContext authorizationServerContext = AuthorizationServerContextHolder.getContext();
                                                    String issuer = authorizationServerContext.getIssuer();
                                                    providerConfigurationCustomizer.claim("backchannel_logout_session_supported", "true");
                                                    providerConfigurationCustomizer.claim("end_session_endpoint", UriComponentsBuilder.fromUriString(issuer).path("/logout").build().toUriString());
                                                    providerConfigurationCustomizer.claim("check_session_iframe", UriComponentsBuilder.fromUriString(issuer).path("/checksession/check").build().toUriString());
                                                    List<String> scopes = new ArrayList<>();
                                                    scopes.add("openid");
                                                    scopes.add("address");
                                                    scopes.add("phone");
                                                    scopes.add("profile");
                                                    scopes.add("email");
                                                    providerConfigurationCustomizer.claim("scopes_supported", scopes);
                                                })
                                )
                ).tokenRevocationEndpoint(oAuth2TokenRevocationEndpointConfigurer -> {
                    oAuth2TokenRevocationEndpointConfigurer.revocationResponseHandler(
                            ((request, response, authentication) -> {
                                Assert.notNull(request, "HttpServletRequest required");
                                HttpSession session = request.getSession(false);
                                if (!Objects.isNull(session)) {
                                    session.removeAttribute("SPRING_SECURITY_CONTEXT");
                                    session.invalidate();
                                }
                                SecurityContextHolder.getContext().setAuthentication(null);
                                SecurityContextHolder.clearContext();
                                response.setStatus(HttpStatus.OK.value());
                            })
                    );
                });
        http.oauth2ResourceServer(resSvrConfig -> {
            resSvrConfig.jwt(jwtConfigurer -> {
                jwtConfigurer.decoder(authSvrJwtDecoder());
            });
        });
        http.cors(httpSecurityCorsConfigurer -> {
            if (corsEnabled) {
                log.trace("CORS abilitati per {} ", enbaleCorsFor);
                httpSecurityCorsConfigurer.configurationSource(createCorsConfigurationSource());
            } else {
                log.trace("CORS non abilitati");
            }
        });
        return http.build();
    }


    private CorsConfigurationSource createCorsConfigurationSource() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.setAllowedOrigins(enbaleCorsFor);
        corsConfiguration.setMaxAge(3600L);
        corsConfiguration.addAllowedMethod("*");
        corsConfiguration.addAllowedHeader("Requestor-Type");
        corsConfiguration.addExposedHeader("X-Get-Header");
        UrlBasedCorsConfigurationSource result = new UrlBasedCorsConfigurationSource();
        result.registerCorsConfiguration("/**", corsConfiguration);
        return result;
    }
    @Bean
    public RegisteredClientRepository registeredClientRepository() {
        RegisteredClient registeredClient = RegisteredClient.withId(UUID.randomUUID().toString())
                .clientId("chAt8IcEfaFa8Apr6Swo")
                .clientSecret("{noop}chAt8IcEfaFa8Apr6Swo")
                .clientAuthenticationMethod(ClientAuthenticationMethod.CLIENT_SECRET_BASIC)
                .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
                .authorizationGrantType(AuthorizationGrantType.REFRESH_TOKEN)
                .redirectUri("it.olegna.app.mobile:/public/redirect")
                //.redirectUri("http://127.0.0.1:8080/authorized")
                .scope(OidcScopes.OPENID)
                .scope("articles.read")
                .build();
        return new InMemoryRegisteredClientRepository(registeredClient);
    }
    @Bean
    UserDetailsService users() {
        UserDetails user = User.withDefaultPasswordEncoder()
                .username("admin")
                .password("password")
                .build();
        return new InMemoryUserDetailsManager(user);
    }
    private JwtDecoder authSvrJwtDecoder() {
        return OAuth2AuthorizationServerConfiguration.jwtDecoder(jwkSource());
    }

    @Bean
    public JWKSource<SecurityContext> jwkSource() {
        KeyPair keyPair = generateRsaKey();
        RSAPublicKey publicKey = (RSAPublicKey) keyPair.getPublic();
        RSAPrivateKey privateKey = (RSAPrivateKey) keyPair.getPrivate();
        RSAKey rsaKey = new RSAKey.Builder(publicKey)
                .privateKey(privateKey)
                .keyID(UUID.randomUUID().toString())
                .build();
        JWKSet jwkSet = new JWKSet(rsaKey);
        return new ImmutableJWKSet<>(jwkSet);
    }

    @Bean
    public AuthorizationServerSettings authorizationServerSettings() {
        AuthorizationServerSettings.Builder builder = AuthorizationServerSettings.builder();
        if (StringUtils.hasText(issuer)) {
            StringBuilder sb = new StringBuilder(issuer.endsWith("/") ? issuer : issuer.concat("/"));
            if (StringUtils.hasText(contextPath)) {
                sb.append(contextPath.startsWith("/") ? contextPath.substring(1) : contextPath);
            }
            log.info("Setto issuer {}", sb);
            builder.issuer(sb.toString());
        }
        return builder.build();
    }
}
