import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth()
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''

    const where: Record<string, unknown> = { companyId: session.companyId }
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { cpfCnpj: { contains: search } },
        { phone: { contains: search } },
        { email: { contains: search } },
      ]
    }

    const clients = await prisma.client.findMany({
      where,
      include: {
        _count: { select: { vehicles: true, serviceOrders: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(clients)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar clientes' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth()
    const body = await request.json()

    const client = await prisma.client.create({
      data: {
        ...body,
        companyId: session.companyId!,
      },
    })

    return NextResponse.json(client, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar cliente' }, { status: 500 })
  }
}
