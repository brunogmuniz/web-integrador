export interface DocenteDTO {
  uuid: string;
  nome: string;
  matricula: string;
  tipoVaga: string;
  tipoFormacao: string;
  licenciatura: boolean;
  origemVaga: string;
  nomeDepartamento: string;
  departamentoId: number;
  ativo?: boolean;
}
