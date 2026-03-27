import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormInput } from './components/form-input-padrao/form-input-padrao';
import { ImageProfileComponent } from './components/image-profile/image-profile.component';
import { AreaConhecimentoComponent } from './components/cruds/area-conhecimento/area-conhecimento.component';
import { CadastrarAreaConhecimentoComponent } from './components/cruds/area-conhecimento/cadastrar-area-conhecimento/cadastrar-area-conhecimento.component';
import { VisualizarAreaConhecimentoComponent } from './components/cruds/area-conhecimento/visualizar-area-conhecimento/visualizar-area-conhecimento.component';
import { SubareaConhecimentoComponent } from './components/cruds/subarea-conhecimento/subarea-conhecimento.component';
import { CadastrarSubareaConhecimentoComponent } from './components/cruds/subarea-conhecimento/cadastrar-subarea-conhecimento/cadastrar-subarea-conhecimento.component';
import { VisualizarSubareaConhecimentoComponent } from './components/cruds/subarea-conhecimento/visualizar-subarea-conhecimento/visualizar-subarea-conhecimento.component';
import { DisciplinaComponent } from './components/cruds/disciplina/disciplina.component';
import { CadastrarDisciplinaComponent } from './components/cruds/disciplina/cadastrar-disciplina/cadastrar-disciplina.component';
import { VisualizarDisciplinaComponent } from './components/cruds/disciplina/visualizar-disciplina/visualizar-disciplina.component';
import { DocenteComponent } from './components/cruds/docente/docente.component';
import { CadastrarDocenteComponent } from './components/cruds/docente/cadastrar-docente/cadastrar-docente.component';
import { VisualizarDocenteComponent } from './components/cruds/docente/visualizar-docente/visualizar-docente.component';
import { DocenteEncargosComponent } from './components/cruds/docente-encargos/docente-encargos.component';
import { CadastrarDocentesEncargosComponent } from './components/cruds/docente-encargos/cadastrar-docentes-encargos/cadastrar-docentes-encargos.component';
import { VisualizarDocenteEncargosComponent } from './components/cruds/docente-encargos/visualizar-docente-encargos/visualizar-docente-encargos.component';
import { EstruturaCurricularComponent } from './components/cruds/estrutura-curricular/estrutura-curricular.component';
import { CadastrarEstruturaCurricularComponent } from './components/cruds/estrutura-curricular/cadastrar-estrutura-curricular/cadastrar-estrutura-curricular.component';
import { VisualizarEstruturaCurricularComponent } from './components/cruds/estrutura-curricular/visualizar-estrutura-curricular/visualizar-estrutura-curricular.component';
import { UploadPlanilhaComponent } from './components/upload-planilha/upload-planilha.component';
import { PaginadorComponent } from './components/paginador/paginador.component';

@NgModule({
  declarations: [
    ImageProfileComponent,
    AreaConhecimentoComponent,
    CadastrarAreaConhecimentoComponent,
    VisualizarAreaConhecimentoComponent,
    SubareaConhecimentoComponent,
    CadastrarSubareaConhecimentoComponent,
    VisualizarSubareaConhecimentoComponent,
    DisciplinaComponent,
    CadastrarDisciplinaComponent,
    VisualizarDisciplinaComponent,
    DocenteComponent,
    CadastrarDocenteComponent,
    VisualizarDocenteComponent,
    DocenteEncargosComponent,
    CadastrarDocentesEncargosComponent,
    VisualizarDocenteEncargosComponent,
    EstruturaCurricularComponent,
    CadastrarEstruturaCurricularComponent,
    VisualizarEstruturaCurricularComponent,
    UploadPlanilhaComponent,
    PaginadorComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    FormInput
  ],
  exports: [
    FormInput,
    ImageProfileComponent,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    UploadPlanilhaComponent,
    PaginadorComponent
  ]
})
export class AppCoreModule { }
