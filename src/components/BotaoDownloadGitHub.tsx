"use client";

import { FaGithub } from "react-icons/fa";

// ✅ URL corrigida (sem espaço no final)
const GITHUB_RAW_URL = "https://raw.githubusercontent.com/Bosguega/controle_precos/refs/heads/master/banco_produtos.json";

export default function BotaoDownloadGitHub() {
  // ✅ Função para baixar o arquivo programaticamente
  const handleDownload = async () => {
    if (!navigator.onLine) {
      alert("Você está offline. Conecte-se à internet para baixar do GitHub.");
      return;
    }

    try {
      const res = await fetch(GITHUB_RAW_URL);
      if (!res.ok) throw new Error("Falha ao baixar o arquivo");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "banco_produtos.json"; // Nome do arquivo ao salvar
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Erro ao baixar o arquivo: " + (err instanceof Error ? err.message : "Desconhecido"));
    }
  };

  return (
    <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200">
      <h2 className="text-xl font-semibold text-indigo-800 mb-4">⬇️ Baixar do GitHub</h2>
      <p className="text-sm text-indigo-700 mb-4">
        Clique abaixo para baixar o banco de dados diretamente do GitHub.
      </p>
      <button
        onClick={handleDownload}
        className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
      >
        <FaGithub /> Baixar banco_produtos.json
      </button>
      <p className="text-xs text-indigo-600 mt-2">
        O arquivo será baixado automaticamente. Salve-o e importe no app.
      </p>
    </div>
  );
}