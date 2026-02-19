import {DocenteDTO} from 'app-core';
import {OfertaDTO} from 'app-core';

export interface HorarioAulaDTO {
  uuid: string;
  oferta: OfertaDTO;
  docente: DocenteDTO;
  diaSemana: string;
  horaInicio: string;
  horaFim: string;
}
