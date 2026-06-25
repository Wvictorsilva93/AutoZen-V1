import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function GET() {
  try {
    const session = await requireAuth()
    if (!session.companyId) {
      const companies = await prisma.company.findMany({
        include: { _count: { select: { users: true, clients: true, vehicles: true, serviceOrders: true } } },
        orderBy: { createdAt: 'desc' },
      })
      return NextResponse.json(companies)
    }
    const company = await prisma.company.findUnique({
      where: { id: session.companyId },
      include: { _count: { select: { users: true, clients: true, vehicles: true, serviceOrders: true, products: true, financial: true } } },
    })
    return NextResponse.json(company)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar empresas' }, { status: 500 })
  }
}
