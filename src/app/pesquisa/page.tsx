"use client";

import { useState } from "react";
import { FaSearch, FaTrash } from "react-icons/fa";
import { useProdutosOffline } from "@/hooks/useProdutosOffline";
import StatusOffline from "@/components/StatusOffline";

export default function Pesquisa() {
  const { produtos, deleteProduto, loading, error, isOnline, syncPending } = useProdutosOffline();
  const [syncing, setSyncing] = useState(false);
  const [filtro, setFiltro] = useState("");

  const handleExcluir = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;
    try {
      await deleteProduto(id);
    } catch (err) {
      alert(`Erro ao excluir produto: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
    }
  };

  const produtosFiltrados = produtos.filter((p) =>
    p.nome.toLowerCase().includes(filtro.toLowerCase())
  );

  const formatarMoeda = (valor: number) =>
    valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando produtos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4">
      <div className="max-w-full mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800">Pesquisar Produtos</h1>
          <p className="text-gray-500 mt-1">Encontre e gerencie seus produtos</p>
        </div>

        <div className="p-6 bg-gray-50 border-b">
          <div className="relative max-w-md mx-auto">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 pointer-events-none">
              <FaSearch />
            </span>
            <input
              type="text"
              placeholder="Buscar por nome..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"
            />
          </div>
          <p className="text-center text-sm text-gray-500 mt-2">
            {produtosFiltrados.length} produto(s) encontrado(s)
          </p>
        </div>

        <div className="overflow-x-auto">
          {produtosFiltrados.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <span className="text-6xl mb-4">🔍</span>
              <p className="text-lg font-medium">Nenhum produto encontrado</p>
            </div>
          ) : (
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
                {produtosFiltrados.map((p) => (
                  <tr key={p.id} className="transition-colors duration-150 hover:bg-gray-100">
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{p.nome}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{p.marca || "-"}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{p.quantidade}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{p.unidade}</td>
                    <td className="px-4 py-3 text-sm text-gray-800 font-medium font-mono">{formatarMoeda(p.valorUnitario)}</td>
                    <td className="px-4 py-3 text-sm text-gray-800 font-medium font-mono">{formatarMoeda(p.valorTotal)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {typeof p.dataCompra === 'string' 
                        ? new Date(p.dataCompra).toLocaleDateString('pt-BR')
                        : p.dataCompra.toLocaleDateString('pt-BR')
                      }
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{p.mercado || "-"}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleExcluir(p.id)}
                        className="text-red-500 hover:text-red-700 transition"
                        title="Excluir produto"
                      >
                        <FaTrash size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="p-4 bg-gray-50 text-center text-sm text-gray-400 border-t">
          Total de produtos cadastrados: {produtos.length}
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