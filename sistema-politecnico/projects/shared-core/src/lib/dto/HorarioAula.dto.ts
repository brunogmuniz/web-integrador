import {DocenteDTO} from './Docente.dto';
import {OfertaDTO} from './Oferta.dto';

export interface HorarioAulaDTO{
  id: number;
  oferta: OfertaDTO;
  docente: DocenteDTO;
  diaSemana: String;
  horaInicio: String;
  horaFim: String;
}
