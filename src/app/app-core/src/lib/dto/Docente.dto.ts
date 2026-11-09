export interface DocenteDTO {
  uuid: string;
  nome: string;
  matricula: string;
  tipoVaga: string;
  tipoFormacao: string | null;
  formacaoCompleta?: string | null;
  licenciatura: boolean;
  origemVaga: string;
  nomeDepartamento: string;
  departamentoId: number;
  ativo?: boolean;
}
