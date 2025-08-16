"use client";

import type { Produto } from "@/types"; // ✅ Importe a interface
import { FaTrash } from "react-icons/fa";
import { formatInputMoeda, formatMoedaBrasileira } from "@/lib/formatacao";

interface LinhaProdutoProps {
  produto: Produto;
  index: number;
  isActive: boolean;
  hasError: boolean;
  campoEditando: { linha: number; campo: string } | null;
  valoresEditando: { [key: string]: string };
  onChange: (index: number, field: keyof Produto, value: string | number) => void; // ✅ keyof Produto
  onFocusMoeda: (index: number, campo: string) => void;
  onBlurMoeda: () => void;
  onRemove: (index: number) => void;
  disabledRemove: boolean;
}

export default function LinhaProduto({
  produto,
  index,
  isActive,
  hasError,
  campoEditando,
  valoresEditando,
  onChange,
  onFocusMoeda,
  onBlurMoeda,
  onRemove,
  disabledRemove,
}: LinhaProdutoProps) {
  const editandoValorUnitario = campoEditando?.linha === index && campoEditando.campo === "valorUnitario";
  const editandoValorTotal = campoEditando?.linha === index && campoEditando.campo === "valorTotal";

  const valorUnitarioFormatado = editandoValorUnitario
    ? (valoresEditando[`${index}-valorUnitario`] ?? formatInputMoeda(produto.valorUnitario))
    : formatMoedaBrasileira(produto.valorUnitario);

  const valorTotalFormatado = editandoValorTotal
    ? (valoresEditando[`${index}-valorTotal`] ?? formatInputMoeda(produto.valorTotal))
    : formatMoedaBrasileira(produto.valorTotal);

  return (
    <tr
      key={produto.id}
      className={`transition-colors duration-150 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} ${
        isActive ? "ring-2 ring-blue-200" : "hover:bg-gray-100"
      }`}
      onClick={() => onChange(index, "nome", produto.nome)}
    >
      <td className="px-4 py-2">
        <input
          type="text"
          placeholder="Nome"
          value={produto.nome}
          onChange={(e) => onChange(index, "nome", e.target.value)}
          className={`w-full px-2 py-1 border rounded outline-none text-sm ${
            hasError ? "border-red-500" : "border-gray-300"
          } ${isActive ? "ring-1 ring-blue-300" : ""}`}
        />
      </td>
      <td className="px-4 py-2">
        <input
          type="text"
          placeholder="Marca"
          value={produto.marca}
          onChange={(e) => onChange(index, "marca", e.target.value)}
          className={`w-full px-2 py-1 border rounded outline-none text-sm ${
            isActive ? "ring-1 ring-blue-300" : "border-gray-300"
          }`}
        />
      </td>
      <td className="px-4 py-2">
        <input
          type="number"
          value={produto.quantidade}
          onChange={(e) => onChange(index, "quantidade", e.target.value)}
          className={`w-full px-2 py-1 border rounded outline-none text-sm ${
            isActive ? "ring-1 ring-blue-300" : "border-gray-300"
          }`}
          min="0.01"
          step="0.01"
        />
      </td>
      <td className="px-4 py-2">
        <input
          type="text"
          value={produto.unidade}
          onChange={(e) => onChange(index, "unidade", e.target.value)}
          className={`w-full px-2 py-1 border rounded outline-none text-sm ${
            isActive ? "ring-1 ring-blue-300" : "border-gray-300"
          }`}
        />
      </td>
      <td className="px-4 py-2">
        <input
          type="text"
          value={valorUnitarioFormatado}
          onChange={(e) => onChange(index, "valorUnitario", e.target.value)}
          onFocus={() => onFocusMoeda(index, "valorUnitario")}
          onBlur={onBlurMoeda}
          className={`w-full px-2 py-1 border rounded outline-none text-sm text-right font-mono ${
            isActive ? "ring-1 ring-blue-300" : "border-gray-300"
          }`}
          placeholder="R$ 0,00"
        />
      </td>
      <td className="px-4 py-2">
        <input
          type="text"
          value={valorTotalFormatado}
          onChange={(e) => onChange(index, "valorTotal", e.target.value)}
          onFocus={() => onFocusMoeda(index, "valorTotal")}
          onBlur={onBlurMoeda}
          className={`w-full px-2 py-1 border rounded outline-none text-sm text-right font-mono ${
            isActive ? "ring-1 ring-blue-300" : "border-gray-300"
          }`}
          placeholder="R$ 0,00"
        />
      </td>
      <td className="px-4 py-2">
        <input
          type="date"
          value={typeof produto.dataCompra === 'string' 
            ? produto.dataCompra.split('T')[0]
            : produto.dataCompra.toISOString().split('T')[0]
          }
          onChange={(e) => onChange(index, "dataCompra", e.target.value)}
          className={`w-full px-2 py-1 border rounded outline-none text-sm ${
            isActive ? "ring-1 ring-blue-300" : "border-gray-300"
          }`}
        />
      </td>
      <td className="px-4 py-2">
        <input
          type="text"
          value={produto.mercado}
          onChange={(e) => onChange(index, "mercado", e.target.value)}
          className={`w-full px-2 py-1 border rounded outline-none text-sm ${
            isActive ? "ring-1 ring-blue-300" : "border-gray-300"
          }`}
        />
      </td>
      <td className="px-4 py-2 text-center">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(index);
          }}
          disabled={disabledRemove}
          className="text-red-500 hover:text-red-700 disabled:text-gray-300 disabled:cursor-not-allowed"
        >
          <FaTrash />
        </button>
      </td>
    </tr>
  );
}

