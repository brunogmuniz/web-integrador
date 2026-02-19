import {Component, OnInit} from '@angular/core';
<<<<<<< HEAD:src/app/app-core/src/lib/components/cruds/estrutura-curricular/visualizar-estrutura-curricular/visualizar-estrutura-curricular.component.ts
import {EstruturaCurricularService} from "../../../../services/estrutura-curricular-service";
import {EstruturaCurricularDto} from "../../../../dto/EstruturaCurricular.dto";
=======
import {EstruturaCurricularService} from "app-core";
import {EstruturaCurricularDTO} from "app-core";
>>>>>>> origin/Refatoracao:src/app/modulo-admin/components/estrutura-curricular/visualizar-estrutura-curricular/visualizar-estrutura-curricular.component.ts
import Swal from 'sweetalert2';

@Component({
  selector: 'app-visualizar-estrutura-curricular',
  templateUrl: './visualizar-estrutura-curricular.component.html',
  styleUrls: ['../estrutura-curricular.component.scss']
})
export class VisualizarEstruturaCurricularComponent implements OnInit {

  listaEstruturas: EstruturaCurricularDTO[] = [];

  constructor(
    private service: EstruturaCurricularService,
  ) {}

  ngOnInit(): void {
    this.carregarEstruturas();
  }

  carregarEstruturas() {
    this.service.findAll().subscribe({
      next: (res) => {
        this.listaEstruturas = res;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  onDelete(uuid: string, nome: string) {
    void Swal.fire({
      title: 'Tem certeza?',
      text: `Deseja realmente excluir a estrutura "${nome}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar',
      buttonsStyling: false,
      customClass: {
        confirmButton: 'btn btn-danger',
        cancelButton: 'btn btn-primary me-3'
      }
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.service.delete(uuid).subscribe({
          next: () => {
            void Swal.fire('Sucesso', 'Estrutura Curricular excluída com sucesso!', 'success');
            this.carregarEstruturas();
          },
          error: (err) => {
            console.error();
            void Swal.fire('Erro', 'Não foi possível excluir a Estrutura Curricular. Verifique se há vínculos ativos.', 'error');
          }
        });
      }
    });
  }

  trackByEstruturaUuid(_index: number, item: EstruturaCurricularDTO) {
    return item.uuid;
  }
}
