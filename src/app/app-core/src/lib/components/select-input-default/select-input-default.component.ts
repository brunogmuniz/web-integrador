import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

export interface SelectOption {
  id: string | number;
  label: string;
  originalData?: any;
}

@Component({
  selector: 'lib-select-input-default',
  templateUrl: './select-input-default.component.html',
  styleUrls: ['./select-input-default.component.scss']
})
export class SelectInputDefaultComponent {
  @Input() public label: string = '';
  @Input() public control!: FormControl;
  @Input() public placeholder: string = 'Selecione...';
  @Input() public required: boolean = false;
  @Input() public opcoes: SelectOption[] = [];
  @Input() public searchable: boolean = true;
  @Input() public clearable: boolean = true;
  @Input() public notFoundText: string = 'Nenhum registo encontrado';
}
