import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProjetoService } from 'app-core/lib/services/projetos/projeto.service';

@Component({
  selector: 'lib-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent {

  nome: string = '';
  email: string = '';
  senha: string = '';
  confirmarSenha: string = '';
  carregando: boolean = false;
  erro: string = '';
  sucesso: boolean = false;

  constructor(
    private projetoService: ProjetoService,
    private router: Router
  ) {}

  registrar(): void {
    this.erro = '';

    if (!this.nome || !this.email || !this.senha || !this.confirmarSenha) {
      this.erro = 'Preencha todos os campos.';
      return;
    }

    if (this.senha !== this.confirmarSenha) {
      this.erro = 'As senhas não coincidem.';
      return;
    }

    if (this.senha.length < 6) {
      this.erro = 'A senha deve ter no mínimo 6 caracteres.';
      return;
    }

    this.carregando = true;

    this.projetoService.registro({ nome: this.nome, email: this.email, senha: this.senha }).subscribe({
      next: () => {
        this.sucesso = true;
        this.carregando = false;
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.erro = err?.error?.message || 'Erro ao criar conta. Tente novamente.';
        this.carregando = false;
      }
    });
  }

  irParaLogin(): void {
    this.router.navigate(['/login']);
  }
}
