export interface ProjetosDTO {
  id: number;

  numero: string;
  titulo: string;

  responsavel?: string;

  dataInicio: string;
  dataFim?: string;

  resumo: string;

  tipoOrientacao?: string;
  classificacaoCNPQ?: string;
  situacao?: string;

  topicos?: string[];
}
