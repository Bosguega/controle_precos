import { useState, useEffect } from 'react';
import type { Produto } from '@/types';

interface OfflineProduto extends Produto {
  _offline?: boolean;
  _pendingSync?: boolean;
}

export function useProdutosOffline() {
  const [produtos, setProdutos] = useState<OfflineProduto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);

  // Verificar status da conexão
  useEffect(() => {
    const checkOnline = () => setIsOnline(navigator.onLine);
    const checkOffline = () => setIsOnline(false);

    window.addEventListener('online', checkOnline);
    window.addEventListener('offline', checkOffline);
    checkOnline();

    return () => {
      window.removeEventListener('online', checkOnline);
      window.removeEventListener('offline', checkOffline);
    };
  }, []);

  // Carregar produtos do localStorage
  const loadFromStorage = () => {
    try {
      const stored = localStorage.getItem('produtos_offline');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (err) {
      console.error('Erro ao carregar do localStorage:', err);
    }
    return [];
  };

  // Salvar produtos no localStorage
  const saveToStorage = (produtos: OfflineProduto[]) => {
    try {
      localStorage.setItem('produtos_offline', JSON.stringify(produtos));
    } catch (err) {
      console.error('Erro ao salvar no localStorage:', err);
    }
  };

  // Carregar produtos iniciais
  useEffect(() => {
    const storedProdutos = loadFromStorage();
    setProdutos(storedProdutos);
    setLoading(false);
  }, []);

  // Sincronizar com servidor quando online
  const syncWithServer = async () => {
    if (!isOnline) return;

    try {
      // Buscar produtos do servidor
      const response = await fetch('/api/produtos');
      if (response.ok) {
        const serverProdutos = await response.json();
        
        // Mesclar com produtos offline
        const mergedProdutos = mergeProdutos(produtos, serverProdutos);
        setProdutos(mergedProdutos);
        saveToStorage(mergedProdutos);
      }
    } catch (err) {
      console.error('Erro ao sincronizar:', err);
    }
  };

  // Mesclar produtos offline com servidor
  const mergeProdutos = (offline: OfflineProduto[], server: Produto[]): OfflineProduto[] => {
    const merged = [...server];
    
    // Adicionar produtos offline que não estão no servidor
    offline.forEach(produto => {
      if (produto._offline && !server.find(p => p.id === produto.id)) {
        merged.push(produto);
      }
    });

    return merged;
  };

  // Adicionar produto
  const addProduto = async (dados: Omit<Produto, 'id'>) => {
    const novoProduto: OfflineProduto = {
      ...dados,
      id: crypto.randomUUID(),
      _offline: !isOnline,
      _pendingSync: !isOnline,
    };

    const novosProdutos = [novoProduto, ...produtos];
    setProdutos(novosProdutos);
    saveToStorage(novosProdutos);

    // Tentar sincronizar se online
    if (isOnline) {
      try {
        const response = await fetch('/api/produtos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dados),
        });

        if (response.ok) {
          const produtoServidor = await response.json();
          // Atualizar com ID do servidor
          const produtosAtualizados = novosProdutos.map(p => 
            p.id === novoProduto.id ? { ...produtoServidor, _offline: false, _pendingSync: false } : p
          );
          setProdutos(produtosAtualizados);
          saveToStorage(produtosAtualizados);
        }
      } catch (err) {
        console.error('Erro ao sincronizar produto:', err);
        // Manter como offline se falhar
      }
    }

    return novoProduto;
  };

  // Atualizar produto
  const updateProduto = async (id: string, dados: Partial<Produto>) => {
    const produtosAtualizados = produtos.map(p => 
      p.id === id ? { ...p, ...dados, _offline: !isOnline, _pendingSync: !isOnline } : p
    );
    setProdutos(produtosAtualizados);
    saveToStorage(produtosAtualizados);

    // Tentar sincronizar se online
    if (isOnline) {
      try {
        const response = await fetch(`/api/produtos/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dados),
        });

        if (response.ok) {
          const produtoServidor = await response.json();
          const produtosFinal = produtosAtualizados.map(p => 
            p.id === id ? { ...produtoServidor, _offline: false, _pendingSync: false } : p
          );
          setProdutos(produtosFinal);
          saveToStorage(produtosFinal);
        }
      } catch (err) {
        console.error('Erro ao sincronizar atualização:', err);
      }
    }
  };

  // Deletar produto
  const deleteProduto = async (id: string) => {
    const produtosAtualizados = produtos.filter(p => p.id !== id);
    setProdutos(produtosAtualizados);
    saveToStorage(produtosAtualizados);

    // Tentar sincronizar se online
    if (isOnline) {
      try {
        await fetch(`/api/produtos/${id}`, { method: 'DELETE' });
      } catch (err) {
        console.error('Erro ao sincronizar exclusão:', err);
        // Adicionar de volta se falhar
        const produto = produtos.find(p => p.id === id);
        if (produto) {
          const produtosRestaurados = [...produtosAtualizados, { ...produto, _offline: true, _pendingSync: true }];
          setProdutos(produtosRestaurados);
          saveToStorage(produtosRestaurados);
        }
      }
    }
  };

  // Buscar produtos
  const searchProdutos = async (query: string) => {
    if (isOnline) {
      try {
        const response = await fetch(`/api/produtos/search?q=${encodeURIComponent(query)}`);
        if (response.ok) {
          return await response.json();
        }
      } catch (err) {
        console.error('Erro na busca online:', err);
      }
    }

    // Fallback para busca offline
    return produtos.filter(p => 
      p.nome.toLowerCase().includes(query.toLowerCase()) ||
      p.marca.toLowerCase().includes(query.toLowerCase())
    );
  };

  // Sincronizar todos os produtos pendentes
  const syncPending = async () => {
    if (!isOnline) return;

    const pending = produtos.filter(p => p._pendingSync);
    if (pending.length === 0) return;

    for (const produto of pending) {
      try {
        const { id, _offline: _, _pendingSync: __, ...dados } = produto;
        const response = await fetch('/api/produtos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dados),
        });

        if (response.ok) {
          const produtoServidor = await response.json();
          setProdutos(prev => prev.map(p => 
            p.id === id ? { ...produtoServidor, _offline: false, _pendingSync: false } : p
          ));
        }
      } catch (err) {
        console.error('Erro ao sincronizar produto pendente:', err);
      }
    }
  };

  // Sincronizar quando voltar online
  useEffect(() => {
    if (isOnline) {
      syncPending();
      syncWithServer();
    }
  }, [isOnline, syncPending, syncWithServer]);

  return {
    produtos,
    loading,
    error,
    isOnline,
    addProduto,
    updateProduto,
    deleteProduto,
    searchProdutos,
    syncPending,
    refetch: syncWithServer,
  };
}
