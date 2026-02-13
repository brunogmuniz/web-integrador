export interface OfertaDisciplinaDTO {
  id?: number;
  disciplinaId: number;
  semestre: number;
  numProfessoresPratica: number;
  numProfessoresTeorica: number;
  tutoria: boolean;
  ead?: boolean;
}
