import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { SubareaConhecimentoService } from "../../../../app-core/src/lib/services/subarea-conhecimento-service";
import { AreaConhecimentoService } from "../../../../app-core/src/lib/services/area-conhecimento-service";
import { SubareaConhecimentoDTO } from "../../../../app-core/src/lib/dto/SubareaConhecimento.dto";
import { AreaConhecimentoDTO } from "../../../../app-core/src/lib/dto/AreaConhecimento.dto";
import Swal from 'sweetalert2';
import { Observable } from "rxjs";

@Component({
  selector: 'app-cadastrar-subarea-conhecimento',
  templateUrl: './cadastrar-subarea-conhecimento.component.html',
  styleUrls: ['./cadastrar-subarea-conhecimento.component.scss']
})
export class CadastrarSubareaConhecimentoComponent implements OnInit {
  subAreaForm!: FormGroup;
  areasDeConhecimento$!: Observable<AreaConhecimentoDTO[]>;
  modoEdicao = false;
  subAreaId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private subAreaService: SubareaConhecimentoService,
    private areaService: AreaConhecimentoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadAreas();

    // Verifica se existe id na rota para modo edição
    this.subAreaId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.subAreaId) {
      this.modoEdicao = true;
      this.loadSubArea(this.subAreaId);
    }
  }

  private initForm(): void {
    this.subAreaForm = this.fb.group({
      nome: ['', Validators.required],
      sigla: ['', Validators.required],
      cargaHoraria: [null, [Validators.required, Validators.min(1)]],
      areaConhecimentoId: [null, Validators.required],
    });
  }

  private loadAreas(): void {
    this.areasDeConhecimento$ = this.areaService.listarTodos();
  }

  private loadSubArea(id: number): void {
    this.subAreaService.buscarPorId(id).subscribe({
      next: (sub: SubareaConhecimentoDTO) => {
        this.subAreaForm.patchValue({
          nome: sub.nome,
          sigla: sub.sigla,
          cargaHoraria: sub.cargaHorariaTotal,
          areaConhecimentoId: sub.area
        });
      },
      error: (err) => console.error('Erro ao carregar subárea:', err)
    });
  }

  get c(): { [key: string]: FormControl } {
    return this.subAreaForm.controls as { [key: string]: FormControl };
  }

  onSubmit(): void {
    if (this.subAreaForm.invalid) {
      this.subAreaForm.markAllAsTouched();
      void Swal.fire('Atenção', 'Preencha todos os campos obrigatórios.', 'warning');
      return;
    }

    const payload = {
      ...this.subAreaForm.value,
      cargaHorariaTotal: this.subAreaForm.value.cargaHoraria
    };

    if (this.modoEdicao && this.subAreaId) {

      this.subAreaService.update(this.subAreaId, payload).subscribe({
        next: () => {
          void Swal.fire('Sucesso', 'Subárea atualizada com sucesso!', 'success');
          void this.router.navigate(['/sub-area']);
        },
        error: (err) => {
          console.error('Erro ao atualizar subárea:', err);
          void Swal.fire('Erro', 'Não foi possível atualizar a subárea.', 'error');
        }
      });
    } else {

      this.subAreaService.create(payload).subscribe({
        next: () => {
          void Swal.fire('Sucesso', 'Subárea criada com sucesso!', 'success');
          void this.router.navigate(['/sub-area']);
        },
        error: (err) => {
          console.error('Erro ao criar subárea:', err);
          void Swal.fire('Erro', 'Não foi possível criar a subárea.', 'error');
        }
      });
    }
  }

  cancelar(): void {
    void this.router.navigate(['/sub-area']);
  }
}
