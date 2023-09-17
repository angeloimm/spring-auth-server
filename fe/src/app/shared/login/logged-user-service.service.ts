import { Injectable, Output, EventEmitter } from '@angular/core';
import { UserProfile } from '../models/userProfile.model';
import { InfoOpenID } from '../models/info-openid.model';

@Injectable({
  providedIn: 'root'
})
export class LoggedUserSvcService {
  userProfile:UserProfile = null;
  constructor() { 
   
  }
  userLogged(user:UserProfile){
    this.userProfile = user;
  }
}
