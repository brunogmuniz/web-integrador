import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DocenteComponent } from './docente/docente.component';
import { CadastrarDocenteComponent } from './docente/cadastrar-docente/cadastrar-docente.component';
import { EditarDocenteComponent } from './docente/editar-docente/editar-docente.component';
import {RouterModule} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FormInput} from "../../app-core/src/lib/components/form-input-padrao/form-input-padrao";
import {VisualizarDocenteComponent} from "./docente/visualizar-docente/visualizar-docente.component";
import {DocenteService} from "../../app-core/src/lib/services/docente-service";
import {HttpClientModule} from "@angular/common/http";
import { DocenteEncargosComponent } from './docente-encargos/docente-encargos.component';
import { CadastrarDocentesEncargosComponent } from './docente-encargos/cadastrar-docentes-encargos/cadastrar-docentes-encargos.component';
import { EditarDocenteEncargosComponent } from './docente-encargos/editar-docente-encargos/editar-docente-encargos.component';
import { VisualizarDocenteEncargosComponent } from './docente-encargos/visualizar-docente-encargos/visualizar-docente-encargos.component';
import { SubareaConhecimentoComponent } from './subarea-conhecimento/subarea-conhecimento.component';
import { AreaConhecimentoComponent } from './area-conhecimento/area-conhecimento.component';
import { EstruturaCurricularComponent } from './estrutura-curricular/estrutura-curricular.component';
import {MenuLateralComponent} from "./utils/menu-lateral/menu-lateral.component";
import {HeaderComponent} from "./utils/header/header.component";
import { VisualizarEstruturaCurricularComponent } from './estrutura-curricular/visualizar-estrutura/visualizar-estrutura.component';
import { CadastrarEstruturaComponent } from './estrutura-curricular/cadastrar-estrutura/cadastrar-estrutura.component';
import { VisualizarAreaConhecimentoComponent } from './area-conhecimento/visualizar-area-conhecimento/visualizar-area-conhecimento.component';
import { CadastrarAreaConhecimentoComponent } from './area-conhecimento/cadastrar-area-conhecimento/cadastrar-area-conhecimento.component';
import { PrincipalComponent } from './principal/principal.component';
import { VisualizarSubareaConhecimentoComponent } from './subarea-conhecimento/visualizar-subarea-conhecimento/visualizar-subarea-conhecimento.component';
import { CadastrarSubareaConhecimentoComponent } from './subarea-conhecimento/cadastrar-subarea-conhecimento/cadastrar-subarea-conhecimento.component';

@NgModule({
  declarations: [
    AppComponent,
    DocenteComponent,
    CadastrarDocenteComponent,
    EditarDocenteComponent,
    VisualizarDocenteComponent,
    DocenteEncargosComponent,
    CadastrarDocentesEncargosComponent,
    EditarDocenteEncargosComponent,
    VisualizarDocenteEncargosComponent,
    SubareaConhecimentoComponent,
    AreaConhecimentoComponent,
    EstruturaCurricularComponent,
    MenuLateralComponent,
    HeaderComponent,
    VisualizarEstruturaCurricularComponent,
    CadastrarEstruturaComponent,
    VisualizarAreaConhecimentoComponent,
    CadastrarAreaConhecimentoComponent,
    PrincipalComponent,
    VisualizarSubareaConhecimentoComponent,
    CadastrarSubareaConhecimentoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    ReactiveFormsModule,
    FormInput,
    FormsModule,
    FormInput,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
