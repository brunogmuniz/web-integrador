import { TipoPerfil } from '../model/usuario.model';

export interface UsuarioDTO {
  uuid?: string;
  nome: string;
  matricula: string;
  email: string;
  cpf?: string | null;
  tipoPerfil?: TipoPerfil | null;
  telefone?: string | null;
  senha?: string | null;
  ativo: boolean;
  ultimaAtualizacaoCadastro?: string | null;
  pendenciaAtualizacao?: boolean;
}
