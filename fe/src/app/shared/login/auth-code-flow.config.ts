import { AuthConfig } from 'angular-oauth2-oidc';
import { useSilentRefreshForCodeFlow } from '../../../environments/environment';
import { environment } from '../../../environments/environment';
export const authCodeFlowConfig: AuthConfig = {
  issuer: environment.oauth_config.issuer,
  redirectUri:environment.oauth_config.post_login_redirect_uri,
  clientId: environment.oauth_config.client_id,
  //logoutUrl:"http://localhost:7789/auth-server/logout",  
  strictDiscoveryDocumentValidation: environment.oauth_config.strict_discovery_document_validation,
  // Just needed if your auth server demands a secret. In general, this
  // is a sign that the auth server is not configured with SPAs in mind
  // and it might not enforce further best practices vital for security
  // such applications.
  // dummyClientSecret: 'secret',
  responseType: environment.oauth_config.response_type,
  // set the scope for the permissions the client should request
  // The first four are defined by OIDC.
  // Important: Request offline_access to get a refresh token
  // The api scope is a usecase specific one
  scope: environment.oauth_config.scope,
  // ^^ Please note that offline_access is not needed for silent refresh
  // At least when using idsvr, this even prevents silent refresh
  // as idsvr ALWAYS prompts the user for consent when this scope is
  // requested
  // This is needed for silent refresh (refreshing tokens w/o a refresh_token)
  // **AND** for logging in with a popup
  silentRefreshRedirectUri: environment.oauth_config.refresh_token_uri,
  useSilentRefresh: useSilentRefreshForCodeFlow,
  showDebugInformation: environment.oauth_config.showDebugInformation,
  sessionChecksEnabled: true,
  timeoutFactor: 0.01,
  disablePKCE:false,
  
  clearHashAfterLogin: false
};