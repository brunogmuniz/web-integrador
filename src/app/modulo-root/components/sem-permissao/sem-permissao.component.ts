import { Component } from '@angular/core';
import { LoginService } from 'app-core';

@Component({
  selector: 'app-sem-permissao',
  templateUrl: './sem-permissao.component.html',
  styleUrls: ['./sem-permissao.component.scss']
})
export class SemPermissaoComponent {
  constructor(private readonly loginService: LoginService) {}

  logout(): void {
    this.loginService.logout();
  }
}
