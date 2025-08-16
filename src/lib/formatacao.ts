// src/lib/formatacao.ts

export function parseMoeda(valor: string): number {
  if (!valor) return 0;
  let clean = valor.replace(/[R$\s]/g, "");

  if (clean.includes(",")) {
    clean = clean.replace(/\./g, "").replace(",", ".");
  } else if (clean.includes(".")) {
    const pontos = clean.split(".");
    if (pontos.length > 2 || (pontos.length === 2 && pontos[1].length !== 2)) {
      clean = clean.replace(/\./g, "");
    }
  }

  const parsed = parseFloat(clean);
  return isNaN(parsed) ? 0 : parsed;
}

export function formatInputMoeda(valor: number): string {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valor);
}

export function formatMoedaBrasileira(valor: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
}