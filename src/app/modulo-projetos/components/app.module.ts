import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PrincipalComponent } from '../../modulo-admin/components/principal/principal.component';
import { LayoutModule } from './layout/layout.module';
import { OAuthModule } from 'angular-oauth2-oidc';
import { PortalAdminComponent } from './portal-admin/portal-admin.component';
import { GerenciarProjetosComponent } from './portal-admin/gerenciar-projetos/gerenciar-projetos.component';
import { CadastrarProjetosComponent } from './portal-admin/cadastrar-projetos/cadastrar-projetos.component';
import { AppCoreModule } from 'app-core';
import { AdminModule } from './portal-admin/admin.module';
import { LoginComponent } from './login/login.component';
import { RegistroComponent } from './registro/registro.component';
import { ProjetosAuthGuard } from 'app-core/lib/services/projetos/projetosauth.guard';

@NgModule({
  declarations: [
    AppComponent,
    PrincipalComponent,
    PortalAdminComponent,
    GerenciarProjetosComponent,
    CadastrarProjetosComponent,
    LoginComponent,
    RegistroComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    FormsModule,
    LayoutModule,
    HttpClientModule,
    OAuthModule.forRoot(),
    AppCoreModule,
    AdminModule
  ],
  providers: [
    ProjetosAuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
