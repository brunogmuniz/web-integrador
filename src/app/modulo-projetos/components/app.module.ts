import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {RouterModule} from "@angular/router";
import {PrincipalComponent} from "../../modulo-admin/components/principal/principal.component";

import { LayoutModule } from './layout/layout.module';
import { OAuthModule } from 'angular-oauth2-oidc';
import {HttpClientModule} from "@angular/common/http";
import {PortalAdminComponent} from "./portal-admin/portal-admin.component";
import {GerenciarProjetosComponent} from "./portal-admin/gerenciar-projetos/gerenciar-projetos.component";
import {CadastrarProjetosComponent} from "./portal-admin/cadastrar-projetos/cadastrar-projetos.component";
import {AppCoreModule} from "app-core";
import {AdminModule} from "./portal-admin/admin.module";

@NgModule({
  declarations: [
    AppComponent,
    PrincipalComponent,
    PortalAdminComponent,
    GerenciarProjetosComponent,
    CadastrarProjetosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    LayoutModule,
    HttpClientModule,
    OAuthModule.forRoot(),
    AppCoreModule,
    AdminModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
