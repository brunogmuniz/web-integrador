export type SortDirection = 'asc' | 'desc';

export class TableSort<T extends string> {
  constructor(
    public coluna: T,
    public direcao: SortDirection = 'asc'
  ) {}

  public ordenarPor(coluna: T, callback?: () => void): void {
    if (this.coluna === coluna) {
      this.direcao = this.direcao === 'asc' ? 'desc' : 'asc';
    } else {
      this.coluna = coluna;
      this.direcao = 'asc';
    }
    if (callback) {
      callback();
    }
  }

  public iconeOrdenacao(coluna: T): string {
    if (this.coluna !== coluna) {
      return 'la-sort';
    }
    return this.direcao === 'asc' ? 'la-sort-up' : 'la-sort-down';
  }
}
