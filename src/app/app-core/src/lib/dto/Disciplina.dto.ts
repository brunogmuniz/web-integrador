export interface DisciplinaDTO{
  uuid?: string;
  nome: string;
  codigoDisciplina: string;
  cargaHoraria: number;
  uuidSubarea: string;
  nomeSubarea: string;
  tipoDisciplina?: string;
  ead: boolean;
  cargaHorariaTeorica: number;
  cargaHorariaPratica: number;
}
