import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function GET() {
  try {
    const session = await requireAuth()

    if (session.role === 'super_admin') {
      const [totalCompanies, totalUsers, totalClients, totalOrders, companies] = await Promise.all([
        prisma.company.count(),
        prisma.user.count(),
        prisma.client.count(),
        prisma.serviceOrder.count(),
        prisma.company.findMany({
          select: { id: true, name: true, plan: true, active: true },
          orderBy: { createdAt: 'desc' },
          take: 10,
        }),
      ])

      const totalRevenue = await prisma.financialRecord.aggregate({
        where: { type: 'income', status: 'paid' },
        _sum: { amount: true },
      })

      return NextResponse.json({
        type: 'super_admin',
        stats: {
          totalCompanies,
          totalUsers,
          totalClients,
          totalOrders,
          totalRevenue: totalRevenue._sum.amount || 0,
        },
        recentCompanies: companies,
      })
    }

    const companyId = session.companyId
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)

    const [
      totalClients,
      totalVehicles,
      totalProducts,
      pendingOrders,
      inProgressOrders,
      completedOrders,
      deliveredOrders,
      monthlyRevenue,
      monthlyExpenses,
      recentOrders,
      lowStockProducts,
      upcomingAppointments,
    ] = await Promise.all([
      prisma.client.count({ where: { companyId, active: true } }),
      prisma.vehicle.count({ where: { companyId } }),
      prisma.product.count({ where: { companyId, active: true } }),
      prisma.serviceOrder.count({ where: { companyId, status: 'pending' } }),
      prisma.serviceOrder.count({ where: { companyId, status: 'in_progress' } }),
      prisma.serviceOrder.count({ where: { companyId, status: 'completed' } }),
      prisma.serviceOrder.count({ where: { companyId, status: 'delivered' } }),
      prisma.financialRecord.aggregate({
        where: { companyId, type: 'income', status: 'paid', paidDate: { gte: startOfMonth, lte: endOfMonth } },
        _sum: { amount: true },
      }),
      prisma.financialRecord.aggregate({
        where: { companyId, type: 'expense', status: 'paid', paidDate: { gte: startOfMonth, lte: endOfMonth } },
        _sum: { amount: true },
      }),
      prisma.serviceOrder.findMany({
        where: { companyId },
        include: { client: true, vehicle: true },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      prisma.product.findMany({
        where: { companyId, active: true, stockQuantity: { lte: 10 } },
        take: 5,
      }),
      prisma.appointment.findMany({
        where: { companyId, date: { gte: now } },
        include: { client: true, vehicle: true },
        orderBy: { date: 'asc' },
        take: 5,
      }),
    ])

    const totalOrders = pendingOrders + inProgressOrders + completedOrders + deliveredOrders
    const averageTicket = totalOrders > 0 ? (monthlyRevenue._sum.amount || 0) / totalOrders : 0

    return NextResponse.json({
      type: 'company',
      stats: {
        totalClients,
        totalVehicles,
        totalProducts,
        pendingOrders,
        inProgressOrders,
        completedOrders,
        deliveredOrders,
        totalOrders,
        monthlyRevenue: monthlyRevenue._sum.amount || 0,
        monthlyExpenses: monthlyExpenses._sum.amount || 0,
        netProfit: (monthlyRevenue._sum.amount || 0) - (monthlyExpenses._sum.amount || 0),
        averageTicket,
      },
      recentOrders,
      lowStockProducts,
      upcomingAppointments,
    })
  } catch (error) {
    console.error('Dashboard error:', error)
    return NextResponse.json({ error: 'Erro ao buscar dados do dashboard' }, { status: 500 })
  }
}
