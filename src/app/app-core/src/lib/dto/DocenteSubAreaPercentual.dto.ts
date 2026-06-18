export interface DocenteSubAreaPercentualDTO {
  uuid?: string | null;
  subareaId?: number;
  nomeSubarea: string;
  siglaSubarea?: string;
  idArea?: number;
  nomeArea: string;
  siglaArea?: string;
  area?: {
    sigla?: string;
  };
  percentual: number;
  cargaHoraria?: number;
  cargaHorariaTeorica?: number;
  cargaHorariaPratica?: number;
}
