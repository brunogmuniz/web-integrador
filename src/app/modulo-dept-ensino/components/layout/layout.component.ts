import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
})
export class LayoutComponent implements AfterViewInit {
  ngAfterViewInit() {
    setTimeout(() => {
      if ((window as any).KTLayout) {
        (window as any).KTLayout.init();
      }
      if ((window as any).KTMenu) {
        (window as any).KTMenu.init();
      }
    }, 100);
  }
}
