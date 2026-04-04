import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PrincipalComponent} from "./principal/principal.component";
import {LayoutComponent} from "./layout/layout.component";
import {authGuard, cadastroCompletoGuard} from "app-core";
import {DocenteComponent} from "app-core/lib/components/cruds/docente/docente.component";
import {
  VisualizarDocenteComponent
} from "app-core/lib/components/cruds/docente/visualizar-docente/visualizar-docente.component";
import {
  CadastrarDocenteComponent
} from "app-core/lib/components/cruds/docente/cadastrar-docente/cadastrar-docente.component";
import {
  SubareaConhecimentoComponent
} from "app-core/lib/components/cruds/subarea-conhecimento/subarea-conhecimento.component";
import {
  VisualizarSubareaConhecimentoComponent
} from "app-core/lib/components/cruds/subarea-conhecimento/visualizar-subarea-conhecimento/visualizar-subarea-conhecimento.component";
import {
  CadastrarSubareaConhecimentoComponent
} from "app-core/lib/components/cruds/subarea-conhecimento/cadastrar-subarea-conhecimento/cadastrar-subarea-conhecimento.component";
import {AreaConhecimentoComponent} from "app-core/lib/components/cruds/area-conhecimento/area-conhecimento.component";
import {
  VisualizarAreaConhecimentoComponent
} from "app-core/lib/components/cruds/area-conhecimento/visualizar-area-conhecimento/visualizar-area-conhecimento.component";
import {
  CadastrarAreaConhecimentoComponent
} from "app-core/lib/components/cruds/area-conhecimento/cadastrar-area-conhecimento/cadastrar-area-conhecimento.component";
import {
  EstruturaCurricularComponent
} from "app-core/lib/components/cruds/estrutura-curricular/estrutura-curricular.component";
import {
  VisualizarEstruturaCurricularComponent
} from "app-core/lib/components/cruds/estrutura-curricular/visualizar-estrutura-curricular/visualizar-estrutura-curricular.component";
import {
  CadastrarEstruturaCurricularComponent
} from "app-core/lib/components/cruds/estrutura-curricular/cadastrar-estrutura-curricular/cadastrar-estrutura-curricular.component";
import {DocenteEncargosComponent} from "app-core/lib/components/cruds/docente-encargos/docente-encargos.component";
import {
  VisualizarDocenteEncargosComponent
} from "app-core/lib/components/cruds/docente-encargos/visualizar-docente-encargos/visualizar-docente-encargos.component";
import {
  CadastrarDocentesEncargosComponent
} from "app-core/lib/components/cruds/docente-encargos/cadastrar-docentes-encargos/cadastrar-docentes-encargos.component";
import {DisciplinaComponent} from "app-core/lib/components/cruds/disciplina/disciplina.component";
import {
  VisualizarDisciplinaComponent
} from "app-core/lib/components/cruds/disciplina/visualizar-disciplina/visualizar-disciplina.component";
import {
  CadastrarDisciplinaComponent
} from "app-core/lib/components/cruds/disciplina/cadastrar-disciplina/cadastrar-disciplina.component";
import {AnaliseDasMediasComponent} from "./principal/analise-das-medias/analise-das-medias.component";
import {
  VisualizarAnaliseDasMediasComponent
} from "./principal/analise-das-medias/visualizar-analise-das-medias/visualizar-analise-das-medias.component";
import {LandingPageComponent} from "./principal/landing-page/landing-page.component";

const routes: Routes = [
  {
    path: 'atualizar-cadastro',
    loadChildren: () => import('app-core').then(m => m.AtualizarCadastroModule),
    canActivate: [authGuard]
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard, cadastroCompletoGuard],
    children: [
      {
        path: '',
        component: LandingPageComponent
      },
      {
        path: 'gerenciamento-ensino',
        component: PrincipalComponent,
        children: [
          { path: 'media', component: AnaliseDasMediasComponent },
          { path: 'media/:uuid', component: AnaliseDasMediasComponent }
        ]
      },
      {
        path: 'analise',
        children: [
          {
            path: 'media',
            component: AnaliseDasMediasComponent,
            children: [
              { path: '', component: VisualizarAnaliseDasMediasComponent },
              { path: ':uuid', component: VisualizarAnaliseDasMediasComponent }
            ]
          }
        ]
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
      }
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
