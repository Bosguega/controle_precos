"use client";

import { useState } from "react";
import { FaUpload, FaDownload, FaSync, FaGithub } from "react-icons/fa";

interface SincronizacaoGitHubProps {
  onExport: () => void;
  onImport: (file: File) => void;
}

export default function SincronizacaoGitHub({ onExport, onImport }: SincronizacaoGitHubProps) {
  const [sincronizando, setSincronizando] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImport(file);
    }
  };

  const handleSincronizar = async () => {
    setSincronizando(true);
    try {
      // Aqui você implementaria a lógica de sincronização
      // Por exemplo, usando GitHub API
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulação
      alert("Sincronização concluída!");
    } catch (error) {
      alert("Erro na sincronização: " + error);
    } finally {
      setSincronizando(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border border-purple-200">
      <h2 className="text-xl font-semibold text-purple-800 mb-4 flex items-center gap-2">
        <FaGithub /> Sincronização GitHub
      </h2>
      <p className="text-sm text-purple-700 mb-4">
        Mantenha seus dados sincronizados entre dispositivos via GitHub.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Exportar */}
        <button
          onClick={onExport}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <FaDownload /> Exportar
        </button>

        {/* Importar */}
        <label className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
          <FaUpload /> Importar
          <input
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            className="sr-only"
          />
        </label>

        {/* Sincronizar */}
        <button
          onClick={handleSincronizar}
          disabled={sincronizando}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaSync className={sincronizando ? "animate-spin" : ""} />
          {sincronizando ? "Sincronizando..." : "Sincronizar"}
        </button>
      </div>

      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
        <p className="font-medium">💡 Como usar:</p>
        <ol className="list-decimal list-inside mt-2 space-y-1">
          <li>Exporte os dados do computador</li>
          <li>Suba o arquivo JSON no GitHub</li>
          <li>No celular, importe o arquivo do GitHub</li>
          <li>Ou use &quot;Sincronizar&quot; para automatizar</li>
        </ol>
      </div>
    </div>
  );
}
