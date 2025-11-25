import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {RouterLink} from '@angular/router'; // necessário para ngModel

@Component({
  selector: 'app-area-tabela',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './area-tabela.html',
  styleUrls: ['./area-tabela.css']
})
export class AreaTabelaComponent {
  inputBusca = '';

  areas = [
    { id: 1, codigo: 'MAB', nome: 'Matemática', media: 23.2, nrDocentes: 12, ano2024s1: 100, ano2025s1: 130, ano2026s1: 120, ano2027s1: 130, ano2024s2: 100, ano2025s2: 130, ano2026s2: 120, ano2027s2: 130 },
    { id: 2, codigo: 'CCO', nome: 'Ciência da Computação', media: 15.22, nrDocentes: 10, ano2024s1: 100, ano2025s1: 100, ano2026s1: 130, ano2027s1: 120, ano2024s2: 100, ano2025s2: 130, ano2026s2: 120, ano2027s2: 130 },
    { id: 100, codigo: 'CTB', nome: 'Contabilidade', media: 9.12, nrDocentes: 130, ano2024s1: 140, ano2025s1: 100, ano2026s1: 100, ano2027s1: 130, ano2024s2: 100, ano2025s2: 130, ano2026s2: 120, ano2027s2: 130 },
    { id: 3, codigo: 'FIS', nome: 'Física', media: 6.12, nrDocentes: 130, ano2024s1: 105, ano2025s1: 100, ano2026s1: 100, ano2027s1: 130, ano2024s2: 100, ano2025s2: 130, ano2026s2: 120, ano2027s2: 130 },
    { id: 12, codigo: 'QUI', nome: 'Química', media: 1.1, nrDocentes: 12, ano2024s1: 100, ano2025s1: 130, ano2026s1: 120, ano2027s1: 130, ano2024s2: 100, ano2025s2: 130, ano2026s2: 120, ano2027s2: 130 },
    { id: 321, codigo: 'CBIO', nome: 'Ciências Biológicas', media: 1.13, nrDocentes: 10, ano2024s1: 100, ano2025s1: 100, ano2026s1: 130, ano2027s1: 120, ano2024s2: 100, ano2025s2: 130, ano2026s2: 120, ano2027s2: 130 },
    { id: 421, codigo: 'HIS', nome: 'História', media: 9.0, nrDocentes: 130, ano2024s1: 3, ano2025s1: 100, ano2026s1: 100, ano2027s1: 130, ano2024s2: 100, ano2025s2: 130, ano2026s2: 120, ano2027s2: 130 },
    { id: 32, codigo: 'GEOC', nome: 'Geociências', media: 9.0, nrDocentes: 130, ano2024s1: 3, ano2025s1: 100, ano2026s1: 100, ano2027s1: 130, ano2024s2: 100, ano2025s2: 130, ano2026s2: 120, ano2027s2: 130 },
    { id: 32, codigo: 'FIL', nome: 'Filosofia', media: 1.1, nrDocentes: 12, ano2024s1: 100, ano2025s1: 130, ano2026s1: 120, ano2027s1: 130, ano2024s2: 100, ano2025s2: 130, ano2026s2: 120, ano2027s2: 130 },
    { id: 31, codigo: 'SOC', nome: 'Sociologia', media: 12.1, nrDocentes: 10, ano2024s1: 100, ano2025s1: 100, ano2026s1: 130, ano2027s1: 120, ano2024s2: 100, ano2025s2: 130, ano2026s2: 120, ano2027s2: 130 },
    { id: 43, codigo: 'EDF', nome: 'Educação Física', media: 9.0, nrDocentes: 130, ano2024s1: 150, ano2025s1: 100, ano2026s1: 100, ano2027s1: 130, ano2024s2: 100, ano2025s2: 130, ano2026s2: 120, ano2027s2: 130 },
    { id: 534, codigo: 'LET', nome: 'Letras', media: 9.0, nrDocentes: 130, ano2024s1: 3, ano2025s1: 100, ano2026s1: 100, ano2027s1: 130, ano2024s2: 100, ano2025s2: 130, ano2026s2: 120, ano2027s2: 130 },
    { id: 43, codigo: 'ART', nome: 'Artes', media: 13.1, nrDocentes: 12, ano2024s1: 100, ano2025s1: 130, ano2026s1: 120, ano2027s1: 130, ano2024s2: 100, ano2025s2: 130, ano2026s2: 120, ano2027s2: 130 },
    { id: 321, codigo: 'PANI', nome: 'Produção Animal', media: 12.1, nrDocentes: 10, ano2024s1: 100, ano2025s1: 100, ano2026s1: 130, ano2027s1: 120, ano2024s2: 100, ano2025s2: 130, ano2026s2: 120, ano2027s2: 130 },
    { id: 321, codigo: 'PVE', nome: 'Produção Vegetal', media: 9.0, nrDocentes: 130, ano2024s1: 140, ano2025s1: 100, ano2026s1: 100, ano2027s1: 130, ano2024s2: 100, ano2025s2: 130, ano2026s2: 120, ano2027s2: 130 },
    { id: 231, codigo: 'SAU', nome: 'Saúde', media: 9.0, nrDocentes: 130, ano2024s1: 120, ano2025s1: 100, ano2026s1: 100, ano2027s1: 130, ano2024s2: 100, ano2025s2: 130, ano2026s2: 120, ano2027s2: 130 },

  ];

  get areasFiltradas() {
    const term = this.inputBusca.toLowerCase();
    return this.areas.filter(area =>
      area.nome.toLowerCase().includes(term) ||
      area.codigo.toLowerCase().includes(term)
    );
  }
}
