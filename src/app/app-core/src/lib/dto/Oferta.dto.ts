import {DisciplinaDTO} from './Disciplina.dto';
import {PeriodoLetivoDTO} from './PeriodoLetivo.dto';

export interface OfertaDTO {
  uuid?: string | null;
  disciplina: DisciplinaDTO;
  periodoLetivo: PeriodoLetivoDTO;
}
