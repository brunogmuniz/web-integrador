import { DocenteDTO } from './Docente.dto';
import { SubareaConhecimentoDTO } from './SubareaConhecimento.dto';
import { DocenteSubAreaPercentualDTO } from './DocenteSubAreaPercentual.dto';

export interface DocenteSubAreaDTO {
  uuid?: string | null;
  idDocente?: number;
  nomeDocente?: string;
  nomeArea?: string;
  siglaArea?: string;
  nomeSubarea?: string;
  siglaSubarea?: string;
  subAreaPercentual?: DocenteSubAreaPercentualDTO[];
  percentualAtuacao?: number;
  docente?: DocenteDTO;
  subArea?: SubareaConhecimentoDTO;
}
