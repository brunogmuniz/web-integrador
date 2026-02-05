import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { SubareaConhecimentoService } from "../../../../services/subarea-conhecimento-service";
import { AreaConhecimentoService } from "../../../../services/area-conhecimento-service";
import { AreaConhecimentoDTO } from "../../../../dto/AreaConhecimento.dto";

@Component({
  selector: 'app-cadastrar-subarea-conhecimento',
  templateUrl: './cadastrar-subarea-conhecimento.component.html',
  styleUrls: ['./cadastrar-subarea-conhecimento.component.scss']
})
export class CadastrarSubareaConhecimentoComponent implements OnInit {
  subAreaForm!: FormGroup;
  areasDeConhecimento$!: Observable<AreaConhecimentoDTO[]>;
  modoEdicao = false;
  subAreaId?: number;

  constructor(
    private fb: FormBuilder,
    private subareaService: SubareaConhecimentoService,
    private areaService: AreaConhecimentoService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.areasDeConhecimento$ = this.areaService.listarTodos().pipe(
      map((res: any) => Array.isArray(res) ? res : res.content || [])
    );
    this.verificarEdicao();
  }

  private initForm(): void {
    this.subAreaForm = this.fb.group({
      id: [null],
      nome: ['', [Validators.required, Validators.minLength(3)]],
      sigla: ['', Validators.required],
      cargaHorariaTotal: [0, [Validators.required, Validators.min(1)]],
      areaConhecimentoId: [null, Validators.required]
    });
  }

  private verificarEdicao(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.modoEdicao = true;
      this.subAreaId = Number(id);
      this.carregarDados(this.subAreaId);
    }
  }

  private carregarDados(id: number): void {
    this.subareaService.buscarPorId(id).subscribe({
      next: (res) => {
        this.subAreaForm.patchValue({
          ...res,
          areaConhecimentoId: res.area?.id
        });
      },
      error: () => {
        this.notificarErro('Não foi possível carregar os dados da subárea.');
        this.cancelar();
      }
    });
  }

  get c() {
    return this.subAreaForm.controls as { [key: string]: FormControl };
  }

  onSubmit(): void {
    if (this.subAreaForm.invalid) {
      this.subAreaForm.markAllAsTouched();
      return;
    }

    const { areaConhecimentoId, ...formVal } = this.subAreaForm.value;

    const payload = {
      ...formVal,
      area: { id: areaConhecimentoId }
    };

    const request = this.modoEdicao && this.subAreaId
      ? this.subareaService.update(this.subAreaId, payload)
      : this.subareaService.create(payload);

    request.subscribe({
      next: () => {
        void Swal.fire('Sucesso', `Subárea ${this.modoEdicao ? 'atualizada' : 'cadastrada'}!`, 'success');
        this.cancelar();
      },
      error: (err) => this.notificarErro(err.error?.message || 'Erro ao salvar registro.')
    });
  }

  cancelar(): void {
    void this.router.navigate(['/sub-area/visualizar']);
  }

  private notificarErro(msg: string): void {
    void Swal.fire('Erro', msg, 'error');
  }
}
