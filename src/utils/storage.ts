import { Produto } from "@/types";

const STORAGE_KEY = "produtos";

export function salvarProdutos(produtos: Produto[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(produtos));
}

export function carregarProdutos(): Produto[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}
