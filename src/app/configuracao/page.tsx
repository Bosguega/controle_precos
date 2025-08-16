// src/app/configuracao/page.tsx
"use client";

import { useState, useEffect } from "react";
import type { Produto } from "@/types";
import { carregarProdutos, salvarProdutos } from "@/utils/storage";
import { FaDownload, FaUpload, FaSync } from "react-icons/fa";
import { isProdutoArray } from "@/lib/validacao";
import InstrucoesSincronizacao from "@/components/InstrucoesSincronizacao";
import BotaoDownloadGitHub from "@/components/BotaoDownloadGitHub";

const GITHUB_RAW_URL = "https://raw.githubusercontent.com/Bosguega/controle_precos/master/banco_produtos.json";

export default function Configuracao() {
  const [versaoLocal, setVersaoLocal] = useState<string | null>(null);
  const [versaoRemota, setVersaoRemota] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // Carrega a versão local
  useEffect(() => {
    const produtos = carregarProdutos();
    if (produtos.length > 0) {
      const datas = produtos.map((p) => new Date(p.dataCompra)).sort((a, b) => +b - +a);
      const ultima = datas[0];
      setVersaoLocal(ultima ? ultima.toLocaleDateString("pt-BR") : "Sem dados");
    } else {
      setVersaoLocal("Sem produtos");
    }
  }, []);

  // Verifica versão remota
  const verificarAtualizacao = async () => {
    setCarregando(true);
    setErro(null);
    try {
      const res = await fetch(GITHUB_RAW_URL + "?t=" + new Date().getTime());
      if (!res.ok) throw new Error("Arquivo não encontrado no GitHub");

      const rawData = await res.json();

      if (!isProdutoArray(rawData)) {
        throw new Error("Formato de dados inválido");
      }

      const dados: Produto[] = rawData;
      if (dados.length > 0) {
        const datas = dados.map((p) => new Date(p.dataCompra)).sort((a, b) => +b - +a);
        const ultima = datas[0];
        setVersaoRemota(ultima ? ultima.toLocaleDateString("pt-BR") : "Desconhecida");
      } else {
        setVersaoRemota("Vazio");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      setErro("Falha ao verificar versão remota: " + message);
      setVersaoRemota("Erro");
    } finally {
      setCarregando(false);
    }
  };

  // Exportar
  const handleExportar = () => {
    const dados = carregarProdutos();
    const blob = new Blob([JSON.stringify(dados, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `banco_produtos_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Importar
  const handleImportar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const conteudo = event.target?.result as string;
        const rawData = JSON.parse(conteudo);

        if (!isProdutoArray(rawData)) {
          throw new Error("O arquivo JSON não contém uma lista de produtos válidos.");
        }

        const dados: Produto[] = rawData.map((p) => ({
          ...p,
          id: p.id || crypto.randomUUID(),
        }));

        salvarProdutos(dados);
        setVersaoLocal(
          dados.length > 0
            ? new Date(Math.max(...dados.map((p) => new Date(p.dataCompra).getTime()))).toLocaleDateString("pt-BR")
            : "Importado"
        );
        alert("Banco importado com sucesso!");
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Arquivo inválido.";
        alert("Erro ao importar: " + message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800">Configuração</h1>
          <p className="text-gray-500 mt-1">Gerencie seu banco de dados</p>
        </div>

        <div className="p-6 space-y-8">
          <InstrucoesSincronizacao />

          {/* Versão do Banco */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">📅 Versão do Banco</h2>
            <div className="space-y-2 text-sm">
              <p><strong>Local:</strong> {versaoLocal || "Carregando..."}</p>
              <p><strong>GitHub:</strong> {versaoRemota || "Não verificada"}</p>
            </div>
            <button
              onClick={verificarAtualizacao}
              disabled={carregando}
              className="mt-3 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
            >
              <FaSync /> Verificar Atualização
            </button>
            {erro && <p className="text-red-500 text-sm mt-2">{erro}</p>}
          </div>

          {/* Exportar */}
          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <h2 className="text-xl font-semibold text-green-800 mb-4">📤 Exportar Banco</h2>
            <p className="text-sm text-green-700 mb-4">
              Salve uma cópia do seu banco de dados para subir no GitHub.
            </p>
            <button
              onClick={handleExportar}
              className="flex items-center gap-2 px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <FaDownload /> Exportar JSON
            </button>
          </div>

          {/* Importar */}
          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
            <h2 className="text-xl font-semibold text-purple-800 mb-4">📥 Importar Banco</h2>
            <p className="text-sm text-purple-700 mb-4">
              Carregue um banco de dados salvo.
            </p>
            <label className="flex items-center gap-2 px-5 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer">
              <FaUpload /> Selecionar Arquivo
              <input type="file" accept=".json" onChange={handleImportar} className="sr-only" />
            </label>
          </div>

          <BotaoDownloadGitHub />
        </div>

        <div className="p-4 bg-gray-50 text-center text-sm text-gray-400 border-t">
          Gerenciamento offline • Banco de dados em JSON
        </div>
      </div>
    </div>
  );
}