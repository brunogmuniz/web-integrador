export interface DisciplinaDTO {
  id?: number;
  uuid?: string;
  nome: string;
  codigoDisciplina: string;
  cargaHoraria: number;
  subareaId: number;
  nomeSubarea: string;
  tipoDisciplina?: string;
  ead?: boolean;
  cargaHorariaTeorica: number;
  cargaHorariaPratica: number;
}
