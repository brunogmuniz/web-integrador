import { DisciplinaCurriculoDTO } from "./DisciplinaCurriculo.dto";

export interface EstruturaCurricularDTO {
  uuid?: string;
  ano: number;
  codigo: string;
  ativo: boolean;
  cursoId: number;
  disciplinasCurriculo: DisciplinaCurriculoDTO[];
  nomeCurso?: string;
}
