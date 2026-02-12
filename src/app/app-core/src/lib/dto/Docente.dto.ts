export interface DocenteDTO {
  uuid: string;
  nome: string;
  matricula: string;
  tipoVaga: string;
  tipoFormacao: string;
  licenciatura: boolean;
  origemVaga: string;
  departamento?: string | null;
  departamentoId?: number | null;
}
