import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService, Usuario } from 'app-core';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  usuarioLogado: Usuario | null = null;

  isDocente: boolean = false;
  isTae: boolean = false;
  isAluno: boolean = false;

  constructor(
    private loginService: LoginService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.usuarioLogado = this.loginService.getUsuarioLogado();
    this.verificarPerfis();
  }

  verificarPerfis() {
    if (!this.usuarioLogado || !this.usuarioLogado.tipoPerfil) {
      console.warn('Perfil não encontrado no usuário logado', this.usuarioLogado);
      return;
    }

    console.log('Valor real de tipoPerfil:', this.usuarioLogado.tipoPerfil);

    const perfil = String(this.usuarioLogado.tipoPerfil).trim().toUpperCase();

    this.isDocente = perfil === 'DOCENTE';
    this.isTae = perfil === 'TAE';
    this.isAluno = perfil === 'ALUNO';

  }

  navegarGerenciamentoEnsino() {
    this.router.navigate(['/gerenciamento-ensino']);
  }
}
