import type { Produto } from "@/types";

const STORAGE_KEY = "produtos";

export function carregarProdutos(): Produto[] {
  if (typeof window === "undefined") return [];
  const saved = localStorage.getItem(STORAGE_KEY);
  const produtos: Produto[] = saved ? JSON.parse(saved) : [];
  return produtos.map((p) => ({
    ...p,
    id: p.id || crypto.randomUUID(),
  }));
}

export function salvarProdutos(produtos: Produto[]): void {
  if (typeof window === "undefined") return;
  const existentes = carregarProdutos();
  const mapa = new Map<string, Produto>();
  [...existentes, ...produtos].forEach((p) => {
    const id = p.id || crypto.randomUUID();
    mapa.set(id, { ...p, id });
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(mapa.values())));
}

export function removerProduto(id: string): void {
  if (typeof window === "undefined") return;
  const produtos = carregarProdutos();
  const filtrados = produtos.filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtrados));
}