import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { TiposUnidade, UnidadeDTO, UnidadeTreeNode } from '../../../../dto/Unidade.dto';
import { UnidadeService } from '../../../../services/unidade.service';

@Component({
  selector: 'lib-visualizar-unidade',
  templateUrl: './visualizar-unidade.component.html',
  styleUrls: ['./visualizar-unidade.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class VisualizarUnidadeComponent implements OnInit {
  public unidadesRaiz: UnidadeTreeNode[] = [];
  public errorMessage = '';
  public isCarregando = true;
  public expandedUuids: Set<string> = new Set();
  public unidadeEmAtualizacaoUuid: string | null = null;

  constructor(private readonly unidadeService: UnidadeService) {}

  ngOnInit(): void {
    this.carregarUnidades();
  }

  public carregarUnidades(): void {
    this.isCarregando = true;
    this.errorMessage = '';

    this.unidadeService.listar().subscribe({
      next: (unidadesPlanas: UnidadeDTO[]) => {
        this.unidadesRaiz = this.montarArvore(unidadesPlanas);
        this.expandedUuids = new Set();
        this.isCarregando = false;
      },
      error: (error: Error) => {
        this.errorMessage = `Nao foi possivel carregar as unidades: ${error.message}`;
        this.isCarregando = false;
      }
    });
  }

  public alternarExpansao(unidade: UnidadeTreeNode): void {
    if (!unidade.subunidades?.length) {
      return;
    }

    if (this.expandedUuids.has(unidade.uuid)) {
      this.expandedUuids.delete(unidade.uuid);
    } else {
      this.expandedUuids.add(unidade.uuid);
    }

    this.expandedUuids = new Set(this.expandedUuids);
  }

  public confirmarExclusao(uuid: string, nome: string): void {
    const unidade = this.encontrarNaArvore(uuid, this.unidadesRaiz);
    const possuiSubunidades = !!unidade?.subunidades?.length;

    if (possuiSubunidades) {
      void Swal.fire(
        'Exclusão bloqueada',
        `A unidade "${nome}" possui subunidades vinculadas. Realoque ou remova as subunidades antes de excluir a unidade pai.`,
        'warning'
      );
      return;
    }

    Swal.fire({
      title: 'Tem certeza?',
      text: `A unidade "${nome}" será removida.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      this.isCarregando = true;
      this.unidadeService.excluir(uuid).subscribe({
        next: () => {
          void Swal.fire('Sucesso!', 'Unidade removida com sucesso.', 'success');
          this.carregarUnidades();
        },
        error: (error: Error) => {
          this.errorMessage = error.message;
          this.isCarregando = false;
          void Swal.fire('Erro!', error.message, 'error');
        }
      });
    });
  }

  public confirmarStatus(unid: UnidadeTreeNode, ativar: boolean): void {
    const acao = ativar ? 'ativar' : 'inativar';
    const possuiSubunidades = !!unid.subunidades?.length;
    const texto = !ativar && possuiSubunidades
      ? `A unidade "${unid.nome}" e todas as suas subunidades serão inativadas.`
      : `A unidade "${unid.nome}" será ${ativar ? 'ativada' : 'inativada'}.`;

    Swal.fire({
      title: `Deseja realmente ${acao}?`,
      text: texto,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: ativar ? '#28a745' : '#f0ad4e',
      cancelButtonColor: '#3085d6',
      confirmButtonText: ativar ? 'Sim, ativar' : 'Sim, inativar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      this.unidadeEmAtualizacaoUuid = unid.uuid;
      this.errorMessage = '';

      this.unidadeService.buscar(unid.uuid).pipe(
        switchMap((unidadeAtual: UnidadeDTO) => this.unidadeService.atualizar(unid.uuid, {
          nome: unidadeAtual.nome,
          tipo: unidadeAtual.tipo,
          sigla: unidadeAtual.sigla,
          unidadeGerenciadoraUuid: unidadeAtual.unidadeGerenciadoraUuid,
          ativo: ativar
        }))
      ).subscribe({
        next: () => {
          this.unidadeEmAtualizacaoUuid = null;
          void Swal.fire('Sucesso!', `Unidade ${ativar ? 'ativada' : 'inativada'} com sucesso.`, 'success');
          this.carregarUnidades();
        },
        error: (error: Error) => {
          this.errorMessage = error.message;
          this.unidadeEmAtualizacaoUuid = null;
          void Swal.fire('Erro!', error.message, 'error');
        }
      });
    });
  }

  public formatarTipo(tipo?: TiposUnidade): string {
    const labels: Record<TiposUnidade, string> = {
      [TiposUnidade.DIRECAO]: 'DIREÇÃO',
      [TiposUnidade.COMISSAO]: 'COMISSÃO',
      [TiposUnidade.DEPARTAMENTO]: 'DEPARTAMENTO',
      [TiposUnidade.SETOR]: 'SETOR',
      [TiposUnidade.LABORATORIO]: 'LABORATÓRIO',
      [TiposUnidade.CURSO]: 'CURSO'
    };

    return tipo ? labels[tipo] : '---';
  }

  private montarArvore(unidadesPlanas: UnidadeDTO[]): UnidadeTreeNode[] {
    const mapaDeNos = new Map<string, UnidadeTreeNode>();
    const raizes: UnidadeTreeNode[] = [];

    unidadesPlanas.forEach(unidade => {
      mapaDeNos.set(unidade.uuid, { ...unidade, subunidades: [] });
    });

    mapaDeNos.forEach(noAtual => {
      if (noAtual.unidadeGerenciadoraUuid) {
        const noPai = mapaDeNos.get(noAtual.unidadeGerenciadoraUuid);
        if (noPai) {
          noPai.subunidades.push(noAtual);
          return;
        }
      }

      raizes.push(noAtual);
    });

    return raizes;
  }

  private encontrarNaArvore(uuid: string, lista: UnidadeTreeNode[]): UnidadeTreeNode | null {
    for (const unidade of lista) {
      if (unidade.uuid === uuid) {
        return unidade;
      }

      const encontrada = this.encontrarNaArvore(uuid, unidade.subunidades);
      if (encontrada) {
        return encontrada;
      }
    }

    return null;
  }
}
