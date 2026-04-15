import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { LoginService } from '../services/login.service';

export const authGuard: CanActivateFn = (): boolean => {
  const loginService = inject(LoginService);

  if (loginService.estaAutenticado()) {
    return true;
  }

  loginService.iniciarLogin();
  return false;
};
