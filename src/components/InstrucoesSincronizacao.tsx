// src/components/InstrucoesSincronizacao.tsx
"use client";

import { FaInfoCircle } from "react-icons/fa";

export default function InstrucoesSincronizacao() {
  return (
    <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
      <h2 className="text-xl font-semibold text-blue-800 mb-4 flex items-center gap-2">
        <FaInfoCircle /> Como Sincronizar
      </h2>
      <ol className="list-decimal list-inside space-y-2 text-sm text-blue-700">
        <li>
          <strong>PC:</strong> Use <strong>{"\"Exportar Banco\""}</strong> e suba o arquivo no GitHub
        </li>
        <li>
          <strong>Celular:</strong> Abra o app no navegador (não no PWA instalado)
        </li>
        <li>
          Clique em <strong>{"\"Baixar do GitHub\""}</strong> para salvar o arquivo
        </li>
        <li>
          Volte ao app e use <strong>{"\"Importar Banco\""}</strong> para carregar os dados
        </li>
      </ol>
      <p className="text-xs text-blue-600 mt-3">
        ⚠️ A importação é manual. O app não acessa o GitHub automaticamente.
      </p>
    </div>
  );
}