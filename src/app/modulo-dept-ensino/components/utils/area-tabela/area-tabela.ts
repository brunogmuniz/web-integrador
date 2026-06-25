import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AreaMediaDTO } from 'app-core/lib/dto/areaMedia.dto';

interface ColunaOfertaTabela {
  ano: string;
  semestre: string;
  key: string;
}

interface AreaTabelaViewModel {
  uuid: string;
  nomeOriginal: string;
  codigo: string;
  media: number | string;
  nrDocentes: number | string;
  subareas: AreaTabelaViewModel[];
  [key: string]: string | number | AreaTabelaViewModel[];
}

@Component({
  selector: 'app-area-tabela',
  templateUrl: './area-tabela.html',
  styleUrls: ['./area-tabela.css']
})
export class AreaTabelaComponent implements OnChanges {
  @Input() dados!: AreaMediaDTO | AreaMediaDTO[];

  private _inputBusca: string = '';
  private dadosAdaptadosCache: AreaTabelaViewModel[] = [];

  dadosFiltrados: AreaTabelaViewModel[] = [];
  colunasOfertas: ColunaOfertaTabela[] = [];

  get inputBusca(): string {
    return this._inputBusca;
  }

  set inputBusca(value: string) {
    this._inputBusca = value;
    this.aplicarFiltro();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dados'] && this.dados) {
      const dadosArray = Array.isArray(this.dados) ? this.dados : [this.dados];
      this.colunasOfertas = this.extrairColunasOfertas(dadosArray);
      this.dadosAdaptadosCache = dadosArray.map(item => this.adaptarParaTabelaVisual(item));
      this.aplicarFiltro();
    }
  }

  private aplicarFiltro(): void {
    const termo = this._inputBusca.toLowerCase().trim();
    this.dadosFiltrados = !termo
      ? [...this.dadosAdaptadosCache]
      : this.dadosAdaptadosCache.filter(item =>
        item.nomeOriginal.toLowerCase().includes(termo) ||
        item.codigo.toLowerCase().includes(termo)
      );
  }

  private adaptarParaTabelaVisual(dto: AreaMediaDTO): AreaTabelaViewModel {
    const adaptado: AreaTabelaViewModel = {
      uuid: (dto as AreaMediaDTO & { uuid?: string }).uuid || '',
      nomeOriginal: dto.nome || '',
      codigo: dto.codigo || '-',
      media: dto.mediaFinal != null ? dto.mediaFinal : '-',
      nrDocentes: this.formatarNumero(dto.capacidadeDocenteReferencia),
      subareas: dto.subareas?.map(sub => this.adaptarParaTabelaVisual(sub)) || []
    };

    dto.listaAnoSemestre?.forEach(projecao => {
      if (projecao.ano && projecao.semestre) {
        const key = this.criarChaveColuna(projecao.ano, projecao.semestre);
        adaptado[key] = projecao.cargaHoraria !== null && projecao.cargaHoraria !== undefined
          ? Number(projecao.cargaHoraria).toFixed(2)
          : '-';
      }
    });

    return adaptado;
  }

  private extrairColunasOfertas(dados: AreaMediaDTO[]): ColunaOfertaTabela[] {
    const mapa = new Map<string, ColunaOfertaTabela>();

    const visitar = (item: AreaMediaDTO): void => {
      item.listaAnoSemestre?.forEach(projecao => {
        if (projecao.ano && projecao.semestre) {
          const key = this.criarChaveColuna(projecao.ano, projecao.semestre);
          mapa.set(key, { ano: projecao.ano, semestre: projecao.semestre, key });
        }
      });
      item.subareas?.forEach(visitar);
    };

    dados.forEach(visitar);
    return Array.from(mapa.values()).sort((a, b) => {
      const anoDiff = Number(a.ano) - Number(b.ano);
      if (anoDiff !== 0) {
        return anoDiff;
      }
      return Number(a.semestre) - Number(b.semestre);
    });
  }

  private criarChaveColuna(ano: string, semestre: string): string {
    return `ano${ano}s${semestre}`;
  }

  private formatarNumero(valor: number | null | undefined): string {
    return valor !== null && valor !== undefined ? Number(valor).toFixed(2) : '-';
  }
}
