
import { Routes } from '@angular/router';

import { LoginComponent } from './login/login';
import { AuthGuard } from './app-core/service/auth.guard';
import {LAYOUT_DEPT_ENSINO_ROUTES} from './layout/layout.routes';

export const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},

  {path: 'login', component: LoginComponent},

  {
    path: 'dept-ensino',
    canActivate: [AuthGuard],
    loadChildren: () => import('./layout/layout.routes').then(m => m.LAYOUT_DEPT_ENSINO_ROUTES),
  },


  {path: '**', redirectTo: 'login'},
];
