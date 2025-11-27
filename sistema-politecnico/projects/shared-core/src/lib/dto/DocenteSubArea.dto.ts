import { DocenteDTO } from './Docente.dto';
import { SubareaConhecimentoDTO } from './SubareaConhecimento.dto';
import { DocenteSubAreaPercentualDTO } from './DocenteSubAreaPercentual.dto';

export interface DocenteSubAreaDTO {
  id?: number;
  idDocente?: number;
  nomeDocente?: string;
  nomeArea?: string;
  nomeSubarea?: string;
  subAreaPercentual?: DocenteSubAreaPercentualDTO[];
  percentualAtuacao?: number;
  docente?: DocenteDTO;
  subArea?: SubareaConhecimentoDTO;
}
