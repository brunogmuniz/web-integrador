import {Component, Input} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
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
 @Input({required: true}) control!: FormControl;
 @Input() type: String = 'text';
 @Input() supportText: string = 'Support Text';
}
