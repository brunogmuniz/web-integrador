import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {FormsModule} from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';


@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [RouterOutlet, FormsModule, ReactiveFormsModule],
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('modulo-dept-ensino');
}
