import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {EstruturaCurricularService} from "../../../../app-core/src/lib/services/estrutura-curricular-service";
import {CursoService} from "../../../../app-core/src/lib/services/curso-service";
import {DisciplinaService} from "../../../../app-core/src/lib/services/disciplina-service";
import {ActivatedRoute, Router} from "@angular/router";
import Swal from "sweetalert2";
import {OfertaDisciplinaDto} from "../../../../app-core/src/lib/dto/EstruturaCurricular.dto";

@Component({
  selector: 'app-editar-estrutura-curricular',
  templateUrl: './editar-estrutura-curricular.component.html',
  styleUrls: ['../estrutura-curricular.component.scss']
})
export class EditarEstruturaCurricularComponent implements OnInit {

  form: FormGroup;
  listaCursos: any[] = [];
  listaDisciplinas: any[] = [];
  listaOpcoesSemestre = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  estruturaId!: number;

  constructor(
    private fb: FormBuilder,
    private service: EstruturaCurricularService,
    private cursoService: CursoService,
    private disciplinaService: DisciplinaService,
    private route: ActivatedRoute,
    protected router: Router
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

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.estruturaId = +id;
      this.carregarEstrutura(this.estruturaId);
    } else {
      void Swal.fire('Erro', 'ID da estrutura não fornecido.', 'error');
      void this.router.navigate(['/estrutura-curricular/visualizar']);
    }
  }

  carregarDependencias() {
    this.cursoService.findAll().subscribe((res: any) => {
      this.listaCursos = res.content || res;
    });

    this.disciplinaService.findAll().subscribe((res: any) => {
      this.listaDisciplinas = res.content || res;
    });
  }

  carregarEstrutura(id: number) {
    this.service.findById(id).subscribe({
      next: (dto) => {
        this.form.patchValue(dto);
        this.ofertas.clear();
        (dto.ofertas || []).forEach(oferta => this.adicionarOfertaComDados(oferta));
      },
      error: (err) => {
        console.error('Erro ao carregar estrutura curricular', err);
        void Swal.fire('Erro', 'Não foi possível carregar os dados da estrutura.', 'error');
        void this.router.navigate(['/estrutura-curricular/visualizar']);
      }
    });
  }

  get ofertas(): FormArray {
    return this.form.get('ofertas') as FormArray;
  }

  adicionarOferta() {
    this.ofertas.push(this.criarOfertaFormGroup());
  }

  adicionarOfertaComDados(oferta: OfertaDisciplinaDto) {
    this.ofertas.push(this.criarOfertaFormGroup(oferta));
  }

  private criarOfertaFormGroup(oferta?: OfertaDisciplinaDto) {
    return this.fb.group({
      idDisciplina: [oferta?.idDisciplina || null, Validators.required],
      semestre: [oferta?.semestre || null, Validators.required],
      tutoria: [oferta?.tutoria || false],
      ead: [oferta?.ead || false],
      numProfessoresPratica: [oferta?.numProfessoresPratica || 1],
      numProfessoresTeorica: [oferta?.numProfessoresTeorica || 1]
    });
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
      return;
    }

    const dto = this.form.value;
    dto.ano = dto.ano.toString();

    this.service.update(this.estruturaId, dto).subscribe({
      next: () => {
        void Swal.fire('Sucesso', 'Estrutura Curricular atualizada com sucesso!', 'success');
        void this.router.navigate(['/estrutura-curricular/visualizar']);
      },
      error: (err) => {
        console.error(err);
        void Swal.fire('Erro', 'Erro ao atualizar.', 'error');
      }
    });
  }
  cancelar() {
    void this.router.navigate(['/estrutura-curricular/visualizar']);
  }
}
