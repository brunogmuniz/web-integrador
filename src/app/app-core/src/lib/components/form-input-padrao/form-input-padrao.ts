import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-form-input-padrao',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './form-input-padrao.html',
  styleUrls: ['./form-input-padrao.scss']
})
export class FormInput {
  @Input() label: string = 'Campo';

  @Input() control!: FormControl;

  @Input() type: string = 'text';

  @Input() supportText: string = 'Support Text';
}
