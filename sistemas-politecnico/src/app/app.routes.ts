import { Routes } from '@angular/router';
import {LoginComponent} from './modulo-dept-ensino/ components/login/login.component';
import {AuthGuard} from './modulo-dept-ensino/service/auth.guard';

export const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},

  {path: 'login', component: LoginComponent},

  {path: 'dept-ensino', loadChildren:()=> import('./modulo-dept-ensino/modulo-dept-ensino-module').then(m => m.ModuloDeptEnsinoModule), canActivate: [AuthGuard]},

  {path: '**', redirectTo: 'login'},
];
