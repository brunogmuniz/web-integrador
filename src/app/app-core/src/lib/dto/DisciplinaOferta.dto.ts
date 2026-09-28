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
  docentesParcial?: DocenteCreditosOfertaDTO[];
}

export interface DocenteCreditosOfertaDTO {
  uuidDocente: string;
  creditosTeorica?: number;
  creditosPratica?: number;
  creditosEad?: number;
  creditosExtensaoPratica?: number;
  creditosExtensaoTeorica?: number;
}

export interface DisciplinaOfertaLoteDTO {
  uuidOferta: string;
  uuidCurso?: string;
  uuidEstruturaCurricular: string;
  disciplinas: DisciplinaOfertaItemDTO[];
}

export interface DisciplinaOfertaResumoDTO {
  codigoDisciplina: string;
  nomeDisciplina: string;
  curriculo: string;
  professoresPraticos: string[];
  professoresTeoricos: string[];
}

export interface CursoOfertaDisciplinasDTO {
  uuidCurso: string;
  nomeCurso: string;
  siglaCurso: string;
  uuidEstruturaCurricular: string;
  curriculo: string;
  disciplinas: DisciplinaOfertaResumoDTO[];
}

export interface OfertaDisciplinasResumoDTO {
  uuidOferta: string;
  ano: string;
  semestre: string;
  cursos: CursoOfertaDisciplinasDTO[];
}
