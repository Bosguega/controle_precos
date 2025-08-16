// src/app/configuracao/page.tsx
"use client";

import { useState, useEffect } from "react";
import type { Produto } from "@/types";
import { carregarProdutos, salvarProdutos } from "@/utils/storage";
import { FaDownload, FaUpload, FaSync, FaInfoCircle } from "react-icons/fa";

const GITHUB_JSON_URL = "https://raw.githubusercontent.com/seu-usuario/seu-repo/main/banco_produtos.json";

function hasProperty<T extends object>(obj: T, key: PropertyKey): key is keyof T {
  return obj.hasOwnProperty(key);
}

// ✅ Type Guard: Verifica se um objeto é um Produto
function isProduto(obj: unknown): obj is Produto {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "nome" in obj &&
    typeof obj.nome === "string" &&
    "quantidade" in obj &&
    typeof obj.quantidade === "number" &&
    "valorUnitario" in obj &&
    typeof obj.valorUnitario === "number" &&
    "dataCompra" in obj &&
    typeof obj.dataCompra === "string" &&
    ["marca", "unidade", "mercado"].every((key) => {
      return !hasProperty(obj, key) || typeof obj[key] === "string" || obj[key] === undefined;
    }) &&
    "id" in obj && (typeof obj.id === "string")
  );
}

// ✅ Type Guard: Verifica se é um array de Produtos
function isProdutoArray(data: unknown): data is Produto[] {
  return Array.isArray(data) && data.every(isProduto);
}

// ✅ Função segura para parse de JSON com validação
function parseAndValidateProdutos(rawData: unknown): Produto[] {
  if (!isProdutoArray(rawData)) {
    throw new Error("O dado fornecido não é um array válido de produtos.");
  }
  return rawData;
}

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
      const res = await fetch(GITHUB_JSON_URL + "?t=" + new Date().getTime());
      if (!res.ok) throw new Error("Arquivo não encontrado no GitHub");

      const rawData = await res.json();
      parseAndValidateProdutos(rawData); // Valida antes de usar

      const dados: Produto[] = rawData;
      if (dados.length > 0) {
        const datas = dados.map((p) => new Date(p.dataCompra)).sort((a, b) => +b - +a);
        const ultima = datas[0];
        setVersaoRemota(ultima ? ultima.toLocaleDateString("pt-BR") : "Desconhecida");
      } else {
        setVersaoRemota("Vazio");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      setErro("Falha ao verificar versão remota: " + message);
      setVersaoRemota("Erro");
    } finally {
      setCarregando(false);
    }
  };

  // Atualizar manualmente do GitHub
  const atualizarManual = async () => {
    if (!confirm("Deseja atualizar o banco com os dados do GitHub? Isso substituirá os dados locais.")) return;
    setCarregando(true);
    setErro(null);
    try {
      const res = await fetch(GITHUB_JSON_URL + "?t=" + new Date().getTime());
      if (!res.ok) throw new Error("Falha ao baixar o banco");

      const rawData = await res.json();
      const dadosValidos = parseAndValidateProdutos(rawData);

      const dados: Produto[] = dadosValidos.map((p) => ({
        ...p,
        id: p.id || crypto.randomUUID(),
      }));

      salvarProdutos(dados);
      setVersaoLocal(
        dados.length > 0
          ? new Date(Math.max(...dados.map((p) => new Date(p.dataCompra).getTime()))).toLocaleDateString("pt-BR")
          : "Atualizado"
      );
      alert("Banco atualizado com sucesso do GitHub!");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      setErro("Erro ao atualizar do GitHub: " + message);
    } finally {
      setCarregando(false);
    }
  };

  // Exportar banco
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

  // Importar banco
  const handleImportar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const conteudo = event.target?.result as string;
        const rawData = JSON.parse(conteudo);
        const dadosValidos = parseAndValidateProdutos(rawData);

        const dados: Produto[] = dadosValidos.map((p) => ({
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
      } catch (err) {
        const message = err instanceof Error ? err.message : "Arquivo inválido ou corrompido.";
        alert("Erro ao importar: " + message);
      }
    };
    reader.readAsText(file);
  };

  // Atualização automática
  const ativarAtualizacaoAutomatica = () => {
    if (!confirm("Ativar atualização automática? O banco será atualizado do GitHub ao abrir esta tela.")) return;
    localStorage.setItem("autoUpdateEnabled", "true");
    alert("Atualização automática ativada!");
  };

  const desativarAtualizacaoAutomatica = () => {
    localStorage.setItem("autoUpdateEnabled", "false");
    alert("Atualização automática desativada!");
  };

  const autoUpdateEnabled = localStorage.getItem("autoUpdateEnabled") === "true";

  useEffect(() => {
    if (autoUpdateEnabled) {
      const timer = setTimeout(() => {
        atualizarManual();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800">Configuração</h1>
          <p className="text-gray-500 mt-1">Gerencie seu banco de dados</p>
        </div>

        <div className="p-6 space-y-8">
          {/* Versão do Banco */}
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h2 className="text-xl font-semibold text-blue-800 mb-4 flex items-center gap-2">
              <FaInfoCircle /> Versão do Banco
            </h2>
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
              Baixe uma cópia do seu banco de dados para salvar ou compartilhar.
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
              Substitua seu banco atual com um arquivo JSON.
            </p>
            <label className="flex items-center gap-2 px-5 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer">
              <FaUpload /> Selecionar Arquivo
              <input type="file" accept=".json" onChange={handleImportar} className="sr-only" />
            </label>
          </div>

          {/* Atualização Manual */}
          <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
            <h2 className="text-xl font-semibold text-orange-800 mb-4">🔁 Atualização Manual</h2>
            <p className="text-sm text-orange-700 mb-4">
              Atualize seu banco com os dados do GitHub.
            </p>
            <button
              onClick={atualizarManual}
              disabled={carregando}
              className="flex items-center gap-2 px-5 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
            >
              <FaSync /> Atualizar do GitHub
            </button>
          </div>

          {/* Atualização Automática */}
          <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200">
            <h2 className="text-xl font-semibold text-indigo-800 mb-4">⚙️ Atualização Automática</h2>
            <p className="text-sm text-indigo-700 mb-4">
              {autoUpdateEnabled
                ? "✅ Ativada: o banco será atualizado automaticamente ao abrir esta tela."
                : "❌ Desativada: clique para ativar."}
            </p>
            <div className="flex gap-4">
              <button
                onClick={ativarAtualizacaoAutomatica}
                disabled={autoUpdateEnabled}
                className={`px-5 py-2 rounded text-white ${
                  autoUpdateEnabled
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                Ativar
              </button>
              <button
                onClick={desativarAtualizacaoAutomatica}
                disabled={!autoUpdateEnabled}
                className={`px-5 py-2 rounded text-white ${
                  !autoUpdateEnabled
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                Desativar
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 text-center text-sm text-gray-400 border-t">
          Gerenciamento de dados offline
        </div>
      </div>
    </div>
  );
}