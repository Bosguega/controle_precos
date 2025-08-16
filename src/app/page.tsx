"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaClipboardList, FaSearch, FaCogs } from "react-icons/fa";

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="text-center text-gray-500">Carregando...</div>
      </div>
    );
  }

  const buttonClass =
    "flex items-center justify-center gap-3 px-8 py-4 font-semibold rounded-xl shadow-lg " +
    "focus:ring-4 transition-all transform hover:scale-105 hover:shadow-xl text-lg";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="text-center max-w-2xl w-full">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 tracking-tight">
          Controle de Preços
        </h1>
        <p className="text-lg text-gray-600 mb-10 leading-relaxed">
          Gerencie seus produtos e acompanhe preços com facilidade.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link
            href="/cadastro"
            className={`${buttonClass} bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-300`}
          >
            <FaClipboardList size={24} />
            Cadastro
          </Link>

          <Link
            href="/pesquisa"
            className={`${buttonClass} bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-300`}
          >
            <FaSearch size={24} />
            Pesquisar
          </Link>

          {/* Botão de Configuração */}
          <Link
            href="/configuracao"
            className={`${buttonClass} bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-300`}
          >
            <FaCogs size={24} />
            Configuração
          </Link>
        </div>

        <div className="mt-12 text-gray-400 text-sm">
          🛒 Organize suas compras de forma inteligente
        </div>
      </div>
    </div>
  );
}