export interface Produto {
  id: string;
  quantidade: number;
  unidade: string;
  nome: string;
  marca: string;
  valorUnitario: number;
  valorTotal: number;
  dataCompra: Date | string;
  mercado: string;
}