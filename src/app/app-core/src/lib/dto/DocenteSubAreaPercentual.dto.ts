export interface DocenteSubAreaPercentualDTO {
  uuid?: string | null;
  subareaId?: number;
  nomeSubarea: string;
  idArea?: number;
  nomeArea: string;
  percentual: number;
  cargaHoraria?: number;
  cargaHorariaTeorica?: number;
  cargaHorariaPratica?: number;
}
