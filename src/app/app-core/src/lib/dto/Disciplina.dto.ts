export interface DisciplinaDTO{
  id: number;
  nome: string;
  codigoDisciplina: string;
  cargaHoraria: number;
  idSubarea: number;
  nomeSubarea: string;
  tipoDisciplina?: string;
  ead: boolean;
  cargaHorariaTeorica: number;
  cargaHorariaPratica: number;
}
