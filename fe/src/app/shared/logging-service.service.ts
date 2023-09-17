import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class LoggingServiceService {

  constructor() { }
  pringLog( logMsg:String ){
    if( environment.oauth_config.showDebugInformation ){
      console.log(logMsg);
    }
  }
}
