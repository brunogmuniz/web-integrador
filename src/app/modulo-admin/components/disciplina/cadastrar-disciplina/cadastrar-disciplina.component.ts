import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { DisciplinaService } from "../../../../app-core/src/lib/services/disciplina-service";
import { SubareaConhecimentoService } from "../../../../app-core/src/lib/services/subarea-conhecimento-service";
import { SubareaConhecimentoDTO } from "../../../../app-core/src/lib/dto/SubareaConhecimento.dto";
import { DisciplinaDTO } from "../../../../app-core/src/lib/dto/Disciplina.dto";

@Component({
  selector: 'app-cadastrar-disciplina',
  templateUrl: './cadastrar-disciplina.component.html',
  styleUrls: ['./cadastrar-disciplina.component.scss']
})
export class CadastrarDisciplinaComponent implements OnInit {
  form: FormGroup;
  subareas: SubareaConhecimentoDTO[] = [];

  constructor(
    private fb: FormBuilder,
    private disciplinaService: DisciplinaService,
    private subareaService: SubareaConhecimentoService,
    private router: Router
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
    this.carregarSubareas();
    this.configurarCalculoAutomatico();
  }

  carregarSubareas(): void {
    this.subareaService.listarTodos().subscribe(res => this.subareas = res);
  }

  configurarCalculoAutomatico(): void {
    this.form.valueChanges.subscribe(val => {
      const teorica = val.cargaHorariaTeorica || 0;
      const pratica = val.cargaHorariaPratica || 0;
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
      id: 0,
      nome: formValue.nome,
      codigoDisciplina: formValue.codigoDisciplina,
      cargaHoraria: formValue.cargaHoraria,
      idSubarea: formValue.subarea ? formValue.subarea.id : null,
      nomeSubarea: formValue.subarea ? formValue.subarea.nome : '',
      ead: formValue.ead,
      cargaHorariaTeorica: formValue.cargaHorariaTeorica,
      cargaHorariaPratica: formValue.cargaHorariaPratica,
      tipoDisciplina: 'PRESENCIAL'
    };

    this.disciplinaService.create(payload).subscribe({
      next: () => {
        void Swal.fire('Sucesso', 'Disciplina cadastrada com sucesso!', 'success').then(() => {
          void this.router.navigate(['/disciplina/visualizar']);
        });
      },
      error: (err) => {
        void Swal.fire('Erro', 'Erro ao cadastrar disciplina.', 'error');
        console.error(err);
      }
    });
  }

  cancelar(): void {
    void this.router.navigate(['/disciplina/visualizar']);
  }
}
