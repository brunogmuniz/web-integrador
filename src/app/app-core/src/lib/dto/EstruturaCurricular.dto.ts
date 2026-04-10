import { OfertaDisciplinaDTO } from "./Oferta.dto";

export interface EstruturaCurricularDTO {
  uuid?: string;
  ano: number;
  codigo: string;
  ativo: boolean;
  cursoId: number;
  ofertas: OfertaDisciplinaDTO[];
  nomeCurso?: string;
}
