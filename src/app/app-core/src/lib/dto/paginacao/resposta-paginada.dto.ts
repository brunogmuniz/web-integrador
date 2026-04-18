export interface MetadadosPaginacao {
  totalElementos: number;
  tamanho: number;
  paginaAtual: number;
  totalPaginas: number;
}

export interface RespostaPaginada<T> {
  conteudo: T[];
  meta: MetadadosPaginacao;
}
