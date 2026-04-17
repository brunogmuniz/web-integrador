import { Component, AfterViewInit, NgZone } from '@angular/core';

declare global {
  interface Window {
    KTLayout?: { init: () => void };
    KTMenu?: { init: () => void };
  }
}

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements AfterViewInit {
  public isSidebarMinimized: boolean = false;

  constructor(private readonly ngZone: NgZone) {}

  public ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        if (window.KTLayout) {
          window.KTLayout.init();
        }
        if (window.KTMenu) {
          window.KTMenu.init();
        }
      });
    });
  }

  public handleSidebarToggle(isMinimized: boolean): void {
    this.isSidebarMinimized = isMinimized;
  }
}
