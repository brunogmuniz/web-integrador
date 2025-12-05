import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { EstruturaCurricularService } from 'projects/shared-core/src/lib/services/estrutura-curricular-service';
import { CursoService } from 'projects/shared-core/src/lib/services/curso-service';
import { SubareaConhecimentoService} from 'shared-core/src/lib/services/subarea-conhecimento-service';

@Component({
  standalone: true,
  selector: 'app-estrutura-curricular',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './estrutura-curricular.html',
  styleUrls: ['./estrutura-curricular.scss']
})
export class EstruturaCurricularComponent implements OnInit {

  form: FormGroup;

  listaCursos: any[] = [];
  listaSubareas: any[] = [];
  listaTiposDisciplina = ['OBRIGATORIA', 'OPTATIVA', 'ELETIVA'];

  listaEstruturas: any[] = [];
  paginaAtual: number = 0;
  tamanhoPagina: number = 10;
  totalElementos: number = 0;

  mostrarModalPeriodo: boolean = false;
  indexOfertaEmEdicao: number = -1;
  periodoSelecionado: number | null = null;
  listaOpcoesSemestre = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  constructor(
    private fb: FormBuilder,
    private service: EstruturaCurricularService,
    private cursoService: CursoService,
    private subareaService: SubareaConhecimentoService
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
    this.carregarEstruturas();
  }

  get ofertas(): FormArray {
    return this.form.get('ofertas') as FormArray;
  }

  carregarDependencias() {
    this.cursoService.findAll().subscribe((res: any) => this.listaCursos = res.content || res);
    this.subareaService.findAll().subscribe((res: any) => this.listaSubareas = res.content || res);
  }

  adicionarOferta() {
    const ofertaGroup = this.fb.group({
      id: [null],
      nome: ['', Validators.required],
      codigoDisciplina: ['', Validators.required],
      cargaHoraria: ['', Validators.required],
      tipoDisciplina: ['OBRIGATORIA', Validators.required],
      idSubarea: [null, Validators.required],
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

  adicionarPeriodoNaOferta() {
    if (this.periodoSelecionado && this.indexOfertaEmEdicao !== -1) {
      const ofertaControl = this.ofertas.at(this.indexOfertaEmEdicao);
      const periodosAtuais: number[] = ofertaControl.get('periodos')?.value || [];

      if (periodosAtuais.includes(this.periodoSelecionado)) {
        alert('Este semestre já foi adicionado para esta disciplina.');
        return;
      }

      const novosPeriodos = [...periodosAtuais, this.periodoSelecionado].sort((a, b) => a - b);
      ofertaControl.get('periodos')?.setValue(novosPeriodos);

      this.fecharModalPeriodo();
    }
  }

  removerPeriodoDeOferta(indexOferta: number, periodo: number) {
    const ofertaControl = this.ofertas.at(indexOferta);
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

    if (dto.id) {
      this.service.update(dto.id, dto).subscribe({
        next: () => {
          alert('Atualizado com sucesso!');
          this.carregarEstruturas();
        },
        error: err => console.error(err)
      });
    } else {
      this.service.save(dto).subscribe({
        next: () => {
          alert('Salvo com sucesso!');
          this.carregarEstruturas();
          this.form.reset({ ativo: true });
          this.form.setControl('ofertas', this.fb.array([]));
        },
        error: err => console.error(err)
      });
    }
  }

  carregarEstruturas() {
    this.service.findAll(this.paginaAtual, this.tamanhoPagina).subscribe(res => {
      this.listaEstruturas = res.content;
      this.totalElementos = res.totalElements;
    });
  }
}
