import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { LoginService } from '../services/login.service';
import { UsuarioUtil } from '../utils/usuario-util';

export const cadastroCompletoGuard: CanActivateFn = (): boolean | UrlTree => {
  const loginService = inject(LoginService);
  const router = inject(Router);

  if (!loginService.estaAutenticado()) {
    return router.createUrlTree(['/login']);
  }

  const usuario = loginService.getUsuarioLogado();
  const precisaAtualizar = !usuario ||
    UsuarioUtil.isCadastroIncompleto(usuario) ||
    UsuarioUtil.isCadastroExpirado(usuario.ultimaAtualizacaoCadastro);

  return precisaAtualizar
    ? router.createUrlTree(['/atualizar-cadastro'])
    : true;
};
