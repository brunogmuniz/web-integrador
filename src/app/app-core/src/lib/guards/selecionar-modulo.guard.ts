import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { LoginService } from '../services/login.service';
import { PortalNavigationService } from '../services/portal-navigation.service';

export const selecionarModuloGuard: CanActivateFn = (): boolean => {
  const loginService = inject(LoginService);
  const portalNavService = inject(PortalNavigationService);
  const usuario = loginService.getUsuarioLogado();
  const portaisAcessiveis = portalNavService.obterPortaisAcessiveis(usuario);

  if (portaisAcessiveis.length === 0) {
    portalNavService.irParaSemPermissao();
    return false;
  }
  if (portaisAcessiveis.length === 1) {
    portalNavService.irParaPortal(portaisAcessiveis[0]);
    return false;
  }

  return true;
};
