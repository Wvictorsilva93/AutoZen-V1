import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, createToken } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, companyName, phone } = body

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Nome, email e senha são obrigatórios' }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: 'Email já cadastrado' }, { status: 400 })
    }

    const hashedPassword = await hashPassword(password)
    const slug = companyName
      ? companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      : email.split('@')[0]

    let company = null
    if (companyName) {
      company = await prisma.company.create({
        data: {
          name: companyName,
          slug,
        },
      })
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: company ? 'admin' : 'employee',
        phone,
        companyId: company?.id,
      },
    })

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
      },
    })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
