import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {EstruturaCurricularService} from "../../../../app-core/src/lib/services/estrutura-curricular-service";
import {CursoService} from "../../../../app-core/src/lib/services/curso-service";
import {DisciplinaService} from "../../../../app-core/src/lib/services/disciplina-service";
import {Router} from "@angular/router";
import Swal from "sweetalert2";

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

  constructor(
    private fb: FormBuilder,
    private service: EstruturaCurricularService,
    private cursoService: CursoService,
    private disciplinaService: DisciplinaService,
    private router: Router
  ) {
    this.form = this.fb.group({
      id: [null],
      codigo: ['', Validators.required],
      ano: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
      idCurso: [null, Validators.required],
      ativo: [true],
      ofertas: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.carregarDependencias();
  }

  carregarDependencias() {
    this.cursoService.findAll().subscribe((res: any) => {
      this.listaCursos = res.content || res;
    });

    this.disciplinaService.findAll().subscribe((res: any) => {
      this.listaDisciplinas = res.content || res;
    });
  }

  get ofertas(): FormArray {
    return this.form.get('ofertas') as FormArray;
  }

  adicionarOferta() {
    const ofertaGroup = this.fb.group({
      idDisciplina: [null, Validators.required],
      semestre: [null, Validators.required],
      numProfessoresPratica: [1],
      numProfessoresTeorica: [1],
      tutoria: [false]
    });
    this.ofertas.push(ofertaGroup);
  }

  removerOferta(index: number) {
    this.ofertas.removeAt(index);
  }

  trackByCursoId(item: any) {
    return item.id;
  }

  trackByDisciplinaId(item: any) {
    return item.id;
  }

  salvar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      void Swal.fire('Atenção', 'Preencha todos os campos obrigatórios e adicione disciplinas.', 'warning');
      return;
    }

    const dto = this.form.value;
    dto.ano = dto.ano.toString();

    this.service.save(dto).subscribe({
      next: () => {
        void Swal.fire('Sucesso', 'Estrutura Curricular cadastrada com sucesso!', 'success').then(() => {
          void this.router.navigate(['/estrutura-curricular/visualizar']);
        });
      },
      error: (err) => {
        console.error(err);
        void Swal.fire('Erro', 'Erro ao salvar.', 'error');
      }
    });
  }

  cancelar() {
    void this.router.navigate(['/estrutura-curricular/visualizar']);
  }
}
