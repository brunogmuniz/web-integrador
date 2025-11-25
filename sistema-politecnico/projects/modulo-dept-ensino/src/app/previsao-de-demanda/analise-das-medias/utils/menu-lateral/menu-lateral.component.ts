import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';



@Component({
  selector: 'menu-lateral',
  templateUrl: './menu-lateral.component.html',
  imports: [
    RouterLink,
  ],
  styleUrls: ['./menu-lateral.component.css']
})
export class MenuLateralComponent {

  ngAfterViewInit() {
    setTimeout(() => {
      (window as any).KTLayout?.init();
      (window as any).KTMenu?.init();
    }, 50);
  }

}
