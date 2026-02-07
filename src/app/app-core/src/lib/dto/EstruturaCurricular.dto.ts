export interface OfertaDisciplinaDto {
  uuidDisciplina: string;
  nomeDisciplina?: string;
  semestre: number;
  tutoria: boolean;
  numProfessoresTeorica?: number;
  numProfessoresPratica?: number;
  ead: boolean;
}

export interface EstruturaCurricularDto {
  uuid?: string | null;
  ano: string;
  codigo: string;
  uuidCurso: string;
  nomeCurso?: string;
  ativo: boolean;
  ofertas: OfertaDisciplinaDto[];
}
