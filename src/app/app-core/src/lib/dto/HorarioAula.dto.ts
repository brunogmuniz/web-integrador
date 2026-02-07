import {DocenteDTO} from 'app-core';
import {OfertaDTO} from 'app-core';

export interface HorarioAulaDTO{
  uuid?: string | null;
  oferta: OfertaDTO;
  docente: DocenteDTO;
  diaSemana: String;
  horaInicio: String;
  horaFim: String;
}
