import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth()
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const clientId = searchParams.get('clientId') || ''

    const where: Record<string, unknown> = { companyId: session.companyId }
    if (search) {
      where.OR = [
        { plate: { contains: search } },
        { brand: { contains: search } },
        { model: { contains: search } },
      ]
    }
    if (clientId) {
      where.clientId = clientId
    }

    const vehicles = await prisma.vehicle.findMany({
      where,
      include: { client: true, _count: { select: { serviceOrders: true } } },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(vehicles)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar veículos' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth()
    const body = await request.json()

    const vehicle = await prisma.vehicle.create({
      data: {
        ...body,
        companyId: session.companyId!,
      },
    })

    return NextResponse.json(vehicle, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar veículo' }, { status: 500 })
  }
}
