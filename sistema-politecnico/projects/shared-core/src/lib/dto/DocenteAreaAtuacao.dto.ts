import {DocenteDTO} from './Docente.dto';
import {AreaConhecimentoDTO} from './AreaConhecimento.dto';

export interface DocenteAreaAtuacaoDTO {
  id: number;
  docente: DocenteDTO;
  area: AreaConhecimentoDTO;
  percentualAtuacao: number;
}
