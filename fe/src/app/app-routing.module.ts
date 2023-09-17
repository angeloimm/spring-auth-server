import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ParamsComponent } from './params/params.component';
import { AuthGuard } from './shared/login/auth-guard.service';

export let APP_ROUTES: Routes = [

    { path: 'home', component: HomeComponent },
    { path: 'parametri', component: ParamsComponent, canActivate: [AuthGuard] }
  ];
  