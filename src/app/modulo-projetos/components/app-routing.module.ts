import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AppComponent} from "./app.component";
import {LayoutComponent} from "./layout/layout.component";
import {VisualizarProjetosComponent} from "app-core";
import {DetalhesProjetoComponent} from "app-core/lib/components/projetos/detalhes-projeto/detalhes-projeto.component";

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'visualizar-projetos',
        component: VisualizarProjetosComponent
      },
      {
        path: 'visualizar-detalhes/:id',
        component: DetalhesProjetoComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
