import {DocenteDTO, OfertaDTO} from "app-core";

export interface DistribuicaoAulaDTO {
  uuid?: string | null;
  oferta: OfertaDTO;
  docente: DocenteDTO;
  cargaHorariaOfertada: number;
}
