import {DocenteSubAreaPercentualDTO} from "app-core/lib/dto/DocenteSubAreaPercentual.dto";

export interface DocenteDetalheDTO {
  idDocente: number;
  uuid: string;
  nome: string;
  matricula: string;
  tipoVaga: string;
  tipoFormacao: string;
  licenciatura: boolean;
  origemVaga: string;
  nomeDepartamento: string;
  idDepartamento: number;
  departamento: string;
  ativo?: boolean;
  subAreas: DocenteSubAreaPercentualDTO[];
  totalEncargos: number;
  cargaTotal: number;
  cargaTeorica: number;
  cargaPratica: number;
}
