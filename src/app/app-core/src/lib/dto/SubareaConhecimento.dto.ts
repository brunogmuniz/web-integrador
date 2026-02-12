import {AreaConhecimentoDTO} from './AreaConhecimento.dto';

export interface SubareaConhecimentoDTO {
  id?: number;
  uuid: string;
  nome: string;
  sigla: string;
  cargaHorariaTotal: number;
  area: AreaConhecimentoDTO;
}
