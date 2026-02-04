import { TipoPerfil } from '../model/usuario.model';

export interface UsuarioDto {
  id: number;
  nome: string;
  matricula: string;
  email: string;
  cpf?: string | null;
  tipoPerfil?: TipoPerfil | null;
  telefone?: string | null;
  senha?: string | null;
  ativo: boolean;
  uuid?: string | null;
  ultimaAtualizacaoCadastro?: string | null;
  pendenciaAtualizacao?: boolean;
}
