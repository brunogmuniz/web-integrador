import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DocenteComponent} from "./docente/docente.component";
import {VisualizarDocenteComponent} from "./docente/visualizar-docente/visualizar-docente.component";
import {CadastrarDocenteComponent} from "./docente/cadastrar-docente/cadastrar-docente.component";
import {DocenteEncargosComponent} from "./docente-encargos/docente-encargos.component";
import {
  CadastrarDocentesEncargosComponent
} from "./docente-encargos/cadastrar-docentes-encargos/cadastrar-docentes-encargos.component";
import {
  VisualizarDocenteEncargosComponent
} from "./docente-encargos/visualizar-docente-encargos/visualizar-docente-encargos.component";
import {SubareaConhecimentoComponent} from "./subarea-conhecimento/subarea-conhecimento.component";
import {AreaConhecimentoComponent} from "./area-conhecimento/area-conhecimento.component";
import {EstruturaCurricularComponent} from "./estrutura-curricular/estrutura-curricular.component";
import {
  VisualizarEstruturaCurricularComponent
} from "./estrutura-curricular/visualizar-estrutura/visualizar-estrutura.component";
import {CadastrarEstruturaComponent} from "./estrutura-curricular/cadastrar-estrutura/cadastrar-estrutura.component";
import {
  VisualizarAreaConhecimentoComponent
} from "./area-conhecimento/visualizar-area-conhecimento/visualizar-area-conhecimento.component";
import {
  CadastrarAreaConhecimentoComponent
} from "./area-conhecimento/cadastrar-area-conhecimento/cadastrar-area-conhecimento.component";
import {PrincipalComponent} from "./principal/principal.component";
import {
  VisualizarSubareaConhecimentoComponent
} from "./subarea-conhecimento/visualizar-subarea-conhecimento/visualizar-subarea-conhecimento.component";
import {
  CadastrarSubareaConhecimentoComponent
} from "./subarea-conhecimento/cadastrar-subarea-conhecimento/cadastrar-subarea-conhecimento.component";

const routes: Routes = [
  {path: '', component: PrincipalComponent},
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
  // {
  //   path: 'disciplina',
  //   component: DisciplinaComponent,
  //   children: [
  //     { path: '', redirectTo: 'visualizar', pathMatch: 'full' },
  //     { path: 'visualizar', component: VisualizarDisciplinaComponent },
  //     { path: 'form/novo', component: CadastrarDisciplinaComponent },
  //     { path: 'form/editar/:id', component: CadastrarDisciplinaComponent }
  //   ]
  // },
  {
    path: 'estrutura',
    component: EstruturaCurricularComponent,
    children: [
      { path: '', redirectTo: 'visualizar', pathMatch: 'full' },
      { path: 'visualizar', component: VisualizarEstruturaCurricularComponent },
      { path: 'novo', component: CadastrarEstruturaComponent }
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

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
