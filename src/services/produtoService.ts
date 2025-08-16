import { PrismaClient } from '@prisma/client';
import type { Produto } from '@/types';

const prisma = new PrismaClient();

// Listar todos os produtos
export async function getProdutos(): Promise<Produto[]> {
  try {
    const produtos = await prisma.produto.findMany({
      orderBy: { dataCompra: 'desc' }
    });
    return produtos.map(produto => ({
      ...produto,
      dataCompra: produto.dataCompra.toISOString()
    }));
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    throw error;
  }
}

// Adicionar novo produto
export async function addProduto(dados: Omit<Produto, 'id'>): Promise<Produto> {
  try {
    const produto = await prisma.produto.create({
      data: {
        ...dados,
        dataCompra: new Date(dados.dataCompra),
        valorTotal: dados.quantidade * dados.valorUnitario,
      },
    });
    return {
      ...produto,
      dataCompra: produto.dataCompra.toISOString()
    };
  } catch (error) {
    console.error('Erro ao adicionar produto:', error);
    throw error;
  }
}

// Atualizar produto
export async function updateProduto(id: string, dados: Partial<Produto>): Promise<Produto> {
  try {
    const updateData: Partial<Produto> = { ...dados };
    
    // Converter dataCompra se fornecida
    if (dados.dataCompra) {
      updateData.dataCompra = new Date(dados.dataCompra);
    }
    
    // Recalcular valorTotal se quantidade ou valorUnitario foram alterados
    if (dados.quantidade !== undefined || dados.valorUnitario !== undefined) {
      const produto = await prisma.produto.findUnique({ where: { id } });
      if (produto) {
        const quantidade = dados.quantidade ?? produto.quantidade;
        const valorUnitario = dados.valorUnitario ?? produto.valorUnitario;
        updateData.valorTotal = quantidade * valorUnitario;
      }
    }

    const produto = await prisma.produto.update({
      where: { id },
      data: updateData,
    });
    
    return {
      ...produto,
      dataCompra: produto.dataCompra.toISOString()
    };
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    throw error;
  }
}

// Deletar produto
export async function deleteProduto(id: string): Promise<Produto> {
  try {
    const produto = await prisma.produto.delete({ where: { id } });
    return {
      ...produto,
      dataCompra: produto.dataCompra.toISOString()
    };
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    throw error;
  }
}

// Buscar produtos por nome ou marca
export async function searchProdutos(query: string): Promise<Produto[]> {
  try {
    const produtos = await prisma.produto.findMany({
      where: {
        OR: [
          { nome: { contains: query } },
          { marca: { contains: query } },
        ],
      },
      orderBy: { dataCompra: 'desc' }
    });
    return produtos.map(produto => ({
      ...produto,
      dataCompra: produto.dataCompra.toISOString()
    }));
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    throw error;
  }
}
