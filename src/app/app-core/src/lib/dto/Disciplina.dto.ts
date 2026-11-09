export interface DisciplinaDTO {
  id?: number;
  uuid?: string;
  nome: string;
  codigoDisciplina: string;
  numero?: string | null;
  classificacao?: string | null;
  cargaHoraria: number;
  subareaId: number;
  nomeSubarea: string;
  tipoDisciplina?: string;
  ead?: boolean;
  cargaHorariaTeorica: number;
  cargaHorariaPratica: number;
  cargaHorariaEad: number;
  cargaHorariaExtensaoPratica: number;
  cargaHorariaExtensaoTeorica: number;
}
