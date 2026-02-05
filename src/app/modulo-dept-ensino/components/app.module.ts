import {APP_INITIALIZER, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PrincipalComponent } from './principal/principal.component';
import { AnaliseDasMedias } from './principal/analise-das-medias/analise-das-medias';
import { AreaTabelaComponent } from './utils/area-tabela/area-tabela';
import { MenuLateralComponent } from './utils/menu-lateral/menu-lateral.component';
import { HeaderComponent } from './utils/header/header.component';
import {APP_AUTH_CONFIG, AppCoreModule, FormInput, initializeAppFactory, LoginService} from "app-core";
import {HttpClient, HttpClientModule, provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";
import {AuthConfig, OAuthModule, OAuthService, OAuthStorage} from "angular-oauth2-oidc";
import {NgxMaskDirective, NgxMaskPipe, provideNgxMask} from "ngx-mask";
import {environment} from "../../../environments/enviroment";
import {LayoutComponent} from "../../modulo-admin/components/layout/layout.component";
import {DocenteComponent} from "app-core/lib/components/cruds/docente/docente.component";
import {
  CadastrarDocenteComponent
} from "app-core/lib/components/cruds/docente/cadastrar-docente/cadastrar-docente.component";
import {
  VisualizarDocenteComponent
} from "app-core/lib/components/cruds/docente/visualizar-docente/visualizar-docente.component";
import {DocenteEncargosComponent} from "app-core/lib/components/cruds/docente-encargos/docente-encargos.component";
import {
  CadastrarDocentesEncargosComponent
} from "app-core/lib/components/cruds/docente-encargos/cadastrar-docentes-encargos/cadastrar-docentes-encargos.component";
import {
  VisualizarDocenteEncargosComponent
} from "app-core/lib/components/cruds/docente-encargos/visualizar-docente-encargos/visualizar-docente-encargos.component";
import {
  SubareaConhecimentoComponent
} from "app-core/lib/components/cruds/subarea-conhecimento/subarea-conhecimento.component";
import {
  CadastrarSubareaConhecimentoComponent
} from "app-core/lib/components/cruds/subarea-conhecimento/cadastrar-subarea-conhecimento/cadastrar-subarea-conhecimento.component";
import {
  VisualizarSubareaConhecimentoComponent
} from "app-core/lib/components/cruds/subarea-conhecimento/visualizar-subarea-conhecimento/visualizar-subarea-conhecimento.component";
import {AreaConhecimentoComponent} from "app-core/lib/components/cruds/area-conhecimento/area-conhecimento.component";
import {
  CadastrarAreaConhecimentoComponent
} from "app-core/lib/components/cruds/area-conhecimento/cadastrar-area-conhecimento/cadastrar-area-conhecimento.component";
import {
  VisualizarAreaConhecimentoComponent
} from "app-core/lib/components/cruds/area-conhecimento/visualizar-area-conhecimento/visualizar-area-conhecimento.component";
import {
  EstruturaCurricularComponent
} from "app-core/lib/components/cruds/estrutura-curricular/estrutura-curricular.component";
import {
  CadastrarEstruturaCurricularComponent
} from "app-core/lib/components/cruds/estrutura-curricular/cadastrar-estrutura-curricular/cadastrar-estrutura-curricular.component";
import {
  VisualizarEstruturaCurricularComponent
} from "app-core/lib/components/cruds/estrutura-curricular/visualizar-estrutura-curricular/visualizar-estrutura-curricular.component";
import {DisciplinaComponent} from "app-core/lib/components/cruds/disciplina/disciplina.component";
import {
  CadastrarDisciplinaComponent
} from "app-core/lib/components/cruds/disciplina/cadastrar-disciplina/cadastrar-disciplina.component";
import {
  VisualizarDisciplinaComponent
} from "app-core/lib/components/cruds/disciplina/visualizar-disciplina/visualizar-disciplina.component";
import {RouterModule} from "@angular/router";


const authConfig: AuthConfig = {
  issuer: 'http://localhost:8081/realms/ufsm',
  clientId: 'webClient',
  redirectUri: 'http://localhost:4203/',
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
    AreaTabelaComponent,
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
    AnaliseDasMedias,
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
