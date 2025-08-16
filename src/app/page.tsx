"use client";

import Link from "next/link";
import { FaClipboardList, FaSearch } from "react-icons/fa";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="text-center max-w-2xl w-full">
        {/* Título */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 tracking-tight">
          Controle de Preços
        </h1>
        <p className="text-lg text-gray-600 mb-10 leading-relaxed">
          Gerencie seus produtos e acompanhe preços com facilidade.
        </p>

        {/* Botões */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          {/* Cadastro */}
          <Link
            href="/cadastro"
            className="flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-all transform hover:scale-105 hover:shadow-xl text-lg"
          >
            <FaClipboardList size={24} />
            Cadastro de Produto
          </Link>

          {/* Pesquisa */}
          <Link
            href="/pesquisa"
            className="flex items-center justify-center gap-3 px-8 py-4 bg-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 transition-all transform hover:scale-105 hover:shadow-xl text-lg"
          >
            <FaSearch size={24} />
            Pesquisar Produto
          </Link>
        </div>

        {/* Decoração opcional (opcional) */}
        <div className="mt-12 text-gray-400 text-sm">
          🛒 Organize suas compras de forma inteligente
        </div>
      </div>
    </div>
  );
}