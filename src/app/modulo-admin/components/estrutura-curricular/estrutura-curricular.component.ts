import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {EstruturaCurricularService} from "../../../app-core/src/lib/services/estrutura-curricular-service";
import {CursoService} from "../../../app-core/src/lib/services/curso-service";
import {DisciplinaService} from "../../../app-core/src/lib/services/disciplina-service";

@Component({
  selector: 'app-estrutura-curricular',
  templateUrl: './estrutura-curricular.component.html',
  styleUrls: ['./estrutura-curricular.component.scss']
})
export class EstruturaCurricularComponent implements OnInit {

  form: FormGroup;
  listaCursos: any[] = [];
  listaDisciplinas: any[] = [];

  mostrarModalPeriodo: boolean = false;
  indexOfertaEmEdicao: number = -1;
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
  }
  carregarOfertas(ofertas: any[]) {
    this.ofertas.clear(); // limpa ofertas atuais

    ofertas.forEach(oferta => {
      const ofertaGroup = this.fb.group({
        idDisciplina: [oferta.idDisciplina, Validators.required],
        periodos: [oferta.periodos || []]
      });

      this.ofertas.push(ofertaGroup);
    });
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
      periodos: [[]]
    });
    this.ofertas.push(ofertaGroup);
  }

  removerOferta(index: number) {
    this.ofertas.removeAt(index);
  }

  abrirModalPeriodo(indexOferta: number) {
    this.indexOfertaEmEdicao = indexOferta;
    this.periodoSelecionado = null;
    this.mostrarModalPeriodo = true;
  }

  fecharModalPeriodo() {
    this.mostrarModalPeriodo = false;
    this.indexOfertaEmEdicao = -1;
  }
  trackByCursoId(index: number, item: any) {
    return item.id;
  }

  trackByDisciplinaId(index: number, item: any) {
    return item.id;
  }

  trackByNumero(index: number, item: any) {
    return item;
  }


  adicionarPeriodoNaOferta() {
    if (this.periodoSelecionado && this.indexOfertaEmEdicao !== -1) {
      const ofertaControl = this.ofertas.at(this.indexOfertaEmEdicao);
      const periodosAtuais: number[] = ofertaControl.get('periodos')?.value || [];

      if (periodosAtuais.includes(this.periodoSelecionado)) {
        alert('Este semestre já foi adicionado para esta disciplina.');
        return;
      }

      const novosPeriodos = [...periodosAtuais, this.periodoSelecionado];
      novosPeriodos.sort((a, b) => a - b);

      ofertaControl.get('periodos')?.setValue(novosPeriodos);

      this.fecharModalPeriodo();
    }
  }

  removerPeriodoDeOferta(indexOferta: number, periodo: number) {
    const ofertaControl = this.ofertas.at(indexOferta);
    const periodosAtuais: number[] = ofertaControl.get('periodos')?.value || [];

    const novosPeriodos = periodosAtuais.filter(p => p !== periodo);
    ofertaControl.get('periodos')?.setValue(novosPeriodos);
  }

  salvar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const dto = this.form.value;
    dto.ano = dto.ano.toString();

    this.service.save(dto).subscribe({
      next: (res) => {
        alert('Estrutura Curricular cadastrada com sucesso!');
      },
      error: (err) => {
        console.error(err);
        alert('Erro ao salvar.');
      }
    });
  }
}
