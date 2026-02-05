import {Component, OnInit} from '@angular/core';
import {UsuarioService} from "app-core/lib/services/usuario.service";
import {Router} from "@angular/router";



@Component({
  selector: 'menu-lateral',
  templateUrl: './menu-lateral.component.html',
  styleUrls: ['./menu-lateral.component.css']
})
export class MenuLateralComponent implements OnInit {


  nome: string = '';


  ngAfterViewInit() {
    setTimeout(() => {
      (window as any).KTLayout?.init();
      (window as any).KTMenu?.init();
    }, 50);
  }
  menuAberto: string = '';

  constructor(private usuarioService: UsuarioService, private router: Router) { }

  ngOnInit(): void {
    this.nome = this.usuarioService.getNomeLogado();
  }

  toggleMenu(nomeMenu: string): void {
    if (this.menuAberto === nomeMenu) {
      this.menuAberto = '';
    } else {
      this.menuAberto = nomeMenu;
    }
  }

  isOpen(nomeMenu: string): boolean {
    return this.menuAberto === nomeMenu;
  }

}
