import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { DocenteService, DocenteDetalheDTO } from 'shared-core';

@Component({
  selector: 'app-visualizar-docente-encargos',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  providers: [DocenteService],
  templateUrl: './visualizar-docente-encargos.component.html'
})
export class VisualizarDocenteEncargos implements OnInit {
  listaDocentesDetalhados: DocenteDetalheDTO[] = [];

  constructor(private docenteService: DocenteService) {}

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    this.docenteService.listarTodosDetalhado().subscribe({
      next: (detalhes) => {
        this.listaDocentesDetalhados = detalhes.filter(d => !!d);
      },
      error: (err) => console.error('Erro ao carregar detalhes', err)
    });
  }

  getNomesAreas(subAreas: any[]): string[] {
    if (!subAreas) return [];
    return Array.from(new Set(subAreas.map(sub => sub.nomeArea)));
  }
}
