import { Routes } from '@angular/router';
import {LoginComponent} from './modulo-dept-ensino/ components/login/login.component';
import {AuthGuard} from './auth/auth.guard';

export const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},

  {path: 'login', loadChildren: () => import('./auth/auth-module').then(m => m.AuthModule)},

  {path: 'dept-ensino', loadChildren:()=> import('./modulo-dept-ensino/modulo-dept-ensino-module').then(m => m.ModuloDeptEnsinoModule), canActivate: [AuthGuard]},

  {path: '**', redirectTo: 'login'},
];
