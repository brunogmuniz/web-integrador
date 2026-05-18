import { Component, Input } from '@angular/core';

@Component({
  selector: 'lib-view-input',
  templateUrl: './view-input.component.html',
  styleUrls: ['./view-input.component.css']
})
export class ViewInputComponent {

  @Input() label: string = '';
  @Input() value: string | number | null = null;

}
