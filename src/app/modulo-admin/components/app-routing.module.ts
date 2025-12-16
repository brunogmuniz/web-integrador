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
  EditarDocenteEncargosComponent
} from "./docente-encargos/editar-docente-encargos/editar-docente-encargos.component";
import {
  VisualizarDocenteEncargosComponent
} from "./docente-encargos/visualizar-docente-encargos/visualizar-docente-encargos.component";
import {SubareaConhecimentoComponent} from "./subarea-conhecimento/subarea-conhecimento.component";
import {AreaConhecimentoComponent} from "./area-conhecimento/area-conhecimento.component";
import {EstruturaCurricularComponent} from "./estrutura-curricular/estrutura-curricular.component";
import {
  VisualizarEstruturaCurricularComponent
} from "./estrutura-curricular/visualizar-estrutura-curricular/visualizar-estrutura-curricular.component";
import {
  CadastrarEstruturaCurricularComponent
} from "./estrutura-curricular/cadastrar-estrutura-curricular/cadastrar-estrutura-curricular.component";
import {
  EditarEstruturaCurricularComponent
} from "./estrutura-curricular/editar-estrutura-curricular/editar-estrutura-curricular.component";
import { DisciplinaComponent } from './disciplina/disciplina.component';
import {VisualizarDisciplinaComponent} from "./disciplina/visualizar-disciplina/visualizar-disciplina.component";
import {CadastrarDisciplinaComponent} from "./disciplina/cadastrar-disciplina/cadastrar-disciplina.component";
import {EditarDisciplinaComponent} from "./disciplina/editar-disciplina/editar-disciplina.component";
import {PrincipalComponent} from "./principal/principal.component";

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
  {
    path: 'estrutura-curricular',
    component: EstruturaCurricularComponent,
    children: [
      { path: '', redirectTo: 'visualizar', pathMatch: 'full' },
      { path: 'visualizar', component: VisualizarEstruturaCurricularComponent },
      { path: 'novo', component: CadastrarEstruturaCurricularComponent },
      { path: 'editar/:id', component: EditarEstruturaCurricularComponent }
    ]
  },
  {
    path: 'docente-encargos',
    component: DocenteEncargosComponent,
    children: [
      { path: '', redirectTo: 'visualizar', pathMatch: 'full' },
      { path: 'visualizar', component: VisualizarDocenteEncargosComponent },
      { path: 'novo', component: CadastrarDocentesEncargosComponent },
      { path: 'editar/:id', component: EditarDocenteEncargosComponent }
    ]
  },
  {
    path: 'disciplina',
    component: DisciplinaComponent,
    children: [
      { path: '', redirectTo: 'visualizar', pathMatch: 'full' },
      { path: 'visualizar', component: VisualizarDisciplinaComponent },
      { path: 'novo', component: CadastrarDisciplinaComponent },
      { path: 'editar/:id', component: EditarDisciplinaComponent }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
