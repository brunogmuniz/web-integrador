import { TipoPerfil, Usuario } from '../model/usuario.model';

export class UsuarioUtil {
  static isCadastroIncompleto(u: Usuario | null | undefined): boolean {
    return !u?.cpf || !u?.tipoPerfil;
  }

  static isCadastroExpirado(dataIso?: string | Date | null): boolean {
    if (!dataIso) return true;

    const dataUltima = new Date(dataIso);
    const hoje = new Date();
    const diffMeses = (hoje.getFullYear() - dataUltima.getFullYear()) * 12 +
      (hoje.getMonth() - dataUltima.getMonth());

    return diffMeses >= 6;
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
