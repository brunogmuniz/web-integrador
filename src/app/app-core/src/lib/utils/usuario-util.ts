import { TipoPerfil } from '../model/usuario.model';

export class UsuarioUtil {
  static isCadastroExpirado(dataUltimaAtualizacao: string | null | undefined): boolean {
    if (!dataUltimaAtualizacao) return true;
    const dataRef = new Date(dataUltimaAtualizacao);
    const umAnoAtras = new Date();
    umAnoAtras.setFullYear(umAnoAtras.getFullYear() - 1);
    return dataRef < umAnoAtras;
  }

  static sugerirPerfilPorMatricula(matricula: string | null | undefined): TipoPerfil {
    const apenasNumeros = (matricula ?? '').replace(/\D/g, '');

    if (apenasNumeros.length < 9) {
      return TipoPerfil.DOCENTE;
    }

    const prefixoAno = parseInt(apenasNumeros.substring(0, 4), 10);
    const anoAtual = new Date().getFullYear();
    const ehAnoValido = !isNaN(prefixoAno) && prefixoAno >= 1900 && prefixoAno <= (anoAtual + 1);

    return ehAnoValido ? TipoPerfil.ALUNO : TipoPerfil.DOCENTE;
  }
}
