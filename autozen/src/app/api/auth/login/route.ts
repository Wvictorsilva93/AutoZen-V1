import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, createToken } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: 'Email e senha são obrigatórios' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { company: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 })
    }

    if (!user.active) {
      return NextResponse.json({ error: 'Conta desativada' }, { status: 403 })
    }

    const isValidPassword = await verifyPassword(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 })
    }

    if (user.company && !user.company.active) {
      return NextResponse.json({ error: 'Empresa desativada' }, { status: 403 })
    }

    const token = await createToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      companyId: user.companyId || undefined,
    })

    const cookieStore = await cookies()
    cookieStore.set('autozen-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
        company: user.company ? { name: user.company.name, slug: user.company.slug } : null,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
