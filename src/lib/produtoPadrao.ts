// src/lib/produtoPadrao.ts
import type { Produto } from "@/types";

export function produtoPadrao(): Produto {
  return {
    id: crypto.randomUUID(),
    quantidade: 1,
    unidade: "un",
    nome: "",
    marca: "",
    valorUnitario: 0,
    valorTotal: 0,
    dataCompra: new Date().toISOString().split("T")[0],
    mercado: "",
  };
}