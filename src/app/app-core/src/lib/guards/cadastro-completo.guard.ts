import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { LoginService } from '../services/login.service';
import { PortalNavigationService } from '../services/portal-navigation.service';
import { UsuarioUtil } from '../utils/usuario-util';

export const cadastroCompletoGuard: CanActivateFn = (): boolean => {
  const loginService = inject(LoginService);
  const portalNavService = inject(PortalNavigationService);

  if (!loginService.estaAutenticado()) {
    loginService.iniciarLogin();
    return false;
  }

  const usuario = loginService.getUsuarioLogado();
  const precisaAtualizar = !usuario
    || usuario.pendenciaAtualizacao === true
    || UsuarioUtil.isCadastroExpirado(usuario.ultimaAtualizacaoCadastro);

  if (precisaAtualizar) {
    portalNavService.redirecionarParaAtualizacaoDeCadastro(document.location.origin);
    return false;
  }

  return true;
};
