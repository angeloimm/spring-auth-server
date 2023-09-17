import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private oauthService: OAuthService) {}
  canActivate(){
    if (
      this.oauthService.hasValidAccessToken() &&
      this.oauthService.hasValidIdToken()
    ) {
      console.debug("AuthGard --> return true. Token id --> "+this.oauthService.getIdToken());
      return true;
    } else {
      //this.router.navigate(['/home', { login: true }]);
      console.debug("AuthGard --> return false");
      return false;
    }
  }
}
