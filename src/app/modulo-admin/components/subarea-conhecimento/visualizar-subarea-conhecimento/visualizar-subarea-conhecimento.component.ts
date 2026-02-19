import { Component, OnInit } from '@angular/core';
import { SubareaConhecimentoService, SubareaConhecimentoDTO } from "app-core";
import Swal from "sweetalert2";

@Component({
  selector: 'app-visualizar-subarea-conhecimento',
  templateUrl: './visualizar-subarea-conhecimento.component.html',
  styleUrls: ['./visualizar-subarea-conhecimento.component.scss']
})
export class VisualizarSubareaConhecimentoComponent implements OnInit {
  subAreas: SubareaConhecimentoDTO[] = [];

  constructor(private subareaService: SubareaConhecimentoService) {}

  ngOnInit(): void {
    this.carregarSubAreas();
  }

  carregarSubAreas(): void {
    this.subareaService.listarTodos().subscribe({
      next: (res) => {
        this.subAreas = res;
      },
      error: (err) => {
        console.error(err);
        this.notificarErro('Não foi possível carregar a lista de subáreas.');
      }
    });
  }

  onDelete(uuid: string): void {
    void Swal.fire({
      title: 'Tem certeza?',
      text: "Deseja excluir esta subárea? Esta ação pode afetar disciplinas vinculadas.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'btn btn-danger',
        cancelButton: 'btn btn-light'
      },
      buttonsStyling: false
    }).then((result) => {
      if (result.isConfirmed) {
        this.executarExclusao(uuid);
      }
    });
  }

  private executarExclusao(uuid: string): void {
    this.subareaService.delete(uuid).subscribe({
      next: () => {
        void Swal.fire('Sucesso', 'Subárea removida com sucesso.', 'success');
        this.carregarSubAreas();
      },
      error: (err) => {
        const msg = err.status === 409 ? 'Existem vínculos ativos para esta subárea.' : 'Erro ao tentar excluir.';
        this.notificarErro(msg);
      }
    });
  }

  trackBySubUuid(_index: number, item: SubareaConhecimentoDTO): string | undefined {
    return item.uuid;
  }

  private notificarErro(msg: string): void {
    void Swal.fire('Erro', msg, 'error');
  }
}
