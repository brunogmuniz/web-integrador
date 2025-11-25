
import {AreaConhecimentoDTO} from './AreaConhecimento.dto';

export interface SubareaConhecimentoDTO {
  id: number;
  nome: string;
  sigla: string;
  cargaHorariaTotal: number;
  area: AreaConhecimentoDTO;
}
