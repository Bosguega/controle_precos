import { NextRequest, NextResponse } from 'next/server';
import { addProduto } from '@/services/produtoService';
import type { Produto } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const produtos: Produto[] = await request.json();
    
    if (!Array.isArray(produtos)) {
      return NextResponse.json(
        { error: 'Dados inválidos: deve ser um array de produtos' },
        { status: 400 }
      );
    }

    const produtosImportados = [];
    
    // Importar cada produto
    for (const produto of produtos) {
      const { id, ...dadosProduto } = produto;
      const novoProduto = await addProduto(dadosProduto);
      produtosImportados.push(novoProduto);
    }

    return NextResponse.json({
      message: `${produtosImportados.length} produtos importados com sucesso`,
      produtos: produtosImportados
    });
  } catch (error) {
    console.error('Erro ao importar produtos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
