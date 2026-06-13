import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProjetoService } from 'app-core/lib/services/projetos/projeto.service';

@Component({
  selector: 'lib-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  email: string = '';
  senha: string = '';
  carregando: boolean = false;
  erro: string = '';

  constructor(
    private projetoService: ProjetoService,
    private router: Router
  ) {}

  entrar(): void {
    this.erro = '';

    if (!this.email || !this.senha) {
      this.erro = 'Preencha todos os campos.';
      return;
    }

    this.carregando = true;

    this.projetoService.login({ email: this.email, senha: this.senha }).subscribe({
      next: () => {
        this.router.navigate(['/visualizar-projetos']);
      },
      error: () => {
        this.erro = 'Email ou senha inválidos.';
        this.carregando = false;
      }
    });
  }

  irParaRegistro(): void {
    this.router.navigate(['/registro']);
  }
}
