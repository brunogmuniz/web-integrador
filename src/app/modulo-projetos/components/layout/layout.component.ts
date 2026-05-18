import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements AfterViewInit {
  public isSidebarMinimized: boolean = false;

  public handleSidebarToggle(isMinimized: boolean): void {
    this.isSidebarMinimized = isMinimized;
  }

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
