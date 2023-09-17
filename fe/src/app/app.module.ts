import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ParamsComponent } from './params/params.component';
//Angular

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';


//PrimeNG
import { ButtonModule } from 'primeng/button';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {TableModule} from 'primeng/table';
import {DropdownModule} from 'primeng/dropdown';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, ExtraOptions } from '@angular/router';



//Oauth
import { OAuthModule } from 'angular-oauth2-oidc';

/* FONTAWESOME */
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';

//Rutes
import { APP_ROUTES } from './app-routing.module';

//Import Environment
import { environment } from 'src/environments/environment';
import { AuthGuard } from './shared/login/auth-guard.service';
import { LoggedUserSvcService } from './shared/login/logged-user-service.service';
import { LoggingServiceService } from './shared/logging-service.service';


const ROUTING_OPTIONS: ExtraOptions = {
  // preloadingStrategy: CustomPreloadingStrategy,
  useHash: environment.useHash,
  initialNavigation: 'disabled',
  // initialNavigation: true,
  enableTracing: environment.routes_show_debug
};

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ParamsComponent
  ],
  imports: [
    FontAwesomeModule,
    BrowserModule,
    HttpClientModule,
    OAuthModule.forRoot({
      resourceServer: {
        allowedUrls: [environment.resource_server_config.base_url],
        sendAccessToken: true
      }
    }),
    RouterModule.forRoot(
      APP_ROUTES,
      ROUTING_OPTIONS
    ),
    ButtonModule,
    BrowserAnimationsModule,
    ConfirmDialogModule,
    TableModule,
    DropdownModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    AuthGuard, 
    LoggedUserSvcService,
    LoggingServiceService
  ],
  bootstrap: [AppComponent] 
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas, far);
  }
 }
