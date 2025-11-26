import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-docente-encargos-container',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './docente-encargos.component.html'
})
export class DocenteEncargos {
}
