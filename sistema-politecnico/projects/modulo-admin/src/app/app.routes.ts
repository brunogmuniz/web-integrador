import { Routes } from '@angular/router';
import { Layout } from './layout/layout';

import { PaginaInicialComponent } from './components/pagina-inicial/pagina-inicial';


import { AreaConhecimentoCrud } from './components/area-conhecimento-crud/area-conhecimento-crud';
import { CursoCRUD } from './components/curso-crud/curso-crud';
import { DepartamentoCrud } from './components/departamento-crud/departamento-crud';
import { SubareaConhecimento } from './components/subarea-conhecimento-crud/subarea-conhecimento';
import { DisciplinaCrud } from './components/disciplina-crud/disciplina-crud';
import { EstruturaCurricularCrud } from './components/estrutura-curricular-crud/estrutura-curricular-crud';

// --- DOCENTE ---
import { DocenteComponent } from './components/docente/docente.component';
import { CadastrarDocente } from './components/docente/cadastrar-docente/cadastrar-docente';
import { EditarDocente } from './components/docente/editar-docente/editar-docente';
import { VisualizarDocente } from './components/docente/visualizar-docente/visualizar-docente.component';

// --- ENCARGOS ---
import { DocenteEncargos } from './components/docente-encargos/docente-encargos.component';
import { CadastrarDocenteEncargos } from './components/docente-encargos/cadastrar-docente-encargos/cadastrar-docente-encargos';
import { EditarDocenteEncargos } from './components/docente-encargos/editar-docente-encargos/editar-docente-encargos';
import { VisualizarDocenteEncargos } from './components/docente-encargos/visualizar-docente-encargos/visualizar-docente-encargos.component';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: '', component: PaginaInicialComponent },

      { path: 'area', component: AreaConhecimentoCrud },
      { path: 'curso', component: CursoCRUD },
      { path: 'departamento', component: DepartamentoCrud },
      { path: 'subarea', component: SubareaConhecimento },
      { path: 'disciplina', component: DisciplinaCrud },
      { path: 'estrutura', component: EstruturaCurricularCrud },

      {
        path: 'docente',
        component: DocenteComponent,
        children: [
          { path: '', redirectTo: 'visualizar', pathMatch: 'full' },
          { path: 'visualizar', component: VisualizarDocente },
          { path: 'novo', component: CadastrarDocente },
          { path: 'editar/:id', component: EditarDocente }
        ]
      },

      {
        path: 'docente-encargos',
        component: DocenteEncargos,
        children: [
          { path: '', redirectTo: 'visualizar', pathMatch: 'full' },
          { path: 'visualizar', component: VisualizarDocenteEncargos },
          { path: 'novo', component: CadastrarDocenteEncargos },
          { path: 'editar/:id', component: EditarDocenteEncargos }
        ]
      }
    ]
  },

  { path: '**', redirectTo: '' }
];
