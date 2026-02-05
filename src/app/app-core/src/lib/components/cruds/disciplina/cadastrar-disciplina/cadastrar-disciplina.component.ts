import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { DisciplinaService } from "../../../../services/disciplina-service";
import { SubareaConhecimentoService } from "../../../../services/subarea-conhecimento-service";
import { SubareaConhecimentoDTO } from "../../../../dto/SubareaConhecimento.dto";
import { DisciplinaDTO } from "../../../../dto/Disciplina.dto";

@Component({
  selector: 'app-cadastrar-disciplina',
  templateUrl: './cadastrar-disciplina.component.html',
  styleUrls: ['./cadastrar-disciplina.component.scss']
})
export class CadastrarDisciplinaComponent implements OnInit {
  form: FormGroup;
  subareas: SubareaConhecimentoDTO[] = [];
  idDisciplina: number | null = null;

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
    this.carregarSubareas();
    this.configurarCalculoAutomatico();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.idDisciplina = Number(id);
      this.carregarDadosDisciplina(this.idDisciplina);
    }
  }

  carregarSubareas(): void {
    this.subareaService.listarTodos().subscribe(res => {
      this.subareas = res;
      if (this.idDisciplina && this.form.value.subarea) {
        const subareaSelecionada = this.subareas.find(s => s.id === this.form.value.subarea.id);
        if (subareaSelecionada) {
          this.form.patchValue({ subarea: subareaSelecionada });
        }
      }
    });
  }

  carregarDadosDisciplina(id: number): void {
    this.disciplinaService.findById(id).subscribe({
      next: (res) => {
        let subareaObj = res.idSubarea ? { id: res.idSubarea, nome: res.nomeSubarea } : null;
        if (this.subareas.length > 0 && res.idSubarea) {
          const found = this.subareas.find(s => s.id === res.idSubarea);
          if (found) subareaObj = found;
        }

        this.form.patchValue({
          nome: res.nome,
          codigoDisciplina: res.codigoDisciplina,
          subarea: subareaObj,
          cargaHorariaTeorica: res.cargaHorariaTeorica,
          cargaHorariaPratica: res.cargaHorariaPratica,
          ead: res.ead
        });

        this.form.get('cargaHoraria')?.setValue(res.cargaHoraria);
      },
      error: (err) => {
        console.error(err);
        void Swal.fire('Erro', 'Não foi possível carregar os dados da disciplina.', 'error');
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

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.getRawValue();

    const payload: DisciplinaDTO = {
      id: this.idDisciplina ? this.idDisciplina : 0,
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

    if (this.idDisciplina) {
      this.disciplinaService.update(this.idDisciplina, payload).subscribe({
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
    } else {
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
  }

  cancelar(): void {
    void this.router.navigate(['/disciplina/visualizar']);
  }
}
