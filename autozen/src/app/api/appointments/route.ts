import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth()
    const { searchParams } = new URL(request.url)
    const month = searchParams.get('month')
    const year = searchParams.get('year')

    const where: Record<string, unknown> = { companyId: session.companyId }
    if (month && year) {
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1)
      const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59)
      where.date = { gte: startDate, lte: endDate }
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: { client: true, vehicle: true },
      orderBy: { date: 'asc' },
    })

    return NextResponse.json(appointments)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar agendamentos' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth()
    const body = await request.json()

    const appointment = await prisma.appointment.create({
      data: {
        ...body,
        companyId: session.companyId!,
      },
      include: { client: true, vehicle: true },
    })

    return NextResponse.json(appointment, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar agendamento' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...data } = body

    const appointment = await prisma.appointment.update({
      where: { id },
      data,
      include: { client: true, vehicle: true },
    })

    return NextResponse.json(appointment)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar agendamento' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    await prisma.appointment.delete({ where: { id: id! } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao deletar agendamento' }, { status: 500 })
  }
}
