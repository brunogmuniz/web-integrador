import { Routes } from '@angular/router';
import { LayoutDeptEnsino } from './layout';

export const LAYOUT_DEPT_ENSINO_ROUTES: Routes = [
  {
    path: '',

    component: LayoutDeptEnsino,
    children: [

      {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
      }
    ]
  }
];
