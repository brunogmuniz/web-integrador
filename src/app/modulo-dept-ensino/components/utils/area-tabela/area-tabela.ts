import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AreaMediaDTO } from 'app-core/lib/dto/areaMedia.dto';

@Component({
  selector: 'app-area-tabela',
  templateUrl: './area-tabela.html',
  styleUrls: ['./area-tabela.css']
})
export class AreaTabelaComponent implements OnChanges {
  @Input() dados!: AreaMediaDTO | AreaMediaDTO[];

  private _inputBusca: string = '';
  get inputBusca(): string { return this._inputBusca; }
  set inputBusca(value: string) {
    this._inputBusca = value;
    this.aplicarFiltro();
  }

  private dadosAdaptadosCache: any[] = [];
  dadosFiltrados: any[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dados'] && this.dados) {
      const dadosArray = Array.isArray(this.dados) ? this.dados : [this.dados];
      this.dadosAdaptadosCache = dadosArray.map(item => this.adaptarParaTabelaVisual(item));
      this.aplicarFiltro();
    }
  }

  private aplicarFiltro(): void {
    const termo = this._inputBusca.toLowerCase().trim();
    this.dadosFiltrados = !termo
      ? [...this.dadosAdaptadosCache]
      : this.dadosAdaptadosCache.filter(item =>
        item.nomeOriginal?.toLowerCase().includes(termo) ||
        item.codigo?.toLowerCase().includes(termo)
      );
  }

  private adaptarParaTabelaVisual(dto: AreaMediaDTO): any {
    const adaptado: any = {
      uuid: (dto as any).uuid || '',
      nomeOriginal: dto.nome || '',
      codigo: dto.codigo || '-',
      media: dto.mediaFinal != null ? dto.mediaFinal : '-',
      nrDocentes: dto.capacidadeDocenteReferencia != null ? dto.capacidadeDocenteReferencia : '-',
      subareas: dto.subareas?.map(sub => this.adaptarParaTabelaVisual(sub)) || []
    };

    if (dto.listaAnoSemestre && Array.isArray(dto.listaAnoSemestre)) {
      dto.listaAnoSemestre.forEach(projecao => {
        if (projecao.ano && projecao.semestre) {
          const key = `ano${projecao.ano}s${projecao.semestre}`;
          adaptado[key] = (projecao.demandaDocente !== null)
            ? Number(projecao.demandaDocente).toFixed(2)
            : '-';
        }
      });
    }
    return adaptado;
  }
}
