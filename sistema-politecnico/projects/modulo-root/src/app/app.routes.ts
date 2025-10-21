import { Routes } from '@angular/router';
import {App} from './app';
import {LandingPage} from './components/landing-page/landing-page';
import {Privacy} from './components/privacy/privacy';

export const routes: Routes = [
  {path: '', component: LandingPage},
  {path: 'home', component: LandingPage},
  {path: 'privacy', component: Privacy},
];
