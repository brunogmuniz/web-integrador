export interface OfertaDisciplinaDto {
  idDisciplina: number;
  nomeDisciplina?: string;
  semestre: number;
  tutoria: boolean;
  numProfessoresTeorica?: number;
  numProfessoresPratica?: number;
  ead: boolean;
}

export interface EstruturaCurricularDto {
  id?: number;
  uuid?: string;
  ano: string;
  codigo: string;
  idCurso: number;
  nomeCurso?: string;
  ativo: boolean;
  ofertas: OfertaDisciplinaDto[];
}
