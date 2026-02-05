import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {AuthConfig, OAuthModule, OAuthService, OAuthStorage} from "angular-oauth2-oidc";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './utils/header/header.component';
import { MenuLateralComponent } from './utils/menu-lateral/menu-lateral.component';
import { LayoutComponent } from "./layout/layout.component";
import { PrincipalComponent } from './principal/principal.component';
import { DocenteComponent } from 'app-core/lib/components/cruds/docente/docente.component';
import { CadastrarDocenteComponent } from 'app-core/lib/components/cruds/docente/cadastrar-docente/cadastrar-docente.component';
import { VisualizarDocenteComponent } from "app-core/lib/components/cruds/docente/visualizar-docente/visualizar-docente.component";
import { DocenteEncargosComponent } from 'app-core/lib/components/cruds/docente-encargos/docente-encargos.component';
import { CadastrarDocentesEncargosComponent } from 'app-core/lib/components/cruds/docente-encargos/cadastrar-docentes-encargos/cadastrar-docentes-encargos.component';
import { VisualizarDocenteEncargosComponent } from 'app-core/lib/components/cruds/docente-encargos/visualizar-docente-encargos/visualizar-docente-encargos.component';
import { SubareaConhecimentoComponent } from 'app-core/lib/components/cruds/subarea-conhecimento/subarea-conhecimento.component';
import { AreaConhecimentoComponent } from 'app-core/lib/components/cruds/area-conhecimento/area-conhecimento.component';
import { EstruturaCurricularComponent } from 'app-core/lib/components/cruds/estrutura-curricular/estrutura-curricular.component';
import { VisualizarAreaConhecimentoComponent } from 'app-core/lib/components/cruds/area-conhecimento/visualizar-area-conhecimento/visualizar-area-conhecimento.component';
import { CadastrarAreaConhecimentoComponent } from 'app-core/lib/components/cruds/area-conhecimento/cadastrar-area-conhecimento/cadastrar-area-conhecimento.component';
import { VisualizarSubareaConhecimentoComponent } from 'app-core/lib/components/cruds/subarea-conhecimento/visualizar-subarea-conhecimento/visualizar-subarea-conhecimento.component';
import { CadastrarSubareaConhecimentoComponent } from 'app-core/lib/components/cruds/subarea-conhecimento/cadastrar-subarea-conhecimento/cadastrar-subarea-conhecimento.component';
import { CadastrarEstruturaCurricularComponent } from 'app-core/lib/components/cruds/estrutura-curricular/cadastrar-estrutura-curricular/cadastrar-estrutura-curricular.component';
import { VisualizarEstruturaCurricularComponent } from 'app-core/lib/components/cruds/estrutura-curricular/visualizar-estrutura-curricular/visualizar-estrutura-curricular.component';
import { DisciplinaComponent } from 'app-core/lib/components/cruds/disciplina/disciplina.component';
import { VisualizarDisciplinaComponent } from 'app-core/lib/components/cruds/disciplina/visualizar-disciplina/visualizar-disciplina.component';
import { CadastrarDisciplinaComponent } from 'app-core/lib/components/cruds/disciplina/cadastrar-disciplina/cadastrar-disciplina.component';
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
    VisualizarDisciplinaComponent,
    HeaderComponent,
    MenuLateralComponent,
    LayoutComponent
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
