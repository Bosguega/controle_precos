"use client";

import { useState, useEffect } from "react";
import type { Produto } from "@/types";
import { FaDownload, FaUpload, FaSync } from "react-icons/fa";
import { isProdutoArray } from "@/lib/validacao";
import InstrucoesSincronizacao from "@/components/InstrucoesSincronizacao";
import BotaoDownloadGitHub from "@/components/BotaoDownloadGitHub";
import SincronizacaoGitHub from "@/components/SincronizacaoGitHub";
import { useProdutosOffline } from "@/hooks/useProdutosOffline";
import StatusOffline from "@/components/StatusOffline";

const GITHUB_RAW_URL = "https://raw.githubusercontent.com/Bosguega/controle_precos/master/banco_produtos.json";

export default function Configuracao() {
  const { produtos, addProduto, loading, error, isOnline, syncPending } = useProdutosOffline();
  const [syncing, setSyncing] = useState(false);
  const [versaoLocal, setVersaoLocal] = useState<string | null>(null);
  const [versaoRemota, setVersaoRemota] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // Carrega a versão local
  useEffect(() => {
    if (produtos.length > 0) {
      const datas = produtos.map((p) => new Date(p.dataCompra)).sort((a, b) => +b - +a);
      const ultima = datas[0];
      setVersaoLocal(ultima ? ultima.toLocaleDateString("pt-BR") : "Sem dados");
    } else {
      setVersaoLocal("Sem produtos");
    }
  }, [produtos]);

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
    const blob = new Blob([JSON.stringify(produtos, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `banco_produtos_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Sincronizar com GitHub
  const handleSincronizarGitHub = async () => {
    try {
      // Exportar dados atuais
      const dadosExport = await fetch('/api/produtos/export');
      const produtosAtuais = await dadosExport.json();
      
      // Aqui você pode implementar a lógica para subir para o GitHub
      // Por exemplo, usando a GitHub API ou um webhook
      console.log('Dados para sincronizar:', produtosAtuais);
      
      alert('Funcionalidade de sincronização com GitHub será implementada em breve!');
    } catch (error) {
      alert('Erro ao sincronizar: ' + error);
    }
  };

  // Importar
  const handleImportar = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
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

        // Importar cada produto individualmente
        for (const produto of dados) {
          const { id, ...dadosProduto } = produto;
          await addProduto(dadosProduto);
        }

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

          {/* Sincronização GitHub */}
          <SincronizacaoGitHub 
            onExport={handleExportar}
            onImport={handleImportar}
          />

          <BotaoDownloadGitHub />
        </div>

        <div className="p-4 bg-gray-50 text-center text-sm text-gray-400 border-t">
          Gerenciamento com Prisma • Banco de dados SQLite
        </div>

        {/* Mensagem de erro */}
        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-400 text-red-700">
            <p className="font-medium">Erro:</p>
            <p>{error}</p>
          </div>
        )}
      </div>

      {/* Status Offline */}
      <StatusOffline 
        isOnline={isOnline}
        pendingCount={produtos.filter(p => p._pendingSync).length}
        onSync={async () => {
          setSyncing(true);
          await syncPending();
          setSyncing(false);
        }}
        syncing={syncing}
      />
    </div>
  );
}