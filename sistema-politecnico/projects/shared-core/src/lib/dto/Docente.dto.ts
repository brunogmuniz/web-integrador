
import { DepartamentoDTO } from './Departamento.dto';

export interface DocenteDTO {
  id: number;
  nome: string;
  matricula: string;
  cargaHorariaSemestral: number;
  tipoVaga: string;
  tipoFormacao: string;
  licenciatura: string;
  origemVaga: string;
  departamento: DepartamentoDTO;
}
