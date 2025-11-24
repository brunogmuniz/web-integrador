import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import { NavbarComponent } from './navbar/navbar';

@Component({
  selector: 'app-layout',
  imports: [ReactiveFormsModule, RouterOutlet, NavbarComponent],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
  standalone: true
})
export class Layout {
  protected readonly ReactiveFormsModule = ReactiveFormsModule;
}
