import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DocenteComponent} from "./docente/docente.component";
import {VisualizarDocenteComponent} from "./docente/visualizar-docente/visualizar-docente.component";
import {CadastrarDocenteComponent} from "./docente/cadastrar-docente/cadastrar-docente.component";
import {EditarDocenteComponent} from "./docente/editar-docente/editar-docente.component";
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
  {path: 'principal', component: PrincipalComponent},
  {
    path: 'docente',
    component: DocenteComponent,
    children: [
      { path: '', redirectTo: 'visualizar', pathMatch: 'full' },
      { path: 'visualizar', component: VisualizarDocenteComponent },
      { path: 'novo', component: CadastrarDocenteComponent },
      { path: 'editar/:id', component: EditarDocenteComponent }
    ]
  },
  {
    path: 'sub-area',
    component: DocenteComponent,
    children: [
      { path: '', redirectTo: 'visualizar', pathMatch: 'full' },
      { path: 'visualizar', component: VisualizarSubareaConhecimentoComponent },
      { path: 'novo', component: CadastrarSubareaConhecimentoComponent },
    ]
  },
  {
    path: 'area',
    component: AreaConhecimentoComponent,
    children: [
      { path: '', redirectTo: 'visualizar', pathMatch: 'full' },
      { path: 'visualizar', component: VisualizarAreaConhecimentoComponent },
      { path: 'novo', component: CadastrarAreaConhecimentoComponent }
    ]
  },
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
      { path: 'novo', component: CadastrarDocentesEncargosComponent },
      { path: 'editar/:id', component: EditarDocenteEncargosComponent }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
