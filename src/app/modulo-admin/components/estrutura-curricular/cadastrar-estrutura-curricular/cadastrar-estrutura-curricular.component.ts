import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { EstruturaCurricularService, CursoService, DisciplinaService, EstruturaCurricularDto } from "app-core";
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
      error: (err) => Swal.fire('Erro', 'Não foi possível carregar a estrutura.', 'error')
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

  private extrairUuid(valor: any): string | null {
    if (!valor) return null;
    if (typeof valor === 'string') return valor;
    if (typeof valor === 'object' && valor.uuid) return valor.uuid;
    return null;
  }

  salvar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      void Swal.fire('Atenção', 'Verifique os campos obrigatórios.', 'warning');
      return;
    }

    const raw = this.form.getRawValue();
    const cursoUuid = this.extrairUuid(raw.curso);

    if (!cursoUuid) {
      void Swal.fire('Atenção', 'Selecione um curso válido.', 'warning');
      return;
    }

    // Monta DTO
    const dto: EstruturaCurricularDto = {
      uuid: raw.uuid,
      codigo: raw.codigo,
      ano: raw.ano.toString(),
      cursoUuid: cursoUuid,
      ativo: !!raw.ativo,
      ofertas: raw.ofertas.map((o: any) => {
        const discUuid = this.extrairUuid(o.disciplina);
        if (!discUuid) {
          console.error("Disciplina sem UUID:", o.disciplina);
        }
        return {
          disciplinaUuid: discUuid || '',
          semestre: Number(o.semestre),
          numProfessoresPratica: Number(o.numProfessoresPratica),
          numProfessoresTeorica: Number(o.numProfessoresTeorica),
          tutoria: !!o.tutoria,
          ead: false
        };
      })
    };

    if (dto.ofertas.some(o => !o.disciplinaUuid)) {
      void Swal.fire('Erro', 'Existem disciplinas inválidas selecionadas.', 'error');
      return;
    }

    const request = (this.isEdicao && dto.uuid)
      ? this.service.update(dto.uuid, dto)
      : this.service.save(dto);

    request.subscribe({
      next: () => {
        void Swal.fire('Sucesso', 'Estrutura curricular salva!', 'success')
          .then(() => this.router.navigate(['/estrutura-curricular/visualizar']));
      },
      error: (err) => {
        console.error(err);
        void Swal.fire('Erro', err.error?.message || 'Erro ao salvar dados.', 'error');
      }
    });
  }

  cancelar() {
    void this.router.navigate(['/estrutura-curricular/visualizar']);
  }

  compararCursos(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.uuid === c2.uuid : c1 === c2;
  }

  compararDisciplinas(d1: any, d2: any): boolean {
    return d1 && d2 ? d1.uuid === d2.uuid : d1 === d2;
  }
}
