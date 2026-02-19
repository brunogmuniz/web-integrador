<<<<<<< HEAD:src/app/app-core/src/lib/components/cruds/area-conhecimento/visualizar-area-conhecimento/visualizar-area-conhecimento.component.ts
import {Component, OnInit} from '@angular/core';
import {AreaConhecimentoDTO} from "../../../../dto/AreaConhecimento.dto";
import {AreaConhecimentoService} from "../../../../services/area-conhecimento-service";
=======
import { Component, OnInit } from '@angular/core';
import { AreaConhecimentoDTO } from "app-core";
import { AreaConhecimentoService } from "app-core";
>>>>>>> origin/Refatoracao:src/app/modulo-admin/components/area-conhecimento/visualizar-area-conhecimento/visualizar-area-conhecimento.component.ts
import Swal from 'sweetalert2';

@Component({
  selector: 'app-visualizar-area-conhecimento',
  templateUrl: './visualizar-area-conhecimento.component.html',
  styleUrls: ['./visualizar-area-conhecimento.component.scss']
})
export class VisualizarAreaConhecimentoComponent implements OnInit {
  areas: AreaConhecimentoDTO[] = [];

  constructor(private areaService: AreaConhecimentoService) {}

  ngOnInit(): void {
    this.loadAreas();
  }

  loadAreas(): void {
    this.areaService.listarTodos().subscribe({
      next: (data) => this.areas = data,
      error: (err) => {
        console.error(err);
        this.exibirErro('Não foi possível carregar a lista de áreas.');
      }
    });
  }

  onDelete(uuid: string | undefined): void {
    if (!uuid) return;

    Swal.fire({
      title: 'Tem certeza?',
      text: 'Essa área de conhecimento será excluída permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.areaService.delete(uuid).subscribe({
          next: () => {
            this.areas = this.areas.filter(a => a.uuid !== uuid);
            this.exibirSucesso('Área excluída com sucesso!');
          },
          error: (err) => {
            console.error(err);
            this.exibirErro('Não foi possível excluir a área. Verifique se existem dependências vinculadas.');
          }
        });
      }
    });
  }

  private exibirSucesso(msg: string): void {
    void Swal.fire('Sucesso!', msg, 'success');
  }

  private exibirErro(msg: string): void {
    void Swal.fire('Erro!', msg, 'error');
  }
}
