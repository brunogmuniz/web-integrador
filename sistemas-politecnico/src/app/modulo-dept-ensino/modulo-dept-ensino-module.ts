import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModuloDeptEnsinoRoutingModule } from './modulo-dept-ensino-routing-module';
import { LandingComponent } from '../modulo-root/components/landing/landing.component';
import { NavbarComponent } from '../modulo-root/components/landing/navbar/navbar.component';
import { LoginComponent } from './ components/login/login.component';


@NgModule({
  declarations: [
    LandingComponent,
    NavbarComponent,
    LoginComponent
  ],
  imports: [
    CommonModule,
    ModuloDeptEnsinoRoutingModule
  ]
})
export class ModuloDeptEnsinoModule { }
