import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { UsuarioService } from 'app-core';

@Component({
  selector: 'menu-lateral',
  templateUrl: './menu-lateral.component.html',
  styleUrls: ['./menu-lateral.component.css']
})
export class MenuLateralComponent implements OnInit, OnDestroy {
  @Output() onSidebarToggle = new EventEmitter<boolean>();

  public nome: string = '';
  public cargo: string = '';
  public uuidUsuario: string = '';
  public menuAberto: string = '';
  public isSidebarMinimized: boolean = false;

  private inscricaoUsuario!: Subscription;

  constructor(private readonly usuarioService: UsuarioService) {}

  public ngOnInit(): void {
    this.nome = this.usuarioService.getNomeLogado() || 'Admin';
    this.cargo = this.usuarioService.getCargoLogado() || 'Admin';

    const usuarioLogado = this.usuarioService.getUsuarioLogado();
    if (usuarioLogado) {
      this.uuidUsuario = usuarioLogado.uuid || String(usuarioLogado.id) || '';
    }

    this.inscricaoUsuario = this.usuarioService.eventoUsuarioAtualizado.subscribe({
      next: (usuarioAtualizado) => {
        this.nome = usuarioAtualizado.nome;
      }
    });
  }

  public ngOnDestroy(): void {
    if (this.inscricaoUsuario) {
      this.inscricaoUsuario.unsubscribe();
    }
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
}
