import {Component, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {EventEmitter} from '@angular/core';
import {Validators} from '@angular/forms';


export interface CrudFormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'select' | 'date' | 'textarea' ;
  required: boolean;
}

@Component({
  selector: 'lib-crud-create-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './crud-create-form.html',
  styleUrl: './crud-create-form.scss'
})
export class CrudCreateForm implements OnInit, OnChanges {
  @Input() fields: CrudFormField[] = [];
  @Input() data: any = null;
  @Output() submitForm = new EventEmitter<any>();

  form!: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.form = this.formBuilder.group({})
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && this.form) {
      this.form.patchValue(this.data || {});
    }
  }
  private buildForm() {
    const group: any = {};
    this.fields.forEach(field => {
      group[field.name] = [
        this.data ? this.data[field.name] : '',
        field.required ? Validators.required : [],
      ];
    });
    this.form = this.formBuilder.group(group);
  }

  onSubmit() {
    if (this.form.valid) {
      this.submitForm.emit(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }

  getControl(name: string) {
    return this.form.get(name);
  }


}
