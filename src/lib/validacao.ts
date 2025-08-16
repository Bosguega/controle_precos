// src/lib/validacao.ts
import type { Produto } from "@/types";

// Função auxiliar para verificar se uma chave existe (sem risco de prototype pollution)
function hasProperty(obj: object, key: PropertyKey): boolean {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

// Função auxiliar para fazer cast seguro com verificação
function getPropertyValue(obj: object, key: string): unknown {
  return (obj as Record<string, unknown>)[key];
}

// Type Guard: Verifica se um objeto é um Produto
export function isProduto(obj: unknown): obj is Produto {
  if (typeof obj !== "object" || obj === null) return false;

  // Verifica propriedades obrigatórias com tipo seguro
  const checks = [
    hasProperty(obj, "id") && typeof getPropertyValue(obj, "id") === "string",
    hasProperty(obj, "nome") && typeof getPropertyValue(obj, "nome") === "string",
    hasProperty(obj, "quantidade") && typeof getPropertyValue(obj, "quantidade") === "number",
    hasProperty(obj, "valorUnitario") && typeof getPropertyValue(obj, "valorUnitario") === "number",
    hasProperty(obj, "valorTotal") && typeof getPropertyValue(obj, "valorTotal") === "number",
    hasProperty(obj, "dataCompra") && typeof getPropertyValue(obj, "dataCompra") === "string",
  ];

  // Se alguma falhar, não é Produto
  if (!checks.every(Boolean)) return false;

  // Propriedades opcionais
  const optionalKeys: (keyof Produto)[] = ["marca", "unidade", "mercado"];
  const optionalValid = optionalKeys.every((key) => {
    const value = getPropertyValue(obj, key);
    return value === undefined || typeof value === "string";
  });

  return optionalValid;
}

// Type Guard: Verifica se é um array de Produtos
export function isProdutoArray(data: unknown): data is Produto[] {
  return Array.isArray(data) && data.every(isProduto);
}