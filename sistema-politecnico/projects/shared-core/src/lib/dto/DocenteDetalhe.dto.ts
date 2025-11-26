import { DocenteSubAreaPercentualDTO } from './DocenteSubAreaPercentual.dto';

export interface DocenteDetalheDTO {
  idDocente: number;
  nome: string;
  matricula: string;
  tipoVaga: string;
  tipoFormacao: string;
  licenciatura: boolean;
  origemVaga: string;
  nomeDepartamento: string;
  idDepartamento: number;
  departamento: string;
  subAreas: DocenteSubAreaPercentualDTO[];
  totalEncargos: number;
}
