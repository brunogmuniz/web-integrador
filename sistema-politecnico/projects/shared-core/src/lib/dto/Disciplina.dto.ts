import {SubareaConhecimentoDTO} from './SubareaConhecimento.dto'

export interface DisciplinaDTO{
  id: number;
  nome: string;
  codigoDisciplina: string;
  cargaHoraria: number;

  subarea: SubareaConhecimentoDTO;
}
