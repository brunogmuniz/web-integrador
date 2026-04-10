import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {EstruturaCurricularService} from "app-core";
import {CursoService} from "app-core";
import {DisciplinaService} from "app-core";
import Swal from "sweetalert2";
import { EstruturaCurricularDTO } from 'app-core';

@Component({
  selector: 'app-cadastrar-estrutura-curricular',
  templateUrl: './cadastrar-estrutura-curricular.component.html',
  styleUrls: ['../estrutura-curricular.component.scss']
})
export class CadastrarEstruturaCurricularComponent implements OnInit {
  form: FormGroup;
  listaCursos: any[] = [];
  listaDisciplinas: any[] = [];
  listaOpcoesSemestre = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  isEdicao = false;

  constructor(
    private fb: FormBuilder,
    private service: EstruturaCurricularService,
    private cursoService: CursoService,
    private disciplinaService: DisciplinaService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      uuid: [undefined],
      codigo: ['', Validators.required],
      ano: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
      curso: [null, Validators.required],
      ativo: [true],
      ofertas: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.carregarDependencias();
  }

  carregarDependencias() {
    this.cursoService.findAll().subscribe({
      next: (resCursos: any) => {
        this.listaCursos = resCursos.content || resCursos;

        this.disciplinaService.findAll().subscribe({
          next: (resD: any) => {
            this.listaDisciplinas = resD.content || resD;

            const uuid = this.route.snapshot.paramMap.get('id');
            if (uuid) {
              this.isEdicao = true;
              this.carregarEstrutura(uuid);
            }
          },
          error: (err) => console.error('Erro ao carregar disciplinas', err)
        });
      },
      error: (err) => console.error('Erro ao carregar cursos', err)
    });
  }

  carregarEstrutura(uuid: string) {
    this.service.findById(uuid).subscribe({
      next: (res: any) => {
        this.ofertas.clear();

        let cursoEncontrado = this.listaCursos.find(c => c.uuid === res.cursoUuid);
        if (!cursoEncontrado && res.cursoId) {
          cursoEncontrado = this.listaCursos.find(c => c.id === res.cursoId);
        }

        this.form.patchValue({
          uuid: res.uuid,
          codigo: res.codigo,
          ano: res.ano,
          curso: cursoEncontrado,
          ativo: res.ativo
        });

        if (res.ofertas) {
          res.ofertas.forEach((o: any) => {
            let discObj = this.listaDisciplinas.find(d => d.uuid === o.disciplinaUuid);
            if (!discObj && o.disciplinaId) {
              discObj = this.listaDisciplinas.find(d => d.id === o.disciplinaId);
            }

            this.adicionarOfertaComDados({ ...o, disciplinaObj: discObj });
          });
        }
      },
      error: (_err) => Swal.fire('Erro', 'Não foi possível carregar a estrutura.', 'error')
    });
  }

  get ofertas(): FormArray {
    return this.form.get('ofertas') as FormArray;
  }

  adicionarOferta() {
    this.adicionarOfertaComDados(null);
  }

  adicionarOfertaComDados(dados: any | null) {
    const group = this.fb.group({
      disciplina: [dados?.disciplinaObj || null, Validators.required],
      semestre: [dados?.semestre || null, Validators.required],
      numProfessoresPratica: [dados?.numProfessoresPratica || 1],
      numProfessoresTeorica: [dados?.numProfessoresTeorica || 1],
      tutoria: [dados?.tutoria || false]
    });
    this.ofertas.push(group);
  }

  removerOferta(index: number) {
    this.ofertas.removeAt(index);
  }

  salvar() {
    const formValue = this.form.value;
    if (!formValue.curso?.id) {
      void Swal.fire('Erro', 'O Curso selecionado não possui ID válido. Recarregue a página.', 'error');
      return;
    }

    const dto: EstruturaCurricularDTO = {
      ano: formValue.ano,
      codigo: formValue.codigo,
      ativo: formValue.ativo,
      cursoId: formValue.curso.id,
      ofertas: this.ofertas.value.map((o: any) => {
        if (!o.disciplina?.id) {
          throw new Error('Disciplina selecionada sem ID');
        }
        return {
          disciplinaId: o.disciplina.id,
          semestre: o.semestre,
          numProfessoresPratica: o.numProfessoresPratica,
          numProfessoresTeorica: o.numProfessoresTeorica,
          tutoria: o.tutoria
        };
      })
    };

    const uuid = this.form.get('uuid')?.value;
    const observer = {
      next: () => {
        Swal.fire({
          title: 'Sucesso!',
          text: `Estrutura Curricular ${this.isEdicao ? 'atualizada' : 'cadastrada'} com sucesso!`,
          icon: 'success',
          confirmButtonText: 'Ok',
          confirmButtonColor: '#1BC5BD'
        }).then((result) => {
          if (result.isConfirmed || result.isDismissed) {
            this.cancelar();
          }
        });
      },
      error: (err: any) => {
        console.error('Erro detalhado:', err);
        void Swal.fire('Erro', 'Ocorreu um erro ao salvar. Verifique o console.', 'error');
      }
    };

    if (this.isEdicao && uuid) {
      this.service.update(uuid, dto).subscribe(observer);
    } else {
      this.service.save(dto).subscribe(observer);
    }
  }

  cancelar() {
    void this.router.navigate(['/estrutura-curricular/visualizar']);
  }

  compararCursos(c1: any, c2: any): boolean {
    if (c1 && c2 && c1.id && c2.id) {
      return c1.id === c2.id;
    }
    return c1 && c2 ? c1.uuid === c2.uuid : c1 === c2;
  }

  compararDisciplinas(d1: any, d2: any): boolean {
    return d1 && d2 ? d1.uuid === d2.uuid : d1 === d2;
  }
}
