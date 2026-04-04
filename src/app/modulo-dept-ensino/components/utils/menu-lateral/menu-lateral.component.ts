import {UsuarioService} from "app-core/lib/services/usuario.service";
import {NavigationEnd, Router} from "@angular/router";
import {AfterViewInit, Component, OnInit} from '@angular/core';
import {LoginService} from "app-core";
import {filter} from "rxjs/operators";

@Component({
  selector: 'menu-lateral',
  templateUrl: './menu-lateral.component.html',
  styleUrls: ['./menu-lateral.component.css']
})
export class MenuLateralComponent implements OnInit, AfterViewInit {
  menuAberto: string = '';

  isDocente: boolean = false;
  mostrarMenuCompleto: boolean = false;
  menuRecolhido: boolean = false;

  constructor(
    private usuarioService: UsuarioService,
    private loginService: LoginService,
    private router: Router
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const urlSemQuery = event.urlAfterRedirects.split('?')[0];
      this.mostrarMenuCompleto = urlSemQuery !== '/';
    });
  }

  ngOnInit(): void {
    this.verificarPerfil();

    // Faz a mesma verificação na inicialização do componente
    const urlSemQuery = this.router.url.split('?')[0];
    this.mostrarMenuCompleto = urlSemQuery !== '/';
  }

  verificarPerfil(): void {
    const usuario = this.loginService.getUsuarioLogado();
    if (usuario && usuario.tipoPerfil) {
      const perfil = String(usuario.tipoPerfil).trim().toUpperCase();
      this.isDocente = perfil === 'DOCENTE';
    }

  }

  ngAfterViewInit() {
    setTimeout(() => {
      (window as any).KTMenu?.init();
    }, 50);
  }

  alternarMenu(): void {
    this.menuRecolhido = !this.menuRecolhido;
    if (this.menuRecolhido) {
      document.body.classList.add('kt-aside--minimize');
    } else {
      document.body.classList.remove('kt-aside--minimize');
    }
  }

  toggleMenu(nomeMenu: string): void {
    this.menuAberto = this.menuAberto === nomeMenu ? '' : nomeMenu;
  }

  isOpen(nomeMenu: string): boolean {
    return this.menuAberto === nomeMenu;
  }
}
