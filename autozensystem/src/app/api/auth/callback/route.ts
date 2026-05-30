import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/utils/supabase'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = createSupabaseServerClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Redirect to the provided next URL or default to dashboard
  return NextResponse.redirect(new URL(next, request.url))
}