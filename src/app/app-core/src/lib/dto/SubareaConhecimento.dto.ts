
import {AreaConhecimentoDTO} from './AreaConhecimento.dto';

export interface SubareaConhecimentoDTO {
  uuid?: string;
  nome: string;
  sigla: string;
  cargaHorariaTotal: number;
  area: AreaConhecimentoDTO;
}
