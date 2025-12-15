import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { EstruturaCurricularService } from "../../../../app-core/src/lib/services/estrutura-curricular-service";
import { CursoService } from "../../../../app-core/src/lib/services/curso-service";
import { DisciplinaService } from "../../../../app-core/src/lib/services/disciplina-service";

@Component({
  selector: 'app-cadastrar-estrutura',
  templateUrl: './cadastrar-estrutura.component.html',
  styleUrls: ['./cadastrar-estrutura.component.scss']
})
export class CadastrarEstruturaComponent implements OnInit {
  @Input() estruturaId?: number; // recebe id se for edição

  form: FormGroup;
  listaCursos: any[] = [];
  listaDisciplinas: any[] = [];

  mostrarModalPeriodo = false;
  indexOfertaEmEdicao = -1;
  periodoSelecionado: number | null = null;
  listaOpcoesSemestre = [1, 2, 3, 4, 5, 6, 7, 8];

  constructor(
    private fb: FormBuilder,
    private service: EstruturaCurricularService,
    private cursoService: CursoService,
    private disciplinaService: DisciplinaService
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

    if (this.estruturaId) {
      this.carregarEstrutura(this.estruturaId);
    }
  }

  /** Getter para facilitar acesso aos controles do form no template */
  get c() {
    return {
      codigo: this.form.get('codigo') as FormControl,
      ano: this.form.get('ano') as FormControl,
      idCurso: this.form.get('idCurso') as FormControl,
      ativo: this.form.get('ativo') as FormControl,
      ofertas: this.form.get('ofertas') as FormArray
    };
  }

  get ofertas(): FormArray {
    return this.form.get('ofertas') as FormArray;
  }

  carregarDependencias() {
    this.cursoService.findAll().subscribe(res => this.listaCursos = res);
    this.disciplinaService.findAll().subscribe(res => this.listaDisciplinas = res);
  }

  carregarEstrutura(id: number) {
    this.service.findById(id).subscribe((res: any) => {
      this.form.patchValue({
        id: res.id,
        codigo: res.codigo,
        ano: res.ano,
        idCurso: res.idCurso,
        ativo: res.ativo
      });
      this.carregarOfertas(res.ofertas);
    });
  }

  carregarOfertas(ofertas: any[]) {
    this.ofertas.clear();
    ofertas.forEach(oferta => {
      this.ofertas.push(this.fb.group({
        idDisciplina: [oferta.idDisciplina, Validators.required],
        periodos: [oferta.periodos || []]
      }));
    });
  }

  adicionarOferta() {
    this.ofertas.push(this.fb.group({
      idDisciplina: [null, Validators.required],
      periodos: [[]]
    }));
  }

  removerOferta(index: number) {
    this.ofertas.removeAt(index);
  }

  abrirModalPeriodo(index: number) {
    this.indexOfertaEmEdicao = index;
    this.periodoSelecionado = null;
    this.mostrarModalPeriodo = true;
  }

  fecharModalPeriodo() {
    this.mostrarModalPeriodo = false;
    this.indexOfertaEmEdicao = -1;
  }

  adicionarPeriodoNaOferta() {
    if (this.periodoSelecionado && this.indexOfertaEmEdicao !== -1) {
      const ofertaControl = this.ofertas.at(this.indexOfertaEmEdicao);
      const periodosAtuais: number[] = ofertaControl.get('periodos')?.value || [];
      if (periodosAtuais.includes(this.periodoSelecionado)) return;
      ofertaControl.get('periodos')?.setValue([...periodosAtuais, this.periodoSelecionado].sort((a,b)=>a-b));
      this.fecharModalPeriodo();
    }
  }

  removerPeriodoDeOferta(index: number, periodo: number) {
    const ofertaControl = this.ofertas.at(index);
    const periodosAtuais: number[] = ofertaControl.get('periodos')?.value || [];
    ofertaControl.get('periodos')?.setValue(periodosAtuais.filter(p => p !== periodo));
  }

  salvar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const dto = this.form.value;
    dto.ano = dto.ano.toString();

    this.service.save(dto).subscribe({
      next: () => alert('Estrutura Curricular salva com sucesso!'),
      error: err => {
        console.error(err);
        alert('Erro ao salvar a estrutura curricular.');
      }
    });
  }
}
