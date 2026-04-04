import { Component, OnInit, HostListener } from '@angular/core';
import { LoginService } from 'app-core';
import { UsuarioService } from 'app-core/lib/services/usuario.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  nomeUsuario: string = '';
  iniciais: string = '';
  menuAberto: boolean = false;

  constructor(
    private loginService: LoginService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit() {
    this.nomeUsuario = this.usuarioService.getNomeLogado() || 'Usuário';
    this.iniciais = this.nomeUsuario.substring(0, 1).toUpperCase();
  }

  toggleMenu(event: Event) {
    event.stopPropagation();
    this.menuAberto = !this.menuAberto;
  }

  sair() {
    this.loginService.logout();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    this.menuAberto = false;
  }
}
