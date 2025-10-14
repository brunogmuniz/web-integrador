import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {AuthService} from '../app-core/service/auth';
import {Title} from '@angular/platform-browser';
import {FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-layout',
  standalone: true,
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
  imports:[]
})
export class LayoutDeptEnsino {

  constructor(private authService: AuthService, private router: Router, private titleService: Title, private fb: FormBuilder) { }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
