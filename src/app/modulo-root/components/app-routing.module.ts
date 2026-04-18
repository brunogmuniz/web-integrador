import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SelecionarModuloComponent } from './selecionar-modulo/selecionar-modulo.component';
import { SemPermissaoComponent } from './sem-permissao/sem-permissao.component';
import { authGuard, cadastroCompletoGuard } from "app-core";

const routes: Routes = [
  {
    path: 'atualizar-cadastro',
    loadChildren: () => import('app-core').then(m => m.AtualizarCadastroModule),
    canActivate: [authGuard]
  },
  {
    path: 'sem-permissao',
    component: SemPermissaoComponent,
    canActivate: [authGuard]
  },
  {
    path: 'selecionar-modulo',
    component: SelecionarModuloComponent,
    canActivate: [authGuard, cadastroCompletoGuard]
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'selecionar-modulo'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
