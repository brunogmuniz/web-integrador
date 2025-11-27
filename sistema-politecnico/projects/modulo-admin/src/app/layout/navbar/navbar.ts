import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class NavbarComponent {
  navLinks = [
    { path: '/', label: 'Início' },
    { path: '/area', label: 'Áreas' },
    { path: '/subarea', label: 'Subáreas' },
    { path: '/curso', label: 'Cursos' },
    { path: '/disciplina', label: 'Disciplinas' },
    { path: '/estrutura-curricular', label: 'Estruturas' },
    { path: '/docente', label: 'Docentes' },
    { path: '/docente-encargos', label: 'Encargos' },
    { path: '/departamento', label: 'Departamentos' },
  ];
}
