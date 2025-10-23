import {DisciplinaDTO} from './Disciplina.dto';
import {PeriodoLetivoDTO} from './PeriodoLetivo.dto';

export interface OfertaDTO {
  id: number;
  disciplina: DisciplinaDTO;
  periodoLetivo: PeriodoLetivoDTO;
}
