import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DocenteComponent } from './docente/docente.component';
import { CadastrarDocenteComponent } from './docente/cadastrar-docente/cadastrar-docente.component';
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FormInput } from "../../app-core/src/lib/components/form-input-padrao/form-input-padrao";
import { VisualizarDocenteComponent } from "./docente/visualizar-docente/visualizar-docente.component";
import {HttpClientModule, provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";
import { DocenteEncargosComponent } from './docente-encargos/docente-encargos.component';
import { CadastrarDocentesEncargosComponent } from './docente-encargos/cadastrar-docentes-encargos/cadastrar-docentes-encargos.component';
import { VisualizarDocenteEncargosComponent } from './docente-encargos/visualizar-docente-encargos/visualizar-docente-encargos.component';
import { SubareaConhecimentoComponent } from './subarea-conhecimento/subarea-conhecimento.component';
import { AreaConhecimentoComponent } from './area-conhecimento/area-conhecimento.component';
import { EstruturaCurricularComponent } from './estrutura-curricular/estrutura-curricular.component';
import { VisualizarAreaConhecimentoComponent } from './area-conhecimento/visualizar-area-conhecimento/visualizar-area-conhecimento.component';
import { CadastrarAreaConhecimentoComponent } from './area-conhecimento/cadastrar-area-conhecimento/cadastrar-area-conhecimento.component';
import { PrincipalComponent } from './principal/principal.component';
import { VisualizarSubareaConhecimentoComponent } from './subarea-conhecimento/visualizar-subarea-conhecimento/visualizar-subarea-conhecimento.component';
import { CadastrarSubareaConhecimentoComponent } from './subarea-conhecimento/cadastrar-subarea-conhecimento/cadastrar-subarea-conhecimento.component';
import { CadastrarEstruturaCurricularComponent } from './estrutura-curricular/cadastrar-estrutura-curricular/cadastrar-estrutura-curricular.component';
import { VisualizarEstruturaCurricularComponent } from './estrutura-curricular/visualizar-estrutura-curricular/visualizar-estrutura-curricular.component';
import { DisciplinaComponent } from './disciplina/disciplina.component';
import { VisualizarDisciplinaComponent } from './disciplina/visualizar-disciplina/visualizar-disciplina.component';
import { CadastrarDisciplinaComponent } from './disciplina/cadastrar-disciplina/cadastrar-disciplina.component';
import { HeaderComponent } from './utils/header/header.component';
import { MenuLateralComponent } from './utils/menu-lateral/menu-lateral.component';
import {environment} from "../../../environments/enviroment";
import {APP_AUTH_CONFIG, ImageProfileComponent, initializeAppFactory} from "../../app-core/src/public-api";
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AuthConfig, OAuthModule, OAuthService } from "angular-oauth2-oidc";
import {LayoutComponent} from "./layout/layout.component";
import { OAuthStorage } from 'angular-oauth2-oidc';

const authConfig: AuthConfig = {
  issuer: 'http://localhost:8081/realms/ufsm',
  clientId: 'webClient',
  redirectUri: 'http://localhost:4200/',
  responseType: 'code',
  scope: 'openid profile email offline_access',
  showDebugInformation: !environment.production,

};

@NgModule({
  declarations: [
    AppComponent,
    DocenteComponent,
    CadastrarDocenteComponent,
    VisualizarDocenteComponent,
    DocenteEncargosComponent,
    CadastrarDocentesEncargosComponent,
    VisualizarDocenteEncargosComponent,
    SubareaConhecimentoComponent,
    AreaConhecimentoComponent,
    EstruturaCurricularComponent,
    CadastrarEstruturaCurricularComponent,
    VisualizarEstruturaCurricularComponent,
    VisualizarAreaConhecimentoComponent,
    CadastrarAreaConhecimentoComponent,
    PrincipalComponent,
    VisualizarSubareaConhecimentoComponent,
    CadastrarSubareaConhecimentoComponent,
    DisciplinaComponent,
    VisualizarDisciplinaComponent,
    CadastrarDisciplinaComponent,
    HeaderComponent,
    MenuLateralComponent,
    LayoutComponent,
    ImageProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    ReactiveFormsModule,
    FormInput,
    FormsModule,
    HttpClientModule,
    OAuthModule.forRoot({
      resourceServer: {
        allowedUrls: [environment.apiUrl],
        sendAccessToken: true,

      },
    })
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),

    {
      provide: APP_AUTH_CONFIG,
      useValue: authConfig
    },
    {
      provide: OAuthStorage,
      useValue: localStorage
    },

    {
      provide: APP_INITIALIZER,
      useFactory: (oauthService: OAuthService, config: AuthConfig) =>
        initializeAppFactory(oauthService, config),
      deps: [OAuthService, APP_AUTH_CONFIG],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
