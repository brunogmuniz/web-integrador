import {Component} from '@angular/core';



@Component({
  selector: 'menu-lateral',
  templateUrl: './menu-lateral.component.html',
  styleUrls: ['./menu-lateral.component.css']
})
export class MenuLateralComponent {

  ngAfterViewInit() {
    setTimeout(() => {
      (window as any).KTLayout?.init();
      (window as any).KTMenu?.init();
    }, 50);
  }
  menuAberto: string = '';

  constructor() { }

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
