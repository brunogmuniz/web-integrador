export interface OfertaDTO {
  id?: number;
  disciplinaUuid: string;
  disciplinaId?: number;
  nomeDisciplina?: string;
  semestre: number;
  numProfessoresPratica: number;
  numProfessoresTeorica: number;
  tutoria: boolean;
  ead?: boolean;
}
