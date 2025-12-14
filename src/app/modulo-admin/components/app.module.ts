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
import {HttpClientModule} from "@angular/common/http";
import { DocenteEncargosComponent } from './docente-encargos/docente-encargos.component';
import { CadastrarDocentesEncargosComponent } from './docente-encargos/cadastrar-docentes-encargos/cadastrar-docentes-encargos.component';
import { EditarDocenteEncargosComponent } from './docente-encargos/editar-docente-encargos/editar-docente-encargos.component';
import { VisualizarDocenteEncargosComponent } from './docente-encargos/visualizar-docente-encargos/visualizar-docente-encargos.component';
import { SubareaConhecimentoComponent } from './subarea-conhecimento/subarea-conhecimento.component';
import { AreaConhecimentoComponent } from './area-conhecimento/area-conhecimento.component';
import { EstruturaCurricularComponent } from './estrutura-curricular/estrutura-curricular.component';
import { CadastrarEstruturaCurricularComponent } from './estrutura-curricular/cadastrar-estrutura-curricular/cadastrar-estrutura-curricular.component';
import { EditarEstruturaCurricularComponent } from './estrutura-curricular/editar-estrutura-curricular/editar-estrutura-curricular.component';
import { VisualizarEstruturaCurricularComponent } from './estrutura-curricular/visualizar-estrutura-curricular/visualizar-estrutura-curricular.component';
import { DisciplinaComponent } from './disciplina/disciplina.component';
import { VisualizarDisciplinaComponent } from './disciplina/visualizar-disciplina/visualizar-disciplina.component';
import { EditarDisciplinaComponent } from './disciplina/editar-disciplina/editar-disciplina.component';
import { CadastrarDisciplinaComponent } from './disciplina/cadastrar-disciplina/cadastrar-disciplina.component';

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
    CadastrarEstruturaCurricularComponent,
    EditarEstruturaCurricularComponent,
    VisualizarEstruturaCurricularComponent,
    DisciplinaComponent,
    VisualizarDisciplinaComponent,
    EditarDisciplinaComponent,
    CadastrarDisciplinaComponent
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
