export interface DocenteVinculoOfertaDTO {
  uuidDocente: string;
  teorica?: boolean;
  pratica?: boolean;
}

export interface DisciplinaOfertaItemDTO {
  uuidDisciplina: string;
  uuidDisciplinaCurriculo: string;
  docentesTeorica?: string[];
  docentesPratica?: string[];
}

export interface DisciplinaOfertaLoteDTO {
  uuidOferta: string;
  uuidCurso?: string;
  uuidEstruturaCurricular: string;
  disciplinas: DisciplinaOfertaItemDTO[];
}
