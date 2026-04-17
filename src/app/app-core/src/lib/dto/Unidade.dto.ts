export enum TiposUnidade {
  DIRECAO = 'DIRECAO',
  COMISSAO = 'COMISSAO',
  DEPARTAMENTO = 'DEPARTAMENTO',
  SETOR = 'SETOR',
  LABORATORIO = 'LABORATORIO',
  CURSO = 'CURSO'
}

export interface UnidadeDTO {
  readonly uuid: string;
  readonly nome: string;
  readonly tipo: TiposUnidade;
  readonly sigla?: string;
  ativo: boolean;
  readonly unidadeGerenciadoraUuid?: string;
  readonly unidadeGerenciadoraNome?: string;
}

export interface UnidadeFormDTO {
  readonly nome: string;
  readonly tipo: TiposUnidade;
  readonly sigla?: string;
  readonly unidadeGerenciadoraUuid?: string;
  readonly ativo: boolean;
}

export interface UnidadeTreeNode extends UnidadeDTO {
  readonly subunidades: UnidadeTreeNode[];
}
