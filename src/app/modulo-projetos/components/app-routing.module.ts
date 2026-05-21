import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AppComponent} from "./app.component";
import {LayoutComponent} from "./layout/layout.component";
import {VisualizarProjetosComponent} from "app-core";
import {DetalhesProjetoComponent} from "app-core/lib/components/projetos/detalhes-projeto/detalhes-projeto.component";
import {
  CadastrarProjetosComponent
} from "app-core/lib/components/projetos/portal-admin/cadastrar-projetos/cadastrar-projetos.component";
import {PortalAdminComponent} from "app-core/lib/components/projetos/portal-admin/portal-admin.component";

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
      },
    ],
  },
  {
    path: 'admin',
    component: PortalAdminComponent,
    children: [
      {
        path: 'cadastrar-projeto',
        component: CadastrarProjetosComponent
      },
      {
        path: 'editar-projeto/:id',
        component: CadastrarProjetosComponent
      },
      {
        path: 'ver-projetos',
        component: VisualizarProjetosComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
