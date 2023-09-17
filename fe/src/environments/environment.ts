// Use HashLocationStrategy for routing?
export const useHash = true;

// Set this to true, to use silent refresh; otherwise the example
// uses the refresh_token via an AJAX coll to get new tokens.
export const useSilentRefreshForCodeFlow = false;

export const environment = {
  production: false,
  // Use HashLocationStrategy for routing?
  useHash: true,
  // Set this to true, to use silent refresh; otherwise the example
  // uses the refresh_token via an AJAX coll to get new tokens.
  useSilentRefreshForCodeFlow: false,
  oauth_config: {
    //Indica la baseUrl di WSO2
    oauth_url: 'http://localhost:9099/auth-server',
    //Indica l'issuer del token JWT (server wso2)
    issuer: 'http://localhost:9099/auth-server',
    // //Indica l'endpoint per i token
    // token_endpoint:'https://login-test.regione.puglia.it/oauth2/token',
    //Indica il discovery URL per la config. openid
    discovery_url: "http://localhost:4200/auth-server/.well-known/openid-configuration",
    //Indica se l'URL di discoveryUrl deve iniziare con l'URL dello issuer
    strict_discovery_document_validation: false,
    //Indica il client ID assegnato a questa applicazione quando viene registrata nello IAM
    client_id: 'chAt8IcEfaFa8Apr6Swo',
    //Indica la redirect URI dopo che il login è OK
    post_login_redirect_uri: 'it.olegna.app.mobile:/public/redirect',
    //Indica la redirect URI dopo il logout OK
    post_logout_redirect_uri: window.location.origin + '/logout',
    //Indica la URI per il refresh del token
    refresh_token_uri: window.location.origin + '/silent_refresh.html',
    //Utilizziamo PCKE e quindi la response type è code ed è quello raccomandato
    response_type: 'code',
    //L'OAuth scope
    scope:  useSilentRefreshForCodeFlow ?
            'openid profile email api' : 'openid profile email offline_access api',
    //Indice se mostrare informazioni di debug o meno
    showDebugInformation: true,
    // Settare a true se si vuole abilitare la feature di auto-login
    enable_auto_login : false,
    //Settare a true se si vuole revocare il token JWT al logout
    revoke_token_onLogout : true
  },
  resource_server_config: {
      base_url: '',
      user_detail_endpoint: ''
  },
  routes_show_debug:true
};
