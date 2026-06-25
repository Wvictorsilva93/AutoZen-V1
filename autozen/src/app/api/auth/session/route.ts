import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ user: null })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        avatar: true,
        companyId: true,
        company: {
          select: { id: true, name: true, slug: true, logo: true },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ user: null })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Session error:', error)
    return NextResponse.json({ user: null })
  }
}
