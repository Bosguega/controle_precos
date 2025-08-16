"use client";

import { FaWifi, FaGlobe, FaSync, FaExclamationTriangle } from "react-icons/fa";

interface StatusOfflineProps {
  isOnline: boolean;
  pendingCount: number;
  onSync: () => void;
  syncing: boolean;
}

export default function StatusOffline({ isOnline, pendingCount, onSync, syncing }: StatusOfflineProps) {
  if (isOnline && pendingCount === 0) {
    return null; // Não mostrar nada se estiver online e sem pendências
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOnline && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg shadow-lg mb-2 flex items-center gap-2">
          <FaGlobe className="text-yellow-600" />
          <span className="text-sm font-medium">Modo Offline</span>
        </div>
      )}

      {pendingCount > 0 && (
        <div className="bg-blue-100 border border-blue-400 text-blue-800 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
          <FaExclamationTriangle className="text-blue-600" />
          <span className="text-sm">
            {pendingCount} produto{pendingCount > 1 ? 's' : ''} pendente{pendingCount > 1 ? 's' : ''}
          </span>
          {isOnline && (
            <button
              onClick={onSync}
              disabled={syncing}
              className="ml-2 bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <FaSync className={syncing ? "animate-spin" : ""} />
              {syncing ? "Sincronizando..." : "Sincronizar"}
            </button>
          )}
        </div>
      )}

      {isOnline && pendingCount === 0 && (
        <div className="bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
          <FaWifi className="text-green-600" />
          <span className="text-sm font-medium">Online</span>
        </div>
      )}
    </div>
  );
}
