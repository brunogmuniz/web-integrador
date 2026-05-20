export interface DisciplinaCurriculoDTO {
  id?: number;
  uuid?: string;
  disciplinaUuid?: string;
  disciplinaId?: number;
  nomeDisciplina?: string;
  tipoDisciplina?: string;
  semestre: number;
  maxProfessoresPratica: number;
  maxProfessoresTeorica: number;
  cargaHorariaTeorica: number;
  cargaHorariaPratica: number;
  tutoria: boolean;
  ead?: boolean;
}
