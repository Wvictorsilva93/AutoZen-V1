import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function GET() {
  try {
    const session = await requireAuth()
    const suppliers = await prisma.supplier.findMany({
      where: { companyId: session.companyId },
      orderBy: { name: 'asc' },
    })
    return NextResponse.json(suppliers)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar fornecedores' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth()
    const body = await request.json()
    const supplier = await prisma.supplier.create({
      data: { ...body, companyId: session.companyId! },
    })
    return NextResponse.json(supplier, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar fornecedor' }, { status: 500 })
  }
}
