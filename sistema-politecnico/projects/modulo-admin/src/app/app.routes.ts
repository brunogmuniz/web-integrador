import { Routes } from '@angular/router';
import { CursoCRUD } from './components/curso-crud/curso-crud';
import {Layout} from './layout/layout';
import {AreaConhecimentoCrud} from './components/area-conhecimento-crud/area-conhecimento-crud';
import {DepartamentoCrud} from './components/departamento-crud/departamento-crud';
import {SubareaConhecimento} from './components/subarea-conhecimento-crud/subarea-conhecimento';
import {DisciplinaCrud} from './components/disciplina-crud/disciplina-crud';
import {DocenteCrud} from './components/docente-crud/docente-crud';
import {EstruturaCurricularCrud} from './components/estrutura-curricular-crud/estrutura-curricular-crud';

export const routes: Routes = [
  {path: '', component: Layout},
  {path: 'area', component: AreaConhecimentoCrud},
  { path: 'curso', component: CursoCRUD },
  { path: 'departamento', component: DepartamentoCrud },
  { path: 'subarea', component: SubareaConhecimento },
  { path: 'disciplina', component: DisciplinaCrud },
  { path: 'docente', component: DocenteCrud },
  { path: 'estrutura', component: EstruturaCurricularCrud },

  { path: '**', component: Layout },
];
