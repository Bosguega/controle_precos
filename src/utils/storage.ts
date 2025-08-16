import { Produto } from "@/types";

const STORAGE_KEY = "produtos";

// Carrega produtos do localStorage e garante que todos tenham ID
export function carregarProdutos(): Produto[] {
  if (typeof window === "undefined") return [];

  const saved = localStorage.getItem(STORAGE_KEY);
  const produtos: Produto[] = saved ? JSON.parse(saved) : [];

  // Garantir que cada produto tenha um ID
  return produtos.map((p) => ({
    ...p,
    id: p.id ?? crypto.randomUUID(),
  }));
}

// Salva produtos no localStorage, evitando IDs duplicados
export function salvarProdutos(produtos: Produto[]): void {
  if (typeof window === "undefined") return;

  const existentes = carregarProdutos();

  // Combinar existentes + novos, sobrescrevendo pelo ID
  const mapa = new Map<string, Produto>();
  [...existentes, ...produtos].forEach((p) => {
    if (!p.id) p.id = crypto.randomUUID();
    mapa.set(p.id, p);
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(mapa.values())));
}
