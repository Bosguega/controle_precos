"use client";

import { useState } from "react";
import { Produto } from "@/types";
import { salvarProdutos, carregarProdutos } from "@/utils/storage";
import { FaTrash, FaPlus, FaSave } from "react-icons/fa";

function produtoPadrao(): Produto {
  return {
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

export default function Cadastro() {
  const [produtos, setProdutos] = useState<Produto[]>([produtoPadrao()]);
  const [erros, setErros] = useState<boolean[]>([false]);
  const [linhaAtiva, setLinhaAtiva] = useState<number | null>(null);

  const handleChange = (index: number, field: keyof Produto, value: string | number) => {
    const newProdutos = [...produtos];
    if (field === "valorUnitario") {
      const val = typeof value === "string" ? parseFloat(value) || 0 : value;
      newProdutos[index].valorUnitario = val;
      newProdutos[index].valorTotal = newProdutos[index].quantidade * val;
    } else if (field === "valorTotal") {
      const val = typeof value === "string" ? parseFloat(value) || 0 : value;
      newProdutos[index].valorTotal = val;
      newProdutos[index].valorUnitario = newProdutos[index].quantidade
        ? val / newProdutos[index].quantidade
        : 0;
    } else if (field === "quantidade") {
      const val = typeof value === "string" ? parseFloat(value) || 0 : value;
      newProdutos[index].quantidade = val;
      newProdutos[index].valorTotal = val * newProdutos[index].valorUnitario;
    } else {
      (newProdutos[index][field] as string) = value.toString();
    }
    setProdutos(newProdutos);

    const newErros = [...erros];
    newErros[index] = !newProdutos[index].nome.trim();
    setErros(newErros);
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

    if (invalidos.some((erro) => erro)) {
      alert("Corrija os produtos com nome vazio antes de salvar.");
      return;
    }

    const existentes = carregarProdutos();
    const todos = [...existentes, ...produtos];
    salvarProdutos(todos);
    alert(`${produtos.length} produtos cadastrados com sucesso!`);
    setProdutos([produtoPadrao()]);
    setErros([false]);
    setLinhaAtiva(null);
  };

  const formatarMoeda = (valor: number) =>
    valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const formatarEntradaMoeda = (value: string): string => {
    const clean = value.replace(/\D/g, "");
    const number = parseFloat(clean) / 100;
    return isNaN(number) ? "" : number.toFixed(2).replace(".", ",");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Cabeçalho */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800">Cadastro de Produtos</h1>
          <p className="text-gray-500 mt-1">Adicione novos produtos ao seu histórico</p>
        </div>

        {/* Cabeçalho da tabela */}
        <div className="grid grid-cols-12 gap-2 px-6 py-3 bg-gray-50 border-b font-semibold text-sm text-gray-600 uppercase tracking-wide">
          <div className="col-span-3">Nome</div>
          <div className="col-span-2">Marca</div>
          <div className="col-span-1">Qtd</div>
          <div className="col-span-1">Un</div>
          <div className="col-span-2">Valor Unit.</div>
          <div className="col-span-2">Valor Total</div>
          <div className="col-span-1">Data</div>
          <div className="col-span-2">Mercado</div>
          <div className="col-span-1"></div>
        </div>

        {/* Lista de produtos */}
        <div className="max-h-96 overflow-y-auto">
          {produtos.map((p, idx) => {
            const isActive = linhaAtiva === idx;
            const hasError = erros[idx];

            return (
              <div
                key={idx}
                className={`grid grid-cols-12 gap-2 px-6 py-3 border-b last:border-b-0 transition-all duration-200 cursor-pointer ${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-25"
                } ${isActive ? "ring-2 ring-blue-200 bg-blue-50" : "hover:bg-gray-50"}`}
                onClick={() => setLinhaAtiva(idx)}
              >
                {/* Nome (com erro destacado) */}
                <input
                  type="text"
                  placeholder="Nome do produto"
                  value={p.nome}
                  onChange={(e) => handleChange(idx, "nome", e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className={`col-span-3 px-3 py-2 outline-none transition-all ${
                    hasError
                      ? "text-red-900 placeholder-red-300"
                      : "text-gray-800 placeholder-gray-400"
                  } ${
                    isActive
                      ? "ring-1 ring-blue-300 rounded"
                      : "rounded hover:ring-1 hover:ring-gray-300"
                  }`}
                />

                <input
                  type="text"
                  placeholder="Marca"
                  value={p.marca}
                  onChange={(e) => handleChange(idx, "marca", e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className={`col-span-2 px-3 py-2 outline-none text-gray-700 placeholder-gray-400 transition-all ${
                    isActive ? "ring-1 ring-blue-300 rounded" : "hover:ring-1 hover:ring-gray-300"
                  }`}
                />

                <input
                  type="number"
                  placeholder="1"
                  value={p.quantidade}
                  onChange={(e) => handleChange(idx, "quantidade", e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className={`col-span-1 px-3 py-2 outline-none text-gray-700 placeholder-gray-400 transition-all ${
                    isActive ? "ring-1 ring-blue-300 rounded" : "hover:ring-1 hover:ring-gray-300"
                  }`}
                  min="0.01"
                  step="0.01"
                />

                <input
                  type="text"
                  placeholder="un"
                  value={p.unidade}
                  onChange={(e) => handleChange(idx, "unidade", e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className={`col-span-1 px-3 py-2 outline-none text-gray-700 placeholder-gray-400 transition-all ${
                    isActive ? "ring-1 ring-blue-300 rounded" : "hover:ring-1 hover:ring-gray-300"
                  }`}
                />

                <input
                  type="text"
                  placeholder="R$ 0,00"
                  value={formatarEntradaMoeda(p.valorUnitario.toFixed(2))}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, "");
                    handleChange(idx, "valorUnitario", raw ? parseFloat(raw) / 100 : 0);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className={`col-span-2 px-3 py-2 outline-none text-gray-700 placeholder-gray-400 transition-all ${
                    isActive ? "ring-1 ring-blue-300 rounded" : "hover:ring-1 hover:ring-gray-300"
                  }`}
                />

                <input
                  type="text"
                  placeholder="R$ 0,00"
                  value={formatarEntradaMoeda(p.valorTotal.toFixed(2))}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, "");
                    handleChange(idx, "valorTotal", raw ? parseFloat(raw) / 100 : 0);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className={`col-span-2 px-3 py-2 outline-none text-gray-700 placeholder-gray-400 transition-all ${
                    isActive ? "ring-1 ring-blue-300 rounded" : "hover:ring-1 hover:ring-gray-300"
                  }`}
                />

                <input
                  type="date"
                  value={p.dataCompra}
                  onChange={(e) => handleChange(idx, "dataCompra", e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className={`col-span-1 px-3 py-2 outline-none text-gray-700 transition-all ${
                    isActive ? "ring-1 ring-blue-300 rounded" : "hover:ring-1 hover:ring-gray-300"
                  }`}
                />

                <input
                  type="text"
                  placeholder="Mercado"
                  value={p.mercado}
                  onChange={(e) => handleChange(idx, "mercado", e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className={`col-span-2 px-3 py-2 outline-none text-gray-700 placeholder-gray-400 transition-all ${
                    isActive ? "ring-1 ring-blue-300 rounded" : "hover:ring-1 hover:ring-gray-300"
                  }`}
                />

                {/* Botão de remover */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(idx);
                  }}
                  disabled={produtos.length === 1}
                  className="col-span-1 flex items-center justify-center text-red-500 hover:text-red-700 disabled:text-gray-300 disabled:cursor-not-allowed"
                  title="Remover produto"
                >
                  <FaTrash size={16} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Ações */}
        <div className="p-6 flex flex-wrap gap-4 justify-center border-t bg-gray-50">
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-shadow shadow"
          >
            <FaPlus /> Adicionar Linha
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-5 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-shadow shadow"
          >
            <FaSave /> Salvar Produtos
          </button>
        </div>
      </div>
    </div>
  );
}