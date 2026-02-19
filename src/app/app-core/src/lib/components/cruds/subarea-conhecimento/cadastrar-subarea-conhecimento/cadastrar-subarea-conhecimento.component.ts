import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
<<<<<<< HEAD:src/app/app-core/src/lib/components/cruds/subarea-conhecimento/cadastrar-subarea-conhecimento/cadastrar-subarea-conhecimento.component.ts
import { SubareaConhecimentoService } from "../../../../services/subarea-conhecimento-service";
import { AreaConhecimentoService } from "../../../../services/area-conhecimento-service";
import { AreaConhecimentoDTO } from "../../../../dto/AreaConhecimento.dto";
=======
import { SubareaConhecimentoService, AreaConhecimentoService, AreaConhecimentoDTO, SubareaConhecimentoDTO } from "app-core";
>>>>>>> origin/Refatoracao:src/app/modulo-admin/components/subarea-conhecimento/cadastrar-subarea-conhecimento/cadastrar-subarea-conhecimento.component.ts

@Component({
  selector: 'app-cadastrar-subarea-conhecimento',
  templateUrl: './cadastrar-subarea-conhecimento.component.html',
  styleUrls: ['./cadastrar-subarea-conhecimento.component.scss']
})
export class CadastrarSubareaConhecimentoComponent implements OnInit {
  subAreaForm!: FormGroup;
  areasDeConhecimento$!: Observable<AreaConhecimentoDTO[]>;
  modoEdicao = false;
  subAreaUuid?: string;

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
      uuid: [null],
      nome: ['', [Validators.required, Validators.minLength(3)]],
      sigla: ['', Validators.required],
      cargaHorariaTotal: [0, [Validators.required, Validators.min(1)]],
      areaId: [null, Validators.required]
    });
  }

  private verificarEdicao(): void {
    const uuid = this.route.snapshot.paramMap.get('id');
    if (uuid) {
      this.modoEdicao = true;
      this.subAreaUuid = uuid;
      this.carregarDados(this.subAreaUuid);
    }
  }

  private carregarDados(uuid: string): void {
    this.subareaService.buscarPorUuid(uuid).subscribe({
      next: (res) => {
        this.subAreaForm.patchValue({
          uuid: res.uuid,
          nome: res.nome,
          sigla: res.sigla,
          cargaHorariaTotal: res.cargaHorariaTotal,
          areaId: res.area?.id || res.areaId
        });
      },
      error: () => this.notificarErro('Não foi possível carregar os dados.')
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

    const payload: SubareaConhecimentoDTO = this.subAreaForm.value;
    const request = this.modoEdicao && this.subAreaUuid
      ? this.subareaService.update(this.subAreaUuid, payload)
      : this.subareaService.create(payload);

    request.subscribe({
      next: () => {
        void Swal.fire('Sucesso', 'Registro salvo!', 'success');
        this.cancelar();
      },
      error: (err: any) => this.notificarErro(err.error?.message || 'Erro ao salvar.')
    });
  }

  cancelar(): void {
    void this.router.navigate(['/sub-area/visualizar']);
  }

  private notificarErro(msg: string): void {
    void Swal.fire('Erro', msg, 'error');
  }
}
