export interface AcessoUnidadeDTO {
  readonly unidadeUsuarioUuid: string;
  readonly unidadeUuid: string;
  readonly nomeUnidade: string;
  readonly siglaUnidade?: string | null;
  readonly tipoUnidade?: string | null;
  readonly papel?: string | null;
  readonly permissoes: string[];
}
