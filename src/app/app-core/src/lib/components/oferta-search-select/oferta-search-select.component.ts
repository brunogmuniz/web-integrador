import { Component, EventEmitter, HostListener, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Subject, of } from 'rxjs';
import { catchError, debounceTime, finalize, map, switchMap, takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { OfertaDTO } from '../../dto/Oferta.dto';
import { OfertaService } from '../../services/oferta-service';

@Component({
  selector: 'app-oferta-search-select',
  templateUrl: './oferta-search-select.component.html',
  styleUrls: ['./oferta-search-select.component.scss']
})
export class OfertaSearchSelectComponent implements OnInit, OnDestroy, OnChanges {
  @Input() label = 'Oferta';
  @Input() placeholder = 'Buscar ou selecionar oferta...';
  @Input() disabled = false;
  @Input() required = false;
  @Input() ofertasExcluidas: Array<string | null | undefined> = [];
  @Input() limparToken = 0;
  @Output() ofertaSelecionada = new EventEmitter<OfertaDTO | null>();

  busca = '';
  comboAberto = false;
  carregando = false;
  ofertas: OfertaDTO[] = [];

  private ofertaSelecionadaUuid = '';
  private ultimoTermo: string | null = null;
  private readonly buscaSubject = new Subject<string>();
  private readonly destroySubject = new Subject<void>();

  constructor(private ofertaService: OfertaService) {}

  ngOnInit(): void {
    this.configurarBusca();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['limparToken'] && !changes['limparToken'].firstChange) {
      this.limpar();
    }
  }

  ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
  }

  @HostListener('document:click')
  fecharAoClicarFora(): void {
    this.comboAberto = false;
  }

  get ofertasDisponiveis(): OfertaDTO[] {
    const excluidas = new Set(this.ofertasExcluidas.filter((uuid): uuid is string => !!uuid));
    return this.ofertas.filter(oferta => oferta.uuid && !excluidas.has(oferta.uuid));
  }

  aoDigitar(termo: string): void {
    this.ofertaSelecionadaUuid = '';
    this.ofertaSelecionada.emit(null);
    this.comboAberto = true;
    this.buscarOfertas(termo);
  }

  abrirCombo(): void {
    if (this.disabled) {
      return;
    }

    this.comboAberto = true;
    this.buscarOfertas(this.busca);
  }

  selecionarOferta(oferta: OfertaDTO): void {
    if (!oferta.uuid) {
      return;
    }

    this.ofertaSelecionadaUuid = oferta.uuid;
    this.busca = this.formatarOferta(oferta);
    this.comboAberto = false;
    this.ofertaSelecionada.emit(oferta);
  }

  private buscarOfertas(termo: string = '', forcar: boolean = false): void {
    const termoTratado = termo.trim();
    if (!forcar && this.ofertas.length > 0 && termoTratado === this.ultimoTermo) {
      return;
    }

    this.buscaSubject.next(termoTratado);
  }

  private configurarBusca(): void {
    this.buscaSubject.pipe(
      debounceTime(300),
      switchMap(termo => {
        this.carregando = true;
        return this.ofertaService.buscarParaSelecao(termo).pipe(
          map(ofertas => ({ termo, ofertas })),
          catchError(() => {
            this.ofertas = [];
            this.ofertaSelecionadaUuid = '';
            this.ofertaSelecionada.emit(null);
            void Swal.fire('Erro', 'Não foi possível carregar as ofertas para seleção.', 'error');
            return of({ termo, ofertas: [] });
          }),
          finalize(() => this.carregando = false)
        );
      }),
      takeUntil(this.destroySubject)
    ).subscribe(resultado => {
      this.ofertas = this.ordenarOfertas(resultado.ofertas || []);
      this.ultimoTermo = resultado.termo;
    });
  }

  private limpar(): void {
    this.busca = '';
    this.ofertaSelecionadaUuid = '';
    this.comboAberto = false;
    this.ultimoTermo = null;
    this.ofertas = [];
    this.ofertaSelecionada.emit(null);
  }

  private ordenarOfertas(ofertas: OfertaDTO[]): OfertaDTO[] {
    return [...ofertas].sort((a, b) => {
      const anoDiff = Number.parseInt(b.ano, 10) - Number.parseInt(a.ano, 10);
      if (anoDiff !== 0) {
        return anoDiff;
      }
      return Number.parseInt(b.semestre, 10) - Number.parseInt(a.semestre, 10);
    });
  }

  private formatarOferta(oferta: OfertaDTO): string {
    return `${oferta.ano}/${oferta.semestre}`;
  }
}
