import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AcessoUnidadeService } from 'app-core';
import { UsuarioService } from "app-core/lib/services/usuario.service";

@Component({
  selector: 'menu-lateral',
  templateUrl: './menu-lateral.component.html',
  styleUrls: ['./menu-lateral.component.scss']
})
export class MenuLateralComponent implements OnInit {
  @Output() onSidebarToggle = new EventEmitter<boolean>();

  public nome: string = '';
  public cargo: string = '';
  public menuAberto: string = '';
  public isSidebarMinimized: boolean = false;
  public podeImportarDados: boolean = false;

  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly acessoUnidadeService: AcessoUnidadeService
  ) {}

  public ngOnInit(): void {
    this.nome = this.usuarioService.getNomeLogado() || 'Admin';
    this.cargo = this.usuarioService.getCargoLogado() || 'Admin';
    this.atualizarPermissoesMenu();
  }

  public toggleSidebarSize(): void {
    this.isSidebarMinimized = !this.isSidebarMinimized;

    if (this.isSidebarMinimized) {
      this.menuAberto = '';
    }

    this.onSidebarToggle.emit(this.isSidebarMinimized);
  }

  public toggleMenu(nomeMenu: string): void {
    if (this.isSidebarMinimized) {
      this.toggleSidebarSize();
    }
    this.menuAberto = this.menuAberto === nomeMenu ? '' : nomeMenu;
  }

  public isOpen(nomeMenu: string): boolean {
    return this.menuAberto === nomeMenu;
  }

  private atualizarPermissoesMenu(): void {
    this.acessoUnidadeService.carregarMeusAcessos().subscribe(() => {
      const possuiPermissaoDirecao = this.acessoUnidadeService.possuiPermissaoNaUnidadeAtiva(['DIRECAO']);
      const possuiContextoDirecao = this.acessoUnidadeService.possuiContextoNaUnidadeAtiva(
        ['DIRECAO'],
        ['RESPONSAVEL', 'RESPONSAVEL_ADJUNTO']
      );

      this.podeImportarDados = possuiPermissaoDirecao || possuiContextoDirecao;
    });
  }
}
