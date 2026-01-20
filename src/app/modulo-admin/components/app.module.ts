import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AuthConfig, OAuthModule, OAuthService } from "angular-oauth2-oidc";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './utils/header/header.component';
import { MenuLateralComponent } from './utils/menu-lateral/menu-lateral.component';
import { LayoutComponent } from "./layout/layout.component";
import { PrincipalComponent } from './principal/principal.component';
import { DocenteComponent } from './docente/docente.component';
import { CadastrarDocenteComponent } from './docente/cadastrar-docente/cadastrar-docente.component';
import { VisualizarDocenteComponent } from "./docente/visualizar-docente/visualizar-docente.component";
import { DocenteEncargosComponent } from './docente-encargos/docente-encargos.component';
import { CadastrarDocentesEncargosComponent } from './docente-encargos/cadastrar-docentes-encargos/cadastrar-docentes-encargos.component';
import { VisualizarDocenteEncargosComponent } from './docente-encargos/visualizar-docente-encargos/visualizar-docente-encargos.component';
import { SubareaConhecimentoComponent } from './subarea-conhecimento/subarea-conhecimento.component';
import { AreaConhecimentoComponent } from './area-conhecimento/area-conhecimento.component';
import { EstruturaCurricularComponent } from './estrutura-curricular/estrutura-curricular.component';
import { VisualizarAreaConhecimentoComponent } from './area-conhecimento/visualizar-area-conhecimento/visualizar-area-conhecimento.component';
import { CadastrarAreaConhecimentoComponent } from './area-conhecimento/cadastrar-area-conhecimento/cadastrar-area-conhecimento.component';
import { VisualizarSubareaConhecimentoComponent } from './subarea-conhecimento/visualizar-subarea-conhecimento/visualizar-subarea-conhecimento.component';
import { CadastrarSubareaConhecimentoComponent } from './subarea-conhecimento/cadastrar-subarea-conhecimento/cadastrar-subarea-conhecimento.component';
import { CadastrarEstruturaCurricularComponent } from './estrutura-curricular/cadastrar-estrutura-curricular/cadastrar-estrutura-curricular.component';
import { VisualizarEstruturaCurricularComponent } from './estrutura-curricular/visualizar-estrutura-curricular/visualizar-estrutura-curricular.component';
import { DisciplinaComponent } from './disciplina/disciplina.component';
import { VisualizarDisciplinaComponent } from './disciplina/visualizar-disciplina/visualizar-disciplina.component';
import { CadastrarDisciplinaComponent } from './disciplina/cadastrar-disciplina/cadastrar-disciplina.component';
import {environment} from "../../../environments/enviroment";
import { AppCoreModule, FormInput, APP_AUTH_CONFIG, initializeAppFactory, LoginService} from 'app-core';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';

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
    HeaderComponent,
    MenuLateralComponent,
    LayoutComponent,
    PrincipalComponent,
    DocenteComponent,
    CadastrarDocenteComponent,
    VisualizarDocenteComponent,
    DocenteEncargosComponent,
    CadastrarDocentesEncargosComponent,
    VisualizarDocenteEncargosComponent,
    SubareaConhecimentoComponent,
    CadastrarSubareaConhecimentoComponent,
    VisualizarSubareaConhecimentoComponent,
    AreaConhecimentoComponent,
    CadastrarAreaConhecimentoComponent,
    VisualizarAreaConhecimentoComponent,
    EstruturaCurricularComponent,
    CadastrarEstruturaCurricularComponent,
    VisualizarEstruturaCurricularComponent,
    DisciplinaComponent,
    CadastrarDisciplinaComponent,
    VisualizarDisciplinaComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    AppRoutingModule,
    AppCoreModule,
    FormInput,
    NgxMaskDirective,
    NgxMaskPipe,
    OAuthModule.forRoot({
      resourceServer: {
        allowedUrls: ['http://localhost:8080'],
        sendAccessToken: true
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
      provide: APP_INITIALIZER,
      useFactory: (oauthService: OAuthService, config: AuthConfig, loginService: LoginService) =>
        initializeAppFactory(oauthService, config, loginService),
      deps: [OAuthService, APP_AUTH_CONFIG, LoginService],
      multi: true
    },
    provideNgxMask({
      dropSpecialCharacters: true
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
