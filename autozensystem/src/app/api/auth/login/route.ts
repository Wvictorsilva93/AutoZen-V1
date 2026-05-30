import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/utils/supabase'

export async function POST(request: Request) {
  const { email, password } = await request.json()

  const supabase = createSupabaseServerClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  // Optionally, set session cookie or redirect
  // For now, return the session
  return NextResponse.json({ session: data.session })
}