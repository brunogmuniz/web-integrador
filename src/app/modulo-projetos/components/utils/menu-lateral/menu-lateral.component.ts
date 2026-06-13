import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ProjetoService } from 'app-core/lib/services/projetos/projeto.service';

@Component({
  selector: 'menu-lateral',
  templateUrl: './menu-lateral.component.html',
  styleUrls: ['./menu-lateral.component.css']
})
export class MenuLateralComponent implements OnInit {
  @Output() onSidebarToggle = new EventEmitter<boolean>();

  public nome: string = '';
  public menuAberto: string = '';
  public isSidebarMinimized: boolean = false;

  constructor(
    private readonly projetoService: ProjetoService,
    private readonly router: Router
  ) {}

  public ngOnInit(): void {
    this.nome = this.projetoService.getNomeLogado();
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

  public sair(): void {
    this.projetoService.logout();
    this.router.navigate(['/login']);
  }
}
