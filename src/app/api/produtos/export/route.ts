import { NextResponse } from 'next/server';
import { getProdutos } from '@/services/produtoService';

export async function GET() {
  try {
    const produtos = await getProdutos();
    return NextResponse.json(produtos);
  } catch (error) {
    console.error('Erro ao exportar produtos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
