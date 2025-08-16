import { NextRequest, NextResponse } from 'next/server';
import { getProdutos, addProduto } from '@/services/produtoService';

export async function GET() {
  try {
    const produtos = await getProdutos();
    return NextResponse.json(produtos);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const dados = await request.json();
    const produto = await addProduto(dados);
    return NextResponse.json(produto, { status: 201 });
  } catch (error) {
    console.error('Erro ao adicionar produto:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
