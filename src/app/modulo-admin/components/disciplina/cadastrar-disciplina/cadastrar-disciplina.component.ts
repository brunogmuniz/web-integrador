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
  uuidDisciplina: string | null = null;

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
      subarea: [null, Validators.required],
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
      this.carregarDadosIniciais(uuid);
    });
  }

  private carregarDadosIniciais(uuid: string | null): void {
    this.subareaService.listarTodos().subscribe({
      next: (res) => {
        this.subareas = res;
        if (uuid) {
          this.uuidDisciplina = uuid;
          this.carregarDadosDisciplina(uuid);
        }
      },
      error: (err) => console.error(err)
    });
  }

  carregarDadosDisciplina(uuid: string): void {
    this.disciplinaService.findById(uuid).subscribe({
      next: (res: DisciplinaDTO) => {
        const subareaObj = this.subareas.find(s => s.uuid === res.uuidSubarea);

        this.form.patchValue({
          nome: res.nome,
          codigoDisciplina: res.codigoDisciplina,
          subarea: subareaObj || null,
          cargaHorariaTeorica: res.cargaHorariaTeorica,
          cargaHorariaPratica: res.cargaHorariaPratica,
          ead: res.ead
        });

        this.form.get('cargaHoraria')?.setValue(res.cargaHoraria, { emitEvent: false });
      },
      error: (err) => {
        console.error();
        void Swal.fire('Erro', 'Não foi possível carregar os dados da disciplina.', 'error');
        this.cancelar();
      }
    });
  }

  compararSubareas(a: SubareaConhecimentoDTO, b: SubareaConhecimentoDTO): boolean {
    return a && b ? a.uuid === b.uuid : a === b;
  }

  configurarCalculoAutomatico(): void {
    this.form.valueChanges.subscribe(val => {
      const teorica = Number(val.cargaHorariaTeorica) || 0;
      const pratica = Number(val.cargaHorariaPratica) || 0;
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
      uuidSubarea: formValue.subarea?.uuid,
      nomeSubarea: formValue.subarea?.nome,
      tipoDisciplina: 'PRESENCIAL'
    };

    const request = this.uuidDisciplina
      ? this.disciplinaService.update(this.uuidDisciplina, payload)
      : this.disciplinaService.create(payload);

    request.subscribe({
      next: () => {
        void Swal.fire('Sucesso', `Disciplina ${this.uuidDisciplina ? 'atualizada' : 'cadastrada'} com sucesso!`, 'success')
          .then(() => this.cancelar());
      },
      error: (err) => {
        void Swal.fire('Erro', 'Erro ao salvar disciplina.', 'error');
        console.error();
      }
    });
  }

  cancelar(): void {
    void this.router.navigate(['/disciplina/visualizar']);
  }
}
