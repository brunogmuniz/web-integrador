import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PrincipalComponent } from "./principal/principal.component";
import { DocenteComponent } from "./docente/docente.component";
import { VisualizarDocenteComponent } from "./docente/visualizar-docente/visualizar-docente.component";
import { CadastrarDocenteComponent } from "./docente/cadastrar-docente/cadastrar-docente.component";
import { SubareaConhecimentoComponent } from "./subarea-conhecimento/subarea-conhecimento.component";
import { VisualizarSubareaConhecimentoComponent } from "./subarea-conhecimento/visualizar-subarea-conhecimento/visualizar-subarea-conhecimento.component";
import { CadastrarSubareaConhecimentoComponent } from "./subarea-conhecimento/cadastrar-subarea-conhecimento/cadastrar-subarea-conhecimento.component";
import { AreaConhecimentoComponent } from "./area-conhecimento/area-conhecimento.component";
import { VisualizarAreaConhecimentoComponent } from "./area-conhecimento/visualizar-area-conhecimento/visualizar-area-conhecimento.component";
import { CadastrarAreaConhecimentoComponent } from "./area-conhecimento/cadastrar-area-conhecimento/cadastrar-area-conhecimento.component";
import { EstruturaCurricularComponent } from "./estrutura-curricular/estrutura-curricular.component";
import { VisualizarEstruturaCurricularComponent } from './estrutura-curricular/visualizar-estrutura-curricular/visualizar-estrutura-curricular.component';
import { CadastrarEstruturaCurricularComponent } from "./estrutura-curricular/cadastrar-estrutura-curricular/cadastrar-estrutura-curricular.component";
import { DocenteEncargosComponent } from "./docente-encargos/docente-encargos.component";
import { VisualizarDocenteEncargosComponent } from "./docente-encargos/visualizar-docente-encargos/visualizar-docente-encargos.component";
import { CadastrarDocentesEncargosComponent } from "./docente-encargos/cadastrar-docentes-encargos/cadastrar-docentes-encargos.component";
import { DisciplinaComponent } from './disciplina/disciplina.component';
import { VisualizarDisciplinaComponent } from "./disciplina/visualizar-disciplina/visualizar-disciplina.component";
import { CadastrarDisciplinaComponent } from "./disciplina/cadastrar-disciplina/cadastrar-disciplina.component";

import { AuthGuard } from '../../app-core/src/public-api';
import {LayoutComponent} from "./layout/layout.component";

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
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
        path: 'docente-encargos',
        component: DocenteEncargosComponent,
        children: [
          { path: '', redirectTo: 'visualizar', pathMatch: 'full' },
          { path: 'visualizar', component: VisualizarDocenteEncargosComponent },
          { path: 'form/novo', component: CadastrarDocentesEncargosComponent },
          { path: 'form/editar/:id', component: CadastrarDocentesEncargosComponent }
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
      }
    ]
  },

  { path: 'subarea', redirectTo: 'sub-area', pathMatch: 'full' },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
