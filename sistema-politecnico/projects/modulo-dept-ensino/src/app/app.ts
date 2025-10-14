import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {FormsModule} from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';
import {LayoutDeptEnsino} from './layout/layout';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [RouterOutlet, FormsModule, ReactiveFormsModule, LayoutDeptEnsino],
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('modulo-dept-ensino');
}
