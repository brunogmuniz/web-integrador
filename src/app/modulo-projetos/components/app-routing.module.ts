import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { VisualizarProjetosComponent } from 'app-core';
import { DetalhesProjetoComponent } from 'app-core/lib/components/projetos/detalhes-projeto/detalhes-projeto.component';
import { CadastrarProjetosComponent } from './portal-admin/cadastrar-projetos/cadastrar-projetos.component';
import { PortalAdminComponent } from './portal-admin/portal-admin.component';
import { GerenciarProjetosComponent } from './portal-admin/gerenciar-projetos/gerenciar-projetos.component';
import { LoginComponent } from './login/login.component';
import { RegistroComponent } from './registro/registro.component';
import { ProjetosAuthGuard } from 'app-core/lib/services/projetos/projetosauth.guard';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'registro',
    component: RegistroComponent
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [ProjetosAuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'visualizar-projetos',
        pathMatch: 'full'
      },
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
        component: GerenciarProjetosComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
