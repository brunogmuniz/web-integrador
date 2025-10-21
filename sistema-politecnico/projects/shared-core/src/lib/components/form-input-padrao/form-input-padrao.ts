import {Component, Input} from '@angular/core';
// 💥 Importamos AbstractControl (o tipo genérico)
import { AbstractControl, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'lib-form-input-padrao',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './form-input-padrao.html',
  standalone: true,
  styleUrl: './form-input-padrao.scss'
})
export class FormInput {
  @Input() label: string = 'Campo';

  @Input({required: true}) control: any;

  @Input() type: string = 'text';

  @Input() supportText: string = 'Support Text';
}
