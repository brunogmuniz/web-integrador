import { Routes } from '@angular/router';
import { Layout } from './layout/layout';

import { CursoCRUD } from './components/curso-crud/curso-crud';
import { AreaConhecimentoCrud } from './components/area-conhecimento-crud/area-conhecimento-crud';
import { DepartamentoCrud } from './components/departamento-crud/departamento-crud';
import { SubareaConhecimento } from './components/subarea-conhecimento-crud/subarea-conhecimento';
import { DisciplinaCrud } from './components/disciplina-crud/disciplina-crud';
import { DocenteCrud } from './components/docente-crud/docente-crud';
import { EstruturaCurricularComponent } from './components/estrutura-curricular/estrutura-curricular';

export const routes: Routes = [
  {

    path: '',
    component: Layout,

    children: [

      { path: '', redirectTo: 'curso', pathMatch: 'full' },


      { path: 'area', component: AreaConhecimentoCrud },
      { path: 'curso', component: CursoCRUD },
      { path: 'departamento', component: DepartamentoCrud },
      { path: 'subarea', component: SubareaConhecimento },
      { path: 'disciplina', component: DisciplinaCrud },
      { path: 'docente', component: DocenteCrud },

      { path: 'estrutura-curricular', component: EstruturaCurricularComponent }
    ]
  },

  { path: '**', redirectTo: '' }
];
