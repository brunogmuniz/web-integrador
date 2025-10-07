import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModuloDeptEnsinoRoutingModule } from './modulo-dept-ensino-routing-module';
import { LandingComponent } from '../modulo-root/components/landing/landing.component';
import { NavbarComponent } from '../modulo-root/components/landing/navbar/navbar.component';
import { LoginComponent } from './ components/login/login.component';
import {ReactiveFormsModule} from '@angular/forms';
import {ImgLoginComponent} from './ components/login/components/img-login/img-login.component';
import {NavComponent} from './ components/login/components/nav/nav.component';


@NgModule({
  declarations: [
    LandingComponent,
    NavbarComponent,
    LoginComponent,
    ImgLoginComponent,
    NavComponent
  ],
  imports: [
    CommonModule,
    ModuloDeptEnsinoRoutingModule,
    ReactiveFormsModule
  ]
})
export class ModuloDeptEnsinoModule { }
