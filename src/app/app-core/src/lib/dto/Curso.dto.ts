export interface CursoDTO {
  id: number;
  uuid?: string | null;
  nome: string;
  sigla: string;
  anoCurriculo: number;
  cargaHorariaTotal: number;
  nivel: string;
}
