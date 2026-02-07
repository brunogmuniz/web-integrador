import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {EstruturaCurricularService} from "app-core";
import {CursoService} from "app-core";
import {DisciplinaService} from "app-core";
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
      uuid: [null],
      codigo: ['', Validators.required],
      ano: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
      uuidCurso: [null, Validators.required],
      ativo: [true],
      ofertas: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.carregarDependencias();

    const uuid = this.route.snapshot.paramMap.get('id');
    if (uuid) {
      this.isEdicao = true;
      this.carregarEstrutura(String(uuid));
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

  carregarEstrutura(uuid: string) {
    this.service.findById(uuid).subscribe({
      next: (res) => {
        this.form.patchValue({
          uuid: res.uuid,
          codigo: res.codigo,
          ano: res.ano,
          uuidCurso: res.uuidCurso,
          ativo: res.ativo
        });

        if (res.ofertas && res.ofertas.length > 0) {
          this.ofertas.clear();
          res.ofertas.forEach(oferta => {
            this.adicionarOfertaComDados(oferta);
          });
        }
      },
      error: (err) => {
        console.error();
        void Swal.fire('Erro', 'Não foi possível carregar a estrutura.', 'error');
        this.cancelar();
      }
    });
  }

  get ofertas(): FormArray {
    return this.form.get('ofertas') as FormArray;
  }

  adicionarOferta() {
    this.adicionarOfertaComDados(null);
  }

  adicionarOfertaComDados(dados: any | null) {
    const ofertaGroup = this.fb.group({
      uuidDisciplina: [dados ? (dados.uuidDisciplina || dados.idDisciplina) : null, Validators.required],
      semestre: [dados ? dados.semestre : null, Validators.required],
      numProfessoresPratica: [dados ? dados.numProfessoresPratica : 1],
      numProfessoresTeorica: [dados ? dados.numProfessoresTeorica : 1],
      tutoria: [dados ? dados.tutoria : false]
    });
    this.ofertas.push(ofertaGroup);
  }

  removerOferta(index: number) {
    this.ofertas.removeAt(index);
  }

  trackByCursoUuid(item: any) {
    return item.uuid;
  }

  trackByDisciplinaUuid(item: any) {
    return item.uuid;
  }

  salvar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      void Swal.fire('Atenção', 'Preencha todos os campos obrigatórios.', 'warning');
      return;
    }

    const payload = this.form.getRawValue();
    const dto = {
      uuid: payload.uuid,
      codigo: payload.codigo,
      ano: payload.ano.toString(),
      uuidCurso: payload.uuidCurso,
      ativo: payload.ativo,
      ofertas: payload.ofertas.map((o: any) => ({
        uuidDisciplina: o.uuidDisciplina,
        semestre: o.semestre,
        numProfessoresPratica: o.numProfessoresPratica,
        numProfessoresTeorica: o.numProfessoresTeorica,
        tutoria: o.tutoria
      }))
    };

    if (this.isEdicao && dto.uuid) {
      this.service.update(dto.uuid, dto).subscribe({
        next: () => {
          void Swal.fire('Sucesso', 'Estrutura atualizada!', 'success')
            .then(() => this.router.navigate(['/estrutura-curricular/visualizar']));
        },
        error: (err) => {
          console.error();
          void Swal.fire('Erro', 'Erro ao atualizar. Verifique o console.', 'error');
        }
      });
    } else {
      this.service.save(dto).subscribe({
        next: () => {
          void Swal.fire('Sucesso', 'Estrutura cadastrada!', 'success')
            .then(() => this.router.navigate(['/estrutura-curricular/visualizar']));
        },
        error: (err) => {
          console.error();
          void Swal.fire('Erro', 'Erro ao salvar. Verifique o console.', 'error');
        }
      });
    }
  }

  cancelar() {
    void this.router.navigate(['/estrutura-curricular/visualizar']);
  }
}
