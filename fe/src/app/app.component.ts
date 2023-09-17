import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { authCodeFlowConfig } from './shared/login/auth-code-flow.config';
import { useHash } from 'src/environments/environment';
import { UserProfile } from './shared/models/userProfile.model';
import { filter } from 'rxjs/operators';
import { LoggedUserSvcService } from './shared/login/logged-user-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'OPEN ID Connect Example';
  isLogged: boolean;
  utenteLoggato: UserProfile;


  constructor(private router: Router, private oauthService: OAuthService, private loggedUserSvc: LoggedUserSvcService) {
    //Configuro il code flow per supporto PCKE
    this.configureCodeFlow();
  }

  private configureCodeFlow() {
    this.oauthService.configure(authCodeFlowConfig);
    this.oauthService.setStorage(localStorage);
    this.oauthService.loadDiscoveryDocumentAndTryLogin().then(_ => {
      if (useHash) {
        //Controllo se sono loggato o meno. Se sono loggato vado alla lista claims altrimenti 
        //Vado a home:
        if (this.oauthService.hasValidAccessToken() && this.oauthService.hasValidIdToken()) {
          console.log(this.oauthService.getAccessToken())
          this.isLogged = true;
          this.utenteLoggato = this.user();
          this.loggedUserSvc.userLogged(this.utenteLoggato);
          this.router.navigate(['parametri']);
        } else {
          this.isLogged = false;
          this.router.navigate(['home']);
        }
      }
    });
    // Optional
    this.oauthService.setupAutomaticSilentRefresh();

    // Display all events
    this.oauthService.events.subscribe(e => {
      // tslint:disable-next-line:no-console
     console.debug('oauth/oidc event', e);
    });

    this.oauthService.events
      .pipe(filter(e => e.type === 'session_terminated'))
      .subscribe(() => {
        // tslint:disable-next-line:no-console
        // console.debug('Your session has been terminated!');
      });
  }

  user() {
    let userProfile = new UserProfile();
    var claims = this.oauthService.getIdentityClaims();
    debugger;
    if (!claims) {
      return null;
    }
    userProfile.username = claims['sub'];
    userProfile.cognome = claims['family_name'];
    userProfile.nome = claims['given_name'];
    userProfile.email = claims['email'];
    userProfile.codiceFiscale = claims['fiscal_number'];
    userProfile.claims = claims;
    return userProfile;
  }
}
