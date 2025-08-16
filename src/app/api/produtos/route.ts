import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const nome = searchParams.get("nome") || "";
  const produtos = await prisma.produto.findMany({
    where: {
      nome: {
        contains: nome,
        mode: "insensitive",
      },
    },
    orderBy: { dataCompra: "desc" },
  });
  return NextResponse.json(produtos);
}

export async function POST(req: Request) {
  const body = await req.json();
  const produto = await prisma.produto.create({
    data: {
      quantidade: body.quantidade,
      unidade: body.unidade,
      nome: body.nome,
      marca: body.marca,
      valorUnitario: body.valorUnitario,
      valorTotal: body.valorTotal,
      dataCompra: new Date(body.dataCompra),
      mercado: body.mercado,
    },
  });
  return NextResponse.json(produto);
}
