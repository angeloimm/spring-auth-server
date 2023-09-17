import { Component, OnInit } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { Router } from '@angular/router';
import { LoggedUserSvcService } from '../shared/login/logged-user-service.service';
import { UserProfile } from '../shared/models/userProfile.model';
import { LoggingServiceService } from '../shared/logging-service.service';

@Component({
  selector: 'app-params',
  templateUrl: './params.component.html',
  styleUrls: ['./params.component.css']
})
export class ParamsComponent implements OnInit {
  loggedUser:UserProfile;
  loggedUserInfo:{nomeClaim:string, valoreClaim:string}[] = []
  constructor(private router: Router, 
              private oauthService: OAuthService, 
              private loggedUserSvc:LoggedUserSvcService,
              private loggingService:LoggingServiceService) {
                //this.loggedUser = this.loggedUserSvc.userProfile
  }

  ngOnInit(): void {
    this.loggedUser = this.loggedUserSvc.userProfile;
    this.loggingService.pringLog("Recuperato utente "+this.loggedUser);
    let evilResponseProps = Object.keys(this.loggedUser.claims);
    for(let prop of evilResponseProps){
      let valore = this.loggedUser.claims[prop];
      this.loggedUserInfo.push({nomeClaim: prop, valoreClaim:valore})
      //this.loggingService.pringLog("Nome prop "+prop+" Valore "+valore);
    }
  }
  logout(){
    this.oauthService.logOut();
  }
}
