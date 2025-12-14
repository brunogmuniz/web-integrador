import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { DisciplinaService } from "../../../../app-core/src/lib/services/disciplina-service";
import { SubareaConhecimentoService } from "../../../../app-core/src/lib/services/subarea-conhecimento-service";
import { SubareaConhecimentoDTO } from "../../../../app-core/src/lib/dto/SubareaConhecimento.dto";
import { DisciplinaDTO } from "../../../../app-core/src/lib/dto/Disciplina.dto";

@Component({
  selector: 'app-editar-disciplina',
  templateUrl: './editar-disciplina.component.html',
  styleUrls: ['./editar-disciplina.component.scss']
})
export class EditarDisciplinaComponent implements OnInit {
  form: FormGroup;
  subareas: SubareaConhecimentoDTO[] = [];
  id!: number;
  disciplinaAtual!: DisciplinaDTO;

  constructor(
    private fb: FormBuilder,
    private disciplinaService: DisciplinaService,
    private subareaService: SubareaConhecimentoService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      id: [null],
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
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.subareaService.listarTodos().subscribe(res => {
      this.subareas = res;
      this.carregarDados();
    });
    this.configurarCalculoAutomatico();
  }

  carregarDados(): void {
    this.disciplinaService.findById(this.id).subscribe({
      next: (dados) => {
        this.disciplinaAtual = dados;

        const subareaEncontrada = this.subareas.find(s => s.id === dados.idSubarea);

        this.form.patchValue({
          id: dados.id,
          nome: dados.nome,
          codigoDisciplina: dados.codigoDisciplina,
          cargaHorariaTeorica: dados.cargaHorariaTeorica,
          cargaHorariaPratica: dados.cargaHorariaPratica,
          cargaHoraria: dados.cargaHoraria,
          ead: dados.ead,
          subarea: subareaEncontrada
        });
      },
      error: () => {
        void Swal.fire('Erro', 'Não foi possível carregar os dados.', 'error');
        this.cancelar();
      }
    });
  }

  configurarCalculoAutomatico(): void {
    this.form.valueChanges.subscribe(val => {
      const teorica = val.cargaHorariaTeorica || 0;
      const pratica = val.cargaHorariaPratica || 0;
      this.form.get('cargaHoraria')?.setValue(teorica + pratica, { emitEvent: false });
    });
  }

  compararSubareas(o1: SubareaConhecimentoDTO, o2: SubareaConhecimentoDTO): boolean {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.getRawValue();

    const payload: DisciplinaDTO = {
      id: this.id,
      nome: formValue.nome,
      codigoDisciplina: formValue.codigoDisciplina,
      cargaHoraria: formValue.cargaHoraria,
      idSubarea: formValue.subarea ? formValue.subarea.id : null,
      nomeSubarea: formValue.subarea ? formValue.subarea.nome : '',
      ead: formValue.ead,
      cargaHorariaTeorica: formValue.cargaHorariaTeorica,
      cargaHorariaPratica: formValue.cargaHorariaPratica,
      tipoDisciplina: this.disciplinaAtual.tipoDisciplina
    };

    this.disciplinaService.update(this.id, payload).subscribe({
      next: () => {
        void Swal.fire('Sucesso', 'Disciplina atualizada com sucesso!', 'success').then(() => {
          void this.router.navigate(['/disciplina/visualizar']);
        });
      },
      error: (err) => {
        void Swal.fire('Erro', 'Erro ao atualizar disciplina.', 'error');
        console.error(err);
      }
    });
  }

  cancelar(): void {
    void this.router.navigate(['/disciplina/visualizar']);
  }
}
