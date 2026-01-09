import { Component, OnInit } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'modulo-admin';
  isAuthenticated = false;
  constructor(private oauthService: OAuthService) {
  }

  ngOnInit() {
    this.isAuthenticated = this.oauthService.hasValidAccessToken();
    this.oauthService.events
      .pipe(filter(e => e.type === 'token_received' || e.type === 'logout'))
      .subscribe(() => {
        this.isAuthenticated = this.oauthService.hasValidAccessToken();
      });
  }
}
