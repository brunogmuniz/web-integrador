import { Component, OnInit } from '@angular/core';
import { AreaConhecimentoDTO } from "../../../../app-core/src/lib/dto/AreaConhecimento.dto";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { AreaConhecimentoService } from "../../../../app-core/src/lib/services/area-conhecimento-service";
import { ActivatedRoute, Router } from "@angular/router";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cadastrar-area-conhecimento',
  templateUrl: './cadastrar-area-conhecimento.component.html',
  styleUrls: ['./cadastrar-area-conhecimento.component.scss']
})
export class CadastrarAreaConhecimentoComponent implements OnInit {

  areaForm!: FormGroup;
  areas: AreaConhecimentoDTO[] = [];

  areaId?: number;
  modoEdicao = false;

  constructor(
    private fb: FormBuilder,
    private areaService: AreaConhecimentoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.areaForm = this.fb.group({
      id: [],
      nome: ['', Validators.required],
      sigla: ['', Validators.required],
      cargaHorariaTotal: ['', [Validators.required, Validators.min(1)]],
    });

    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');

      if (idParam) {
        this.areaId = Number(idParam);
        this.modoEdicao = true;
        this.carregarArea(this.areaId);
      } else {
        this.modoEdicao = false;
        this.areaId = undefined;
        this.areaForm.reset();
      }
    });

    this.loadAreas();
  }

  get c(): { [key: string]: FormControl } {
    return this.areaForm.controls as { [key: string]: FormControl };
  }

  trackByAreaId(index: number, item: AreaConhecimentoDTO) {
    return item.id;
  }

  loadAreas(): void {
    this.areaService.listarTodos().subscribe({
      next: (data) => this.areas = data,
      error: (err) => console.error('Erro ao carregar áreas:', err)
    });
  }

  carregarArea(id: number): void {
    this.areaService.buscarPorId(id).subscribe({
      next: (area) => {
        this.areaForm.patchValue(area);
      },
      error: (err) => console.error('Erro ao carregar área:', err)
    });
  }

  onDelete(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta área?')) {
      this.areaService.delete(id).subscribe({
        next: () => {
          this.areas = this.areas.filter(a => a.id !== id);
        },
        error: (err) => console.error('Erro ao deletar área:', err)
      });
    }
  }

  onSubmit(): void {
    if (this.areaForm.invalid) {
      this.areaForm.markAllAsTouched();
      return;
    }

    if (this.modoEdicao && this.areaId) {
      this.areaService.update(this.areaId, this.areaForm.value).subscribe({
        next: () => {
          Swal.fire({
            title: 'Atualizada!',
            text: 'Área atualizada com sucesso.',
            icon: 'success',
            timer: 1800,
            showConfirmButton: false
          });
          this.router.navigate(['/area/visualizar']);
        },
        error: () => {
          Swal.fire({
            title: 'Erro!',
            text: 'Não foi possível atualizar a área.',
            icon: 'error'
          });
        }
      });
    } else {
      this.areaService.create(this.areaForm.value).subscribe({
        next: () => {
          Swal.fire({
            title: 'Cadastrada!',
            text: 'Área cadastrada com sucesso.',
            icon: 'success',
            timer: 1800,
            showConfirmButton: false
          });
          this.areaForm.reset();
          this.loadAreas();
        },
        error: () => {
          Swal.fire({
            title: 'Erro!',
            text: 'Não foi possível cadastrar a área.',
            icon: 'error'
          });
        }
      });
    }
  }


  cancelar(): void {
    void this.router.navigate(['/area/visualizar']);
  }
}
