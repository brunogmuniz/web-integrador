export interface DocenteDTO {
  id: number;
  uuid?: string;
  nome: string;
  matricula: string;
  tipoVaga: string;
  tipoFormacao: string;
  licenciatura: boolean;
  origemVaga: string;
  departamento: string;
}
