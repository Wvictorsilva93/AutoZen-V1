import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'autozen-secret-key-change-in-production-2024')

export interface JWTPayload {
  userId: string
  email: string
  name: string
  role: string
  companyId?: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function createToken(payload: JWTPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET)
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET)
    return payload as unknown as JWTPayload
  } catch {
    return null
  }
}

export async function getSession(): Promise<JWTPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('autozen-token')?.value
  if (!token) return null
  return verifyToken(token)
}

export async function requireAuth(): Promise<JWTPayload> {
  const session = await getSession()
  if (!session) {
    throw new Error('Unauthorized')
  }
  return session
}

export async function requireAdmin(): Promise<JWTPayload> {
  const session = await requireAuth()
  if (session.role !== 'super_admin' && session.role !== 'admin') {
    throw new Error('Forbidden')
  }
  return session
}

export async function requireSuperAdmin(): Promise<JWTPayload> {
  const session = await requireAuth()
  if (session.role !== 'super_admin') {
    throw new Error('Forbidden')
  }
  return session
}
