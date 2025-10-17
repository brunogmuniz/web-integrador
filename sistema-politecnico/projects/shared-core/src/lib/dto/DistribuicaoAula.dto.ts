import { OfertaDTO } from './Oferta.dto';
import { DocenteDTO } from './Docente.dto';

export interface DistribuicaoAulaDTO {

  id: number;


  oferta: OfertaDTO;


  docente: DocenteDTO;


  cargaHorariaOfertada: number;
}
