import { Routes } from '@angular/router';
import {Layout} from './layout/layout';
import {CursoCRUD} from './components/curso-crud/curso-crud';

export const routes: Routes = [

  {path: '',  component: Layout},
  {path: 'curso', component: CursoCRUD},
];
