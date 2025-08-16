// src/app/cadastro/page.tsx
"use client";

import { useState } from "react";
import type { Produto } from "@/types";
import { salvarProdutos } from "@/utils/storage";
import { FaPlus, FaSave } from "react-icons/fa";
import { parseMoeda } from "@/lib/formatacao";
import { produtoPadrao } from "@/lib/produtoPadrao";
import TabelaProdutos from "@/components/TabelaProdutos";

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
      [`${index}-${campo}`]: valorAtual > 0 ? valorAtual.toFixed(2).replace(".", ",") : "",
    }));
  };

  const handleBlurMoeda = () => {
    setCampoEditando(null);
    setValoresEditando({});
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

        {/* Tabela */}
        <TabelaProdutos
          produtos={produtos}
          erros={erros}
          linhaAtiva={linhaAtiva}
          campoEditando={campoEditando}
          valoresEditando={valoresEditando}
          onChange={handleChange}
          onFocusMoeda={handleFocusMoeda}
          onBlurMoeda={handleBlurMoeda}
          onRemove={handleRemove}
        />

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