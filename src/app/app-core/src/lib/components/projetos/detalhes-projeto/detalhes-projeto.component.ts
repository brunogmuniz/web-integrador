import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ProjetosDTO } from 'app-core/lib/dto/Projetos.dto';
import { ProjetoService } from 'app-core/lib/services/projetos/projeto.service';

@Component({
  selector: 'lib-detalhes-projeto',
  templateUrl: './detalhes-projeto.component.html',
  styleUrls: ['./detalhes-projeto.component.css']
})
export class DetalhesProjetoComponent implements OnInit {

  projeto: ProjetosDTO | null = null;

  constructor(
    private route: ActivatedRoute,
    private projetoService: ProjetoService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (id) {
      this.carregarProjeto(id);
    }
  }

  carregarProjeto(id: number): void {
    this.projetoService.buscarPorId(id).subscribe({
      next: (res) => {
        this.projeto = res;
      },
      error: (err) => {
        console.error('Erro ao carregar detalhes:', err);
      }
    });
  }

}
