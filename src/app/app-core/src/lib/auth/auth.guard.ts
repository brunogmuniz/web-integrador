import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { map, filter, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = () => {
  const loginService = inject(LoginService);
  const router = inject(Router);

  if (!loginService.estaAutenticado()) {
    loginService.iniciarLogin();
    return false;
  }

  return loginService.user$.pipe(
    filter(usuario => usuario !== null),
    take(1),
    map(usuario => {
      return true; 
    })
  );
};