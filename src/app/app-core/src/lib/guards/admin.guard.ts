import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { LoginService } from '../services/login.service';
import { AuthorizationService } from '../services/authorization.service';
import { PortalNavigationService } from '../services/portal-navigation.service';

export const adminGuard: CanActivateFn = (): boolean => {
  const loginService = inject(LoginService);
  const authzService = inject(AuthorizationService);
  const portalNavService = inject(PortalNavigationService);

  if (!loginService.estaAutenticado()) {
    loginService.iniciarLogin();
    return false;
  }

  const usuario = loginService.getUsuarioLogado();

  if (!authzService.possuiRoleAdmin(usuario)) {
    portalNavService.irParaSemPermissao();
    return false;
  }

  return true;
};
