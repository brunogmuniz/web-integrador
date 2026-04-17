import { Component, OnInit } from '@angular/core';
import { LoginService, PortalKey } from 'app-core';

@Component({
  selector: 'app-selecionar-modulo',
  templateUrl: './selecionar-modulo.component.html',
  styleUrls: ['./selecionar-modulo.component.scss']
})
export class SelecionarModuloComponent implements OnInit {
  public modulos: PortalKey[] = [];
  public moduloSelecionado: PortalKey | null = null;
  public carregando = true;

  constructor(private readonly loginService: LoginService) {}

  public ngOnInit(): void {
    this.modulos = this.loginService.obterPortaisAcessiveis();

    if (!this.modulos.length) {
      this.loginService.irParaSemPermissao();
      return;
    }

    if (this.modulos.length === 1) {
      this.loginService.irParaPortal(this.modulos[0]);
      return;
    }

    this.moduloSelecionado = this.modulos[0];
    this.carregando = false;
  }

  public continuar(): void {
    if (!this.moduloSelecionado) {
      return;
    }

    this.loginService.irParaPortal(this.moduloSelecionado);
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
