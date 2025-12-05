import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { EstruturaCurricularService } from 'projects/shared-core/src/lib/services/estrutura-curricular-service';
import { CursoService } from 'projects/shared-core/src/lib/services/curso-service';
import { SubareaConhecimentoService } from 'shared-core/src/lib/services/subarea-conhecimento-service';

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
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const formValue = this.form.value;

    const dto = {
      ...formValue,
      ano: formValue.ano.toString(),
      ofertas: formValue.ofertas.map((oferta: any) => ({
        id: oferta.id,
        nome: oferta.nome,
        codigoDisciplina: oferta.codigoDisciplina,
        cargaHoraria: oferta.cargaHoraria,
        tipoDisciplina: oferta.tipoDisciplina,
        idSubarea: oferta.idSubarea,

        semestre: oferta.periodos ? oferta.periodos.map((p: number) => p.toString()) : [],

        periodos: oferta.periodos ? oferta.periodos.length : 0
      }))
    };

    console.log('Enviando DTO:', dto);

    if (dto.id) {
      this.service.update(dto.id, dto).subscribe({
        next: () => {
          alert('Estrutura Curricular atualizada com sucesso!');
          this.carregarEstruturas();
        },
        error: err => {
          console.error('Erro ao atualizar:', err);
          alert('Erro ao atualizar. Verifique o console.');
        }
      });
    } else {
      this.service.save(dto).subscribe({
        next: () => {
          alert('Estrutura Curricular cadastrada com sucesso!');
          this.carregarEstruturas();

          this.form.reset({ ativo: true });
          this.form.setControl('ofertas', this.fb.array([]));
        },
        error: err => {
          console.error('Erro ao salvar:', err);
          alert('Erro ao salvar. Verifique o console.');
        }
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
