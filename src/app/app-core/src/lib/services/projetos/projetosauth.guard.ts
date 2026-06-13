import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ProjetoService } from 'app-core/lib/services/projetos/projeto.service';

@Injectable({
  providedIn: 'root'
})
export class ProjetosAuthGuard implements CanActivate {

  constructor(
    private projetoService: ProjetoService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.projetoService.isLogado()) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
