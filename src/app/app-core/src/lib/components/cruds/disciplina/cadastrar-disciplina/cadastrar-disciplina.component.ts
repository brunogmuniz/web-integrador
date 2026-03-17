import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { DisciplinaService } from "app-core";
import { SubareaConhecimentoService } from "app-core";
import { SubareaConhecimentoDTO } from "app-core";
import { DisciplinaDTO } from "app-core";

@Component({
  selector: 'app-cadastrar-disciplina',
  templateUrl: './cadastrar-disciplina.component.html',
  styleUrls: ['./cadastrar-disciplina.component.scss']
})
export class CadastrarDisciplinaComponent implements OnInit {
  form: FormGroup;
  subareas: SubareaConhecimentoDTO[] = [];
  uuidDisciplina?: string;

  constructor(
    private fb: FormBuilder,
    private disciplinaService: DisciplinaService,
    private subareaService: SubareaConhecimentoService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      nome: [null, [Validators.required, Validators.minLength(3)]],
      codigoDisciplina: [null, Validators.required],
      subareaId: [null, Validators.required],
      cargaHorariaTeorica: [0, [Validators.required, Validators.min(0)]],
      cargaHorariaPratica: [0, [Validators.required, Validators.min(0)]],
      cargaHoraria: [{ value: 0, disabled: true }],
      ead: [false]
    });
  }

  ngOnInit(): void {
    this.configurarCalculoAutomatico();
    this.route.params.subscribe(params => {
      const uuid = params['id'];
      if (uuid) {
        this.uuidDisciplina = uuid;
      }
      this.carregarDadosIniciais(uuid);
    });
  }

  private carregarDadosIniciais(uuid: string | null): void {
    this.subareaService.listarTodos().subscribe({
      next: (res) => {
        this.subareas = res;
        if (uuid) {
          this.carregarDadosDisciplina(uuid);
        }
      },
      error: (err: any) => console.error('Erro ao carregar subáreas:', err)
    });
  }

  carregarDadosDisciplina(uuid: string): void {
    this.disciplinaService.findById(uuid).subscribe({
      next: (res: DisciplinaDTO) => {
        this.form.patchValue(res);
        this.form.get('cargaHoraria')?.setValue(res.cargaHoraria, { emitEvent: false });
      },
      error: (_err) => {
        void Swal.fire('Erro', 'Erro ao carregar disciplina', 'error');
        void this.router.navigate(['/disciplina/visualizar']);
      }
    });
  }

  configurarCalculoAutomatico(): void {
    this.form.valueChanges.subscribe(() => {
      const teorica = Number(this.form.get('cargaHorariaTeorica')?.value) || 0;
      const pratica = Number(this.form.get('cargaHorariaPratica')?.value) || 0;
      this.form.get('cargaHoraria')?.setValue(teorica + pratica, { emitEvent: false });
    });
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.getRawValue();
    const payload: DisciplinaDTO = {
      ...formValue,
      uuid: this.uuidDisciplina,
      tipoDisciplina: 'PRESENCIAL',
    };

    console.log('Payload Processado:', payload);

    const request = this.uuidDisciplina
      ? this.disciplinaService.update(this.uuidDisciplina, payload)
      : this.disciplinaService.create(payload);

    request.subscribe({
      next: () => {
        void Swal.fire('Sucesso', 'Disciplina salva com sucesso!', 'success');
        void this.router.navigate(['/disciplina/visualizar']);
      },
      error: (err: any) => {
        const msg = err.error?.message || 'Erro ao salvar disciplina.';
        void Swal.fire('Erro', msg, 'error');
      }
    });
  }

  cancelar(): void {
    void this.router.navigate(['/disciplina/visualizar']);
  }
}
