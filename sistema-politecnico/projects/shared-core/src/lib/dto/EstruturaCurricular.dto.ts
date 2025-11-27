
export interface OfertaDisciplinaDto {
  idDisciplina: number;
  nomeDisciplina?: string;
  periodos: number[];
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
