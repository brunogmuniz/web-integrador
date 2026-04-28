import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { LoginService } from '../services/login.service';

export const authGuard: CanActivateFn = (): boolean => {
  const loginService = inject(LoginService);

  if (!loginService.estaAutenticado()) {
    loginService.iniciarLogin();
    return false;
  }
  
  const usuario = loginService.getUsuarioLogado();

  if (!usuario) {
    loginService.iniciarLogin();
    return false;
  }

  return true;
};
