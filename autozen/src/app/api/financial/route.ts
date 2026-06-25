import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth()
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || ''
    const status = searchParams.get('status') || ''

    const where: Record<string, unknown> = { companyId: session.companyId }
    if (type) where.type = type
    if (status) where.status = status

    const records = await prisma.financialRecord.findMany({
      where,
      orderBy: { dueDate: 'desc' },
    })

    return NextResponse.json(records)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar registros financeiros' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth()
    const body = await request.json()

    const record = await prisma.financialRecord.create({
      data: {
        ...body,
        companyId: session.companyId!,
      },
    })

    return NextResponse.json(record, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar registro financeiro' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...data } = body

    const record = await prisma.financialRecord.update({
      where: { id },
      data,
    })

    return NextResponse.json(record)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar registro financeiro' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    await prisma.financialRecord.delete({ where: { id: id! } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao deletar registro financeiro' }, { status: 500 })
  }
}
