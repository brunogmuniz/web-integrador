import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { FormInput } from './components/form-input-padrao/form-input-padrao';
import { ImageProfileComponent } from './components/image-profile/image-profile.component';
import { PaginadorComponent } from './components/paginador/paginador.component';
import { UploadPlanilhaComponent } from './components/upload-planilha/upload-planilha.component';
import { UserMenuComponent } from './components/user-menu/user-menu.component';

import { AreaConhecimentoComponent } from './components/cruds/area-conhecimento/area-conhecimento.component';
import { CadastrarAreaConhecimentoComponent } from './components/cruds/area-conhecimento/cadastrar-area-conhecimento/cadastrar-area-conhecimento.component';
import { VisualizarAreaConhecimentoComponent } from './components/cruds/area-conhecimento/visualizar-area-conhecimento/visualizar-area-conhecimento.component';

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

import { SubareaConhecimentoComponent } from './components/cruds/subarea-conhecimento/subarea-conhecimento.component';
import { CadastrarSubareaConhecimentoComponent } from './components/cruds/subarea-conhecimento/cadastrar-subarea-conhecimento/cadastrar-subarea-conhecimento.component';
import { VisualizarSubareaConhecimentoComponent } from './components/cruds/subarea-conhecimento/visualizar-subarea-conhecimento/visualizar-subarea-conhecimento.component';

import { UnidadeComponent } from './components/cruds/unidade/unidade.component';
import { CadastrarUnidadeComponent } from './components/cruds/unidade/cadastrar-unidade/cadastrar-unidade.component';
import { VisualizarUnidadeComponent } from './components/cruds/unidade/visualizar-unidade/visualizar-unidade.component';

import { UnidadeUsuarioComponent } from './components/cruds/unidade-usuario/unidade-usuario.component';
import { CadastrarUnidadeUsuarioComponent } from './components/cruds/unidade-usuario/cadastrar-unidade-usuario/cadastrar-unidade-usuario.component';
import { VisualizarUnidadeUsuarioComponent } from './components/cruds/unidade-usuario/visualizar-unidade-usuario/visualizar-unidade-usuario.component';

import { UsuarioComponent } from './components/cruds/usuario/usuario.component';
import { CadastrarUsuarioComponent } from './components/cruds/usuario/cadastrar-usuario/cadastrar-usuario.component';
import { VisualizarUsuarioComponent } from './components/cruds/usuario/visualizar-usuario/visualizar-usuario.component';

import { CursoComponent } from './components/cruds/curso/curso.component';
import { CadastrarCursoComponent } from './components/cruds/curso/cadastrar-curso/cadastrar-curso.component';
import { VisualizarCursoComponent } from './components/cruds/curso/visualizar-curso/visualizar-curso.component';

import { VisualizarProjetosComponent } from './components/projetos/visualizar-projetos/visualizar-projetos.component';
import { DetalhesProjetoComponent } from './components/projetos/detalhes-projeto/detalhes-projeto.component';
import { ViewInputComponent } from './components/view-input/view-input.component';
import {LayoutModule} from "../../../modulo-projetos/components/layout/layout.module";

@NgModule({
  declarations: [
    AreaConhecimentoComponent,
    CadastrarAreaConhecimentoComponent,

    DisciplinaComponent,
    CadastrarDisciplinaComponent,

    DocenteComponent,
    CadastrarDocenteComponent,

    DocenteEncargosComponent,
    CadastrarDocentesEncargosComponent,

    EstruturaCurricularComponent,
    CadastrarEstruturaCurricularComponent,

    SubareaConhecimentoComponent,
    CadastrarSubareaConhecimentoComponent,

    UnidadeComponent,
    CadastrarUnidadeComponent,

    UnidadeUsuarioComponent,
    CadastrarUnidadeUsuarioComponent,

    UsuarioComponent,
    CadastrarUsuarioComponent,

    CursoComponent,
    CadastrarCursoComponent,

    ImageProfileComponent,
    PaginadorComponent,
    UploadPlanilhaComponent,
    UserMenuComponent,

    VisualizarAreaConhecimentoComponent,
    VisualizarDisciplinaComponent,
    VisualizarDocenteComponent,
    VisualizarDocenteEncargosComponent,
    VisualizarEstruturaCurricularComponent,
    VisualizarSubareaConhecimentoComponent,
    VisualizarUnidadeComponent,
    VisualizarUnidadeUsuarioComponent,
    VisualizarUsuarioComponent,
    VisualizarCursoComponent,

    VisualizarProjetosComponent,
    DetalhesProjetoComponent,
    ViewInputComponent
  ],
  imports: [
    CommonModule,
    FormInput,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [
    CadastrarUnidadeComponent,
    CadastrarUnidadeUsuarioComponent,
    FormInput,
    FormsModule,
    ImageProfileComponent,
    PaginadorComponent,
    ReactiveFormsModule,
    RouterModule,
    UnidadeComponent,
    UploadPlanilhaComponent,
    UserMenuComponent,
    VisualizarUnidadeComponent,
    VisualizarUnidadeUsuarioComponent
  ]
})
export class AppCoreModule { }
