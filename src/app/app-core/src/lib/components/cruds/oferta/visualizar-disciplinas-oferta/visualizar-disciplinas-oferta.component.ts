import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CursoOfertaDisciplinasDTO, OfertaDisciplinasResumoDTO, OfertaService } from 'app-core';

const DISCIPLINA_OFERTA_EDICAO_CONTEXTO_KEY = 'disciplinaOfertaEdicaoContexto';

@Component({
  selector: 'app-visualizar-disciplinas-oferta',
  templateUrl: './visualizar-disciplinas-oferta.component.html',
  styleUrls: ['../oferta.component.scss']
})
export class VisualizarDisciplinasOfertaComponent implements OnInit {
  public oferta?: OfertaDisciplinasResumoDTO;
  public cursosAbertos = new Set<string>();
  public loading = false;
  public busca = '';
  private uuidOferta?: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ofertaService: OfertaService
  ) {}

  ngOnInit(): void {
    const uuid = this.route.snapshot.paramMap.get('uuid');

    if (!uuid) {
      void Swal.fire('Erro', 'Oferta não informada.', 'error').then(() => this.voltar());
      return;
    }

    this.uuidOferta = uuid;
    this.carregarDisciplinasOferta(uuid);
  }

  public carregarDisciplinasOferta(uuid: string): void {
    this.loading = true;

    this.ofertaService.listarDisciplinasOferta(uuid, this.busca).subscribe({
      next: oferta => {
        this.oferta = oferta;
        this.cursosAbertos = new Set((oferta.cursos || []).slice(0, 1).map(curso => this.getChaveCurso(curso)));
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        void Swal.fire('Erro', 'Não foi possível carregar as disciplinas ofertadas.', 'error');
      }
    });
  }

  public aoBuscar(termo: string): void {
    if (!this.uuidOferta) return;

    this.busca = termo;
    this.carregarDisciplinasOferta(this.uuidOferta);
  }

  public deveExibirBusca(): boolean {
    return !!this.busca || !!this.oferta?.cursos?.length;
  }

  public alternarCurso(curso: CursoOfertaDisciplinasDTO): void {
    const chave = this.getChaveCurso(curso);

    if (this.cursosAbertos.has(chave)) {
      this.cursosAbertos.delete(chave);
      return;
    }

    this.cursosAbertos.add(chave);
  }

  public cursoAberto(curso: CursoOfertaDisciplinasDTO): boolean {
    return this.cursosAbertos.has(this.getChaveCurso(curso));
  }

  public voltar(): void {
    void this.router.navigate(['/oferta/visualizar']);
  }

  public editarCursoCurriculo(curso: CursoOfertaDisciplinasDTO): void {
    if (!this.oferta?.uuidOferta) return;

    sessionStorage.setItem(DISCIPLINA_OFERTA_EDICAO_CONTEXTO_KEY, JSON.stringify({
      uuidOferta: this.oferta.uuidOferta,
      uuidCurso: curso.uuidCurso,
      uuidEstruturaCurricular: curso.uuidEstruturaCurricular
    }));

    void this.router.navigate(['/disciplina-oferta/form/editar', this.oferta.uuidOferta]);
  }

  public trackByCurso(_index: number, curso: CursoOfertaDisciplinasDTO): string {
    return `${curso.uuidCurso}-${curso.uuidEstruturaCurricular}`;
  }

  private getChaveCurso(curso: CursoOfertaDisciplinasDTO): string {
    return `${curso.uuidCurso}-${curso.uuidEstruturaCurricular}`;
  }
}
