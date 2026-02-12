import { OfertaDTO } from "./Oferta.dto";

export interface EstruturaCurricularDto {
  id?: number;
  uuid?: string;
  codigo: string;
  ano: string;
  cursoUuid: string;
  cursoId?: number;
  nomeCurso?: string;
  ativo: boolean;
  ofertas: OfertaDTO[];
}
