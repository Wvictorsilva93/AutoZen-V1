import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || ''

    const where: Record<string, unknown> = { companyId: session.companyId }
    if (status) {
      where.status = status
    }

    const orders = await prisma.serviceOrder.findMany({
      where,
      include: {
        client: true,
        vehicle: true,
        creator: { select: { name: true } },
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(orders)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar ordens de serviço' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth()
    const body = await request.json()

    const lastOrder = await prisma.serviceOrder.findFirst({
      where: { companyId: session.companyId },
      orderBy: { number: 'desc' },
    })

    const order = await prisma.serviceOrder.create({
      data: {
        ...body,
        number: (lastOrder?.number || 1000) + 1,
        companyId: session.companyId!,
        creatorId: session.userId,
        items: body.items ? {
          create: body.items,
        } : undefined,
      },
      include: {
        client: true,
        vehicle: true,
        items: true,
      },
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar ordem de serviço' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await requireAuth()
    const body = await request.json()
    const { id, items, ...data } = body

    if (items) {
      await prisma.serviceItem.deleteMany({ where: { serviceOrderId: id } })
    }

    const order = await prisma.serviceOrder.update({
      where: { id },
      data: {
        ...data,
        ...(items ? { items: { create: items } } : {}),
      },
      include: {
        client: true,
        vehicle: true,
        items: true,
      },
    })

    return NextResponse.json(order)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar ordem de serviço' }, { status: 500 })
  }
}
