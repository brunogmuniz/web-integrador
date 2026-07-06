import { Component, EventEmitter, Input, OnChanges, Optional, Output, Self, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';

export type SelectOptionValue = string | number | boolean | object | null;

export interface SelectOption<TValue extends SelectOptionValue = SelectOptionValue> {
  id: TValue;
  label: string;
  originalData?: unknown;
}

export type SelectCompareWith = (optionValue: SelectOptionValue, selectedValue: SelectOptionValue) => boolean;

@Component({
  selector: 'lib-select-input-default',
  templateUrl: './select-input-default.component.html',
  styleUrls: ['./select-input-default.component.scss']
})
export class SelectInputDefaultComponent implements ControlValueAccessor, OnChanges {
  @Input() public label: string = '';
  @Input() public control?: FormControl;
  @Input() public placeholder: string = 'Selecione...';
  @Input() public required: boolean = false;
  @Input() public opcoes: SelectOption[] = [];
  @Input() public groupClass: string = 'form-group mb-4';
  @Input() public selectClass: string = '';
  @Input() public searchable: boolean = true;
  @Input() public clearable: boolean = true;
  @Input() public disabled: boolean = false;
  @Input() public appendTo: string = 'body';
  @Input() public notFoundText: string = 'Nenhum registro encontrado';
  @Input() public compareWith: SelectCompareWith = (optionValue, selectedValue) => this.compareByIdOrUuid(optionValue, selectedValue);

  @Output() public valueChange = new EventEmitter<SelectOptionValue>();
  @Output() public selectionChange = new EventEmitter<SelectOption | null>();

  public value: SelectOptionValue = null;
  public isDisabled = false;
  public internalControl = new FormControl<SelectOptionValue>(null);

  private onChange: (value: SelectOptionValue) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(@Optional() @Self() public ngControl: NgControl) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['disabled']) {
      this.setControlDisabledState();
    }

    if (changes['opcoes']) {
      this.internalControl.setValue(this.value, { emitEvent: false });
    }
  }

  public writeValue(value: SelectOptionValue): void {
    this.value = value;
    this.internalControl.setValue(value, { emitEvent: false });
  }

  public registerOnChange(fn: (value: SelectOptionValue) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    if (isDisabled) {
      this.internalControl.disable({ emitEvent: false });
      return;
    }

    this.internalControl.enable({ emitEvent: false });
  }

  public onValueChange(value: SelectOptionValue): void {
    this.value = value;
    this.internalControl.setValue(value, { emitEvent: false });
    this.onChange(value);
    this.valueChange.emit(value);
  }

  public onSelectChange(selection: SelectOption | SelectOptionValue | null): void {
    const option = this.resolveSelectedOption(selection);
    const value = this.resolveSelectedValue(selection, option);

    this.value = value;
    this.internalControl.setValue(value, { emitEvent: false });
    this.onChange(value);
    this.valueChange.emit(value);
    this.selectionChange.emit(option);
  }

  public markAsTouched(): void {
    this.onTouched();
  }

  public get activeControl(): FormControl | null {
    return (this.ngControl?.control as FormControl | null) || this.control || null;
  }

  public get showInvalidFeedback(): boolean {
    const control = this.activeControl;
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  public get isClearable(): boolean {
    return this.clearable && !this.required;
  }

  private setControlDisabledState(): void {
    this.setDisabledState(this.disabled);
  }

  private resolveSelectedOption(selection: SelectOption | SelectOptionValue | null): SelectOption | null {
    if (selection == null) {
      return null;
    }

    if (this.isSelectOption(selection)) {
      return selection;
    }

    return this.opcoes.find(opcao => this.compareWith(opcao.id, selection as SelectOptionValue)) || null;
  }

  private resolveSelectedValue(selection: SelectOption | SelectOptionValue | null, option: SelectOption | null): SelectOptionValue {
    if (selection == null) {
      return null;
    }

    if (option) {
      return option.id;
    }

    if (this.isSelectOption(selection)) {
      return selection.id;
    }

    return selection as SelectOptionValue;
  }

  private compareByIdOrUuid(optionValue: SelectOptionValue, selectedValue: SelectOptionValue): boolean {
    optionValue = this.unwrapSelectOptionValue(optionValue);
    selectedValue = this.unwrapSelectOptionValue(selectedValue);

    if (optionValue === selectedValue) {
      return true;
    }

    if (this.isComparablePrimitive(optionValue) && this.isComparablePrimitive(selectedValue)) {
      return String(optionValue) === String(selectedValue);
    }

    if (this.isRecord(optionValue) && this.isComparablePrimitive(selectedValue)) {
      return this.recordMatchesPrimitive(optionValue, selectedValue);
    }

    if (this.isComparablePrimitive(optionValue) && this.isRecord(selectedValue)) {
      return this.recordMatchesPrimitive(selectedValue, optionValue);
    }

    if (!this.isRecord(optionValue) || !this.isRecord(selectedValue)) {
      return false;
    }

    const optionId = optionValue['id'];
    const selectedId = selectedValue['id'];
    if (this.isComparablePrimitive(optionId) && this.isComparablePrimitive(selectedId)) {
      return String(optionId) === String(selectedId);
    }

    const optionUuid = optionValue['uuid'];
    const selectedUuid = selectedValue['uuid'];
    return this.isComparablePrimitive(optionUuid)
      && this.isComparablePrimitive(selectedUuid)
      && String(optionUuid) === String(selectedUuid);
  }

  private isRecord(value: SelectOptionValue): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }

  private unwrapSelectOptionValue(value: SelectOptionValue): SelectOptionValue {
    if (this.isSelectOption(value)) {
      return value.id;
    }

    return value;
  }

  private recordMatchesPrimitive(record: Record<string, unknown>, value: string | number | boolean): boolean {
    const id = record['id'];
    if (this.isComparablePrimitive(id) && String(id) === String(value)) {
      return true;
    }

    const uuid = record['uuid'];
    return this.isComparablePrimitive(uuid) && String(uuid) === String(value);
  }

  private isComparablePrimitive(value: unknown): value is string | number | boolean {
    return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean';
  }

  private isSelectOption(value: unknown): value is SelectOption {
    return typeof value === 'object' && value !== null && 'id' in value && 'label' in value;
  }
}
