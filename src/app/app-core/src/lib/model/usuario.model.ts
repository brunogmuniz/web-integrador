export interface Usuario {
  id: number;
  nome: string;
  email: string;
  matricula: string;
  telefone?: string | null;
  ativo: boolean;
  cpf?: string | null;
  tipoPerfil?: TipoPerfil | null;
  permissoes?: string[];
  uuid?: string;
  ultimaAtualizacaoCadastro?: string | null;
  pendenciaAtualizacao?: boolean;
}

export enum TipoPerfil {
  ALUNO = 'aluno',
  DOCENTE = 'docente',
  TAE = 'tae'
}
