import { Component } from '@angular/core';

@Component({
  selector: 'lib-portal-admin',
  templateUrl: './portal-admin.component.html',
  styleUrls: ['./portal-admin.component.css']
})
export class PortalAdminComponent {
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
