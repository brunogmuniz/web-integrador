import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from "./layout/layout.component";
import { PrincipalComponent } from "./principal/principal.component";
import { DocenteComponent } from "app-core/lib/components/cruds/docente/docente.component";
import { VisualizarDocenteComponent } from "app-core/lib/components/cruds/docente/visualizar-docente/visualizar-docente.component";
import { CadastrarDocenteComponent } from "app-core/lib/components/cruds/docente/cadastrar-docente/cadastrar-docente.component";
import { SubareaConhecimentoComponent } from "app-core/lib/components/cruds/subarea-conhecimento/subarea-conhecimento.component";
import { VisualizarSubareaConhecimentoComponent } from "app-core/lib/components/cruds/subarea-conhecimento/visualizar-subarea-conhecimento/visualizar-subarea-conhecimento.component";
import { CadastrarSubareaConhecimentoComponent } from "app-core/lib/components/cruds/subarea-conhecimento/cadastrar-subarea-conhecimento/cadastrar-subarea-conhecimento.component";
import { AreaConhecimentoComponent } from "app-core/lib/components/cruds/area-conhecimento/area-conhecimento.component";
import { VisualizarAreaConhecimentoComponent } from "app-core/lib/components/cruds/area-conhecimento/visualizar-area-conhecimento/visualizar-area-conhecimento.component";
import { CadastrarAreaConhecimentoComponent } from "app-core/lib/components/cruds/area-conhecimento/cadastrar-area-conhecimento/cadastrar-area-conhecimento.component";
import { EstruturaCurricularComponent } from "app-core/lib/components/cruds/estrutura-curricular/estrutura-curricular.component";
import { VisualizarEstruturaCurricularComponent } from 'app-core/lib/components/cruds/estrutura-curricular/visualizar-estrutura-curricular/visualizar-estrutura-curricular.component';
import { CadastrarEstruturaCurricularComponent } from "app-core/lib/components/cruds/estrutura-curricular/cadastrar-estrutura-curricular/cadastrar-estrutura-curricular.component";
import { DocenteEncargosComponent } from "app-core/lib/components/cruds/docente-encargos/docente-encargos.component";
import { VisualizarDocenteEncargosComponent } from "app-core/lib/components/cruds/docente-encargos/visualizar-docente-encargos/visualizar-docente-encargos.component";
import { CadastrarDocentesEncargosComponent } from "app-core/lib/components/cruds/docente-encargos/cadastrar-docentes-encargos/cadastrar-docentes-encargos.component";
import { DisciplinaComponent } from 'app-core/lib/components/cruds/disciplina/disciplina.component';
import { VisualizarDisciplinaComponent } from "app-core/lib/components/cruds/disciplina/visualizar-disciplina/visualizar-disciplina.component";
import { CadastrarDisciplinaComponent } from "app-core/lib/components/cruds/disciplina/cadastrar-disciplina/cadastrar-disciplina.component";
import { UsuarioComponent } from 'app-core/lib/components/cruds/usuario/usuario.component';
import { CadastrarUsuarioComponent } from 'app-core/lib/components/cruds/usuario/cadastrar-usuario/cadastrar-usuario.component';

import {
  adminGuard,
  cadastroCompletoGuard,
  authGuard,
  UnidadeComponent,
  VisualizarUnidadeComponent,
  CadastrarUnidadeComponent
} from 'app-core';
import {
  UnidadeUsuarioComponent,
  VisualizarUnidadeUsuarioComponent,
  CadastrarUnidadeUsuarioComponent
} from 'app-core';
import {CursoComponent} from "app-core/lib/components/cruds/curso/curso.component";
import {
  VisualizarCursoComponent
} from "app-core/lib/components/cruds/curso/visualizar-curso/visualizar-curso.component";
import {CadastrarCursoComponent} from "app-core/lib/components/cruds/curso/cadastrar-curso/cadastrar-curso.component";
import { OfertaComponent } from "app-core/lib/components/cruds/oferta/oferta.component";
import { VisualizarOfertaComponent } from "app-core/lib/components/cruds/oferta/visualizar-oferta/visualizar-oferta.component";
import { CadastrarOfertaComponent } from "app-core/lib/components/cruds/oferta/cadastrar-oferta/cadastrar-oferta.component";
import { DisciplinaOfertaComponent } from "app-core/lib/components/cruds/disciplina-oferta/disciplina-oferta.component";
import { CadastrarDisciplinaOfertaComponent } from "app-core/lib/components/cruds/disciplina-oferta/cadastrar-disciplina-oferta/cadastrar-disciplina-oferta.component";

const routes: Routes = [
  {
    path: 'atualizar-cadastro',
    loadChildren: () => import('app-core').then(m => m.AtualizarCadastroModule),
    canActivate: [authGuard, adminGuard]
  },

  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard, adminGuard, cadastroCompletoGuard],
    children: [
      {
        path: '',
        component: PrincipalComponent
      },

      {
        path: 'docente',
        component: DocenteComponent,
        children: [
          { path: '', redirectTo: 'visualizar', pathMatch: 'full' },
          { path: 'visualizar', component: VisualizarDocenteComponent },
          { path: 'form/novo', component: CadastrarDocenteComponent },
          { path: 'form/editar/:id', component: CadastrarDocenteComponent }
        ]
      },

      {
        path: 'curso',
        component: CursoComponent,
        children: [
          { path: '', redirectTo: 'visualizar', pathMatch: 'full' },
          { path: 'visualizar', component: VisualizarCursoComponent },
          { path: 'form/novo', component: CadastrarCursoComponent },
          { path: 'form/editar/:id', component: CadastrarCursoComponent }
        ]
      },

      {
        path: 'sub-area',
        component: SubareaConhecimentoComponent,
        children: [
          { path: '', redirectTo: 'visualizar', pathMatch: 'full' },
          { path: 'visualizar', component: VisualizarSubareaConhecimentoComponent },
          { path: 'form/novo', component: CadastrarSubareaConhecimentoComponent },
          { path: 'form/editar/:id', component: CadastrarSubareaConhecimentoComponent }
        ]
      },

      {
        path: 'area',
        component: AreaConhecimentoComponent,
        children: [
          { path: '', redirectTo: 'visualizar', pathMatch: 'full' },
          { path: 'visualizar', component: VisualizarAreaConhecimentoComponent },
          { path: 'form/novo', component: CadastrarAreaConhecimentoComponent },
          { path: 'form/editar/:id', component: CadastrarAreaConhecimentoComponent }
        ]
      },

      {
        path: 'usuario',
        component: UsuarioComponent,
        children: [
          { path: 'form/novo', component: CadastrarUsuarioComponent }
        ]
      },

      {
        path: 'estrutura-curricular',
        component: EstruturaCurricularComponent,
        children: [
          { path: '', redirectTo: 'visualizar', pathMatch: 'full' },
          { path: 'visualizar', component: VisualizarEstruturaCurricularComponent },
          { path: 'form/novo', component: CadastrarEstruturaCurricularComponent },
          { path: 'form/editar/:id', component: CadastrarEstruturaCurricularComponent }
        ]
      },

      {
        path: 'unidades',
        component: UnidadeComponent,
        children: [
          { path: '', redirectTo: 'visualizar', pathMatch: 'full' },
          { path: 'visualizar', component: VisualizarUnidadeComponent },
          { path: 'form/novo', component: CadastrarUnidadeComponent },
          { path: 'form/:uuid', component: CadastrarUnidadeComponent }
        ]
      },

      {
        path: 'unidades-usuarios',
        component: UnidadeUsuarioComponent,
        children: [
          { path: '', redirectTo: 'visualizar', pathMatch: 'full' },
          { path: 'visualizar', component: VisualizarUnidadeUsuarioComponent },
          { path: 'form/novo', component: CadastrarUnidadeUsuarioComponent },
          { path: 'form/:uuid', component: CadastrarUnidadeUsuarioComponent }
        ]
      },

      {
        path: 'docente-encargos',
        component: DocenteEncargosComponent,
        children: [
          { path: '', redirectTo: 'visualizar', pathMatch: 'full' },
          { path: 'visualizar', component: VisualizarDocenteEncargosComponent },
          { path: 'form/novo', component: CadastrarDocentesEncargosComponent },
          { path: 'form/editar/:uuid', component: CadastrarDocentesEncargosComponent }
        ]
      },

      {
        path: 'disciplina',
        component: DisciplinaComponent,
        children: [
          { path: '', redirectTo: 'visualizar', pathMatch: 'full' },
          { path: 'visualizar', component: VisualizarDisciplinaComponent },
          { path: 'form/novo', component: CadastrarDisciplinaComponent },
          { path: 'form/editar/:id', component: CadastrarDisciplinaComponent }
        ]
      },
      {
        path: 'oferta',
        component: OfertaComponent,
        children: [
          { path: '', redirectTo: 'visualizar', pathMatch: 'full' },
          { path: 'visualizar', component: VisualizarOfertaComponent },
          { path: 'form/novo', component: CadastrarOfertaComponent },
          { path: 'form/editar/:id', component: CadastrarOfertaComponent }
        ]
      },
      {
        path: 'disciplina-oferta',
        component: DisciplinaOfertaComponent,
        children: [
          { path: '', redirectTo: 'form/novo', pathMatch: 'full' },
          { path: 'form/novo', component: CadastrarDisciplinaOfertaComponent },
          { path: 'form/editar/:uuid', component: CadastrarDisciplinaOfertaComponent }
        ]
      }
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
