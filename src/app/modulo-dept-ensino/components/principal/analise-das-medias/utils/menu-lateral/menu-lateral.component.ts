import {Component, OnInit} from '@angular/core';
import {UsuarioService} from "../../../../../../app-core/src/lib/services/usuario.service";
import {Router} from "@angular/router";



@Component({
  selector: 'menu-lateral',
  templateUrl: './menu-lateral.component.html',
  styleUrls: ['./menu-lateral.component.css']
})
export class MenuLateralComponent implements OnInit {

  nome: string = '';

  constructor(private usuarioService: UsuarioService, private router: Router) { }

  ngOnInit(): void {
    this.nome = this.usuarioService.getNomeLogado();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      (window as any).KTLayout?.init();
      (window as any).KTMenu?.init();
    }, 50);
  }

}
