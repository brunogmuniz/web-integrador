import { Component } from '@angular/core';
import {FormInput} from 'shared-core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-layout',
  imports: [FormInput, ReactiveFormsModule],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
  standalone: true
})
export class Layout {
  public campoTeste = new FormControl("Campo Teste");
  protected readonly ReactiveFormsModule = ReactiveFormsModule;
}
