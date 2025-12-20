import { NgModule } from '@angular/core';
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
import {OAuthModule} from "angular-oauth2-oidc";
import {environment} from "../../../environments/enviroment";

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
    MenuLateralComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    ReactiveFormsModule,
    FormInput,
    FormsModule,
    OAuthModule.forRoot({
      resourceServer: {
        allowedUrls: [environment.apiUrl],
        sendAccessToken: true,
      },
    })
  ],
  providers: [ provideHttpClient(withInterceptorsFromDi())],
  bootstrap: [AppComponent]
})
export class AppModule { }
