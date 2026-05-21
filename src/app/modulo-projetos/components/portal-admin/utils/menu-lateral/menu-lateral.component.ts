import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UsuarioService } from "app-core/lib/services/usuario.service";

@Component({
  selector: 'menu-lateral-admin',
  templateUrl: './menu-lateral.component.html',
  styleUrls: ['./menu-lateral.component.css']
})
export class MenuLateralComponent implements OnInit {
  @Output() onSidebarToggle = new EventEmitter<boolean>();

  public nome: string = '';
  public cargo: string = '';
  public menuAberto: string = '';
  public isSidebarMinimized: boolean = false;

  constructor(private readonly usuarioService: UsuarioService) {}

  public ngOnInit(): void {
    this.nome = this.usuarioService.getNomeLogado() || 'Admin';
    this.cargo = this.usuarioService.getCargoLogado() || 'Admin';
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
