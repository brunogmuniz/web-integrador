import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {RouterModule} from "@angular/router";
import {PrincipalComponent} from "../../modulo-admin/components/principal/principal.component";

import { LayoutModule } from './layout/layout.module';
import { OAuthModule } from 'angular-oauth2-oidc';
import {HttpClientModule} from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent,
    PrincipalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    LayoutModule,
    HttpClientModule,
    OAuthModule.forRoot()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
