import { Component, OnInit } from '@angular/core';
import { LoginService, PortalKey } from 'app-core';

@Component({
  selector: 'app-selecionar-modulo',
  templateUrl: './selecionar-modulo.component.html',
  styleUrls: ['./selecionar-modulo.component.scss']
})
export class SelecionarModuloComponent implements OnInit {
  public modulos: PortalKey[] = ['admin', 'ensino'];
  public moduloSelecionado: PortalKey | null = null;
  public carregando = true;
  public erroPermissao = false;

  constructor(private readonly loginService: LoginService) {}

  public ngOnInit(): void {
    const acessosReais = this.loginService.obterPortaisAcessiveis();

    if (acessosReais.length > 0) {
      this.moduloSelecionado = acessosReais.includes('admin') ? 'admin' : acessosReais[0];
    } else {
      this.moduloSelecionado = null;
    }

    this.carregando = false;
  }

  public continuar(): void {
    this.erroPermissao = false;

    if (!this.moduloSelecionado) {
      return;
    }

    const acessosReais = this.loginService.obterPortaisAcessiveis();
    const possuiAcesso = acessosReais.includes(this.moduloSelecionado);

    if (possuiAcesso) {
      this.loginService.irParaPortal(this.moduloSelecionado);
    } else {
      this.erroPermissao = true;
      console.warn(`[Segurança] Tentativa de acesso bloqueada para o módulo: ${this.moduloSelecionado}`);
    }
  }

  public formatarModulo(portal: PortalKey): string {
    switch (portal) {
      case 'admin':
        return 'Módulo Admin';
      case 'ensino':
        return 'Módulo Ensino';
      case 'root':
      default:
        return 'Portal';
    }
  }
}
