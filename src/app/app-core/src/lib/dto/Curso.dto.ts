export interface CursoDTO {
  id?: number;
  uuid: string;
  nome: string;
  sigla: string;
  codigo?: string | null;
  anoCurriculo: number;
  cargaHorariaTotal: number;
  nivel: string;
  ativo?: boolean;
}
