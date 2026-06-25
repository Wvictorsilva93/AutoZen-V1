import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth()
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const lowStock = searchParams.get('lowStock') === 'true'

    const where: Record<string, unknown> = { companyId: session.companyId, active: true }
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { sku: { contains: search } },
        { category: { contains: search } },
      ]
    }
    if (lowStock) {
      where.stockQuantity = { lte: prisma.product.fields?.minStock }
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar produtos' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth()
    const body = await request.json()

    const product = await prisma.product.create({
      data: {
        ...body,
        companyId: session.companyId!,
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar produto' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...data } = body

    const product = await prisma.product.update({
      where: { id },
      data,
    })

    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar produto' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    await prisma.product.update({
      where: { id: id! },
      data: { active: false },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao deletar produto' }, { status: 500 })
  }
}
