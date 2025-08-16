// src/app/cadastro/page.tsx
"use client";

import { useState } from "react";
import type { Produto } from "@/types";
import { salvarProdutos } from "@/utils/storage";
import { FaTrash, FaPlus, FaSave } from "react-icons/fa";

function produtoPadrao(): Produto {
  return {
    id: crypto.randomUUID(), // ID gerado imediatamente
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

function parseMoeda(valor: string): number {
  if (!valor) return 0;
  let clean = valor.replace(/[R$\s]/g, "");

  if (clean.includes(",")) {
    // Formato brasileiro: 1.234,56
    clean = clean.replace(/\./g, "").replace(",", ".");
  } else if (clean.includes(".")) {
    // Pode ser americano ou separador de milhares
    const pontos = clean.split(".");
    if (pontos.length > 2 || (pontos.length === 2 && pontos[1].length !== 2)) {
      clean = clean.replace(/\./g, ""); // Remove pontos como separadores
    }
  }

  const parsed = parseFloat(clean);
  return isNaN(parsed) ? 0 : parsed;
}

function formatInputMoeda(valor: number): string {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valor);
}

function formatMoedaBrasileira(valor: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
}

export default function Cadastro() {
  const [produtos, setProdutos] = useState<Produto[]>([produtoPadrao()]);
  const [erros, setErros] = useState<boolean[]>([false]);
  const [linhaAtiva, setLinhaAtiva] = useState<number | null>(null);
  const [campoEditando, setCampoEditando] = useState<{ linha: number; campo: string } | null>(null);
  const [valoresEditando, setValoresEditando] = useState<{ [key: string]: string }>({});

  const handleChange = (index: number, field: keyof Produto, value: string | number) => {
    const newProdutos = [...produtos];

    if (field === "valorUnitario") {
      const chave = `${index}-valorUnitario`;
      if (campoEditando?.linha === index && campoEditando?.campo === "valorUnitario") {
        setValoresEditando((prev) => ({ ...prev, [chave]: value.toString() }));
      }
      const val = typeof value === "string" ? parseMoeda(value) : value;
      newProdutos[index].valorUnitario = val;
      newProdutos[index].valorTotal = newProdutos[index].quantidade * val;
    } else if (field === "valorTotal") {
      const chave = `${index}-valorTotal`;
      if (campoEditando?.linha === index && campoEditando?.campo === "valorTotal") {
        setValoresEditando((prev) => ({ ...prev, [chave]: value.toString() }));
      }
      const val = typeof value === "string" ? parseMoeda(value) : value;
      newProdutos[index].valorTotal = val;
      newProdutos[index].valorUnitario = newProdutos[index].quantidade ? val / newProdutos[index].quantidade : 0;
    } else if (field === "quantidade") {
      const val = typeof value === "string" ? parseFloat(value) || 0 : value;
      newProdutos[index].quantidade = val;
      newProdutos[index].valorTotal = val * newProdutos[index].valorUnitario;
    } else {
      (newProdutos[index][field] as string) = value.toString();
    }

    setProdutos(newProdutos);
    setErros(newProdutos.map((p) => !p.nome.trim()));
  };

  const handleFocusMoeda = (index: number, campo: string) => {
    setCampoEditando({ linha: index, campo });
    const valorAtual = campo === "valorUnitario" ? produtos[index].valorUnitario : produtos[index].valorTotal;
    setValoresEditando((prev) => ({
      ...prev,
      [`${index}-${campo}`]: valorAtual > 0 ? formatInputMoeda(valorAtual) : "",
    }));
  };

  const handleBlurMoeda = () => {
    setCampoEditando(null);
    setValoresEditando({});
  };

  const getValorFormatado = (index: number, campo: "valorUnitario" | "valorTotal", valor: number) => {
    const editando = campoEditando?.linha === index && campoEditando?.campo === campo;
    const chave = `${index}-${campo}`;
    if (editando && valoresEditando[chave] !== undefined) {
      return valoresEditando[chave];
    }
    return editando ? (valor > 0 ? formatInputMoeda(valor) : "") : formatMoedaBrasileira(valor);
  };

  const handleAdd = () => {
    setProdutos([...produtos, produtoPadrao()]);
    setErros([...erros, false]);
    setLinhaAtiva(produtos.length);
  };

  const handleRemove = (index: number) => {
    if (produtos.length === 1) return;
    const newProdutos = produtos.filter((_, i) => i !== index);
    const newErros = erros.filter((_, i) => i !== index);
    setProdutos(newProdutos);
    setErros(newErros);
    if (linhaAtiva === index) setLinhaAtiva(null);
  };

  const handleSubmit = () => {
    const invalidos = produtos.map((p) => !p.nome.trim());
    setErros(invalidos);
    if (invalidos.some(Boolean)) {
      alert("Corrija os produtos com nome vazio antes de salvar.");
      return;
    }
    salvarProdutos(produtos);
    alert(`${produtos.length} produto(s) salvos com sucesso!`);
    setProdutos([produtoPadrao()]);
    setErros([false]);
    setLinhaAtiva(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4">
      <div className="max-w-full mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Cabeçalho */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800">Cadastro de Produtos</h1>
          <p className="text-gray-500 mt-1">Adicione novos produtos ao seu histórico</p>
        </div>

        {/* Tabela de Produtos */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nome</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Marca</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Qtd</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Un</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Valor Unit.</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Data</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Mercado</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {produtos.map((p, idx) => {
                const isActive = linhaAtiva === idx;
                const hasError = erros[idx];
                return (
                  <tr
                    key={p.id}
                    className={`transition-colors duration-150 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} ${
                      isActive ? "ring-2 ring-blue-200" : "hover:bg-gray-100"
                    }`}
                    onClick={() => setLinhaAtiva(idx)}
                  >
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        placeholder="Nome"
                        value={p.nome}
                        onChange={(e) => handleChange(idx, "nome", e.target.value)}
                        className={`w-full px-2 py-1 border rounded outline-none text-sm ${
                          hasError ? "border-red-500" : "border-gray-300"
                        } ${isActive ? "ring-1 ring-blue-300" : ""}`}
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        placeholder="Marca"
                        value={p.marca}
                        onChange={(e) => handleChange(idx, "marca", e.target.value)}
                        className={`w-full px-2 py-1 border rounded outline-none text-sm ${
                          isActive ? "ring-1 ring-blue-300" : "border-gray-300"
                        }`}
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={p.quantidade}
                        onChange={(e) => handleChange(idx, "quantidade", e.target.value)}
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
                        value={p.unidade}
                        onChange={(e) => handleChange(idx, "unidade", e.target.value)}
                        className={`w-full px-2 py-1 border rounded outline-none text-sm ${
                          isActive ? "ring-1 ring-blue-300" : "border-gray-300"
                        }`}
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={getValorFormatado(idx, "valorUnitario", p.valorUnitario)}
                        onChange={(e) => handleChange(idx, "valorUnitario", e.target.value)}
                        onFocus={() => handleFocusMoeda(idx, "valorUnitario")}
                        onBlur={handleBlurMoeda}
                        className={`w-full px-2 py-1 border rounded outline-none text-sm text-right font-mono ${
                          isActive ? "ring-1 ring-blue-300" : "border-gray-300"
                        }`}
                        placeholder="R$ 0,00"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={getValorFormatado(idx, "valorTotal", p.valorTotal)}
                        onChange={(e) => handleChange(idx, "valorTotal", e.target.value)}
                        onFocus={() => handleFocusMoeda(idx, "valorTotal")}
                        onBlur={handleBlurMoeda}
                        className={`w-full px-2 py-1 border rounded outline-none text-sm text-right font-mono ${
                          isActive ? "ring-1 ring-blue-300" : "border-gray-300"
                        }`}
                        placeholder="R$ 0,00"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="date"
                        value={p.dataCompra}
                        onChange={(e) => handleChange(idx, "dataCompra", e.target.value)}
                        className={`w-full px-2 py-1 border rounded outline-none text-sm ${
                          isActive ? "ring-1 ring-blue-300" : "border-gray-300"
                        }`}
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={p.mercado}
                        onChange={(e) => handleChange(idx, "mercado", e.target.value)}
                        className={`w-full px-2 py-1 border rounded outline-none text-sm ${
                          isActive ? "ring-1 ring-blue-300" : "border-gray-300"
                        }`}
                      />
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove(idx);
                        }}
                        disabled={produtos.length === 1}
                        className="text-red-500 hover:text-red-700 disabled:text-gray-300 disabled:cursor-not-allowed"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Ações */}
        <div className="p-6 flex flex-wrap gap-4 justify-center border-t bg-gray-50">
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow"
          >
            <FaPlus /> Adicionar Linha
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-5 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 shadow"
          >
            <FaSave /> Salvar Produtos
          </button>
        </div>
      </div>
    </div>
  );
}