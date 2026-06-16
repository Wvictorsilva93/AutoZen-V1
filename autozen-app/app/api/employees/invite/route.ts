import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { ENV } from '@/lib/env';

export async function POST(request: Request) {
  try {
    const { email, password, name, phone, role } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Nome, email e senha são obrigatórios' }, { status: 400 });
    }
    if (!ENV.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: 'Servidor sem SUPABASE_SERVICE_ROLE_KEY' }, { status: 503 });
    }

    const cookieStore = await cookies();
    // Cliente com a sessão do solicitante (para validar empresa/role)
    const authedClient = createServerClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY, {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll() { /* read-only */ },
      },
    });

    const { data: auth } = await authedClient.auth.getUser();
    if (!auth.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const { data: caller } = await authedClient
      .from('profiles')
      .select('company_id, role')
      .eq('user_id', auth.user.id)
      .single();

    if (!caller?.company_id || (caller.role !== 'admin_empresa' && caller.role !== 'super_admin')) {
      return NextResponse.json({ error: 'Apenas administradores podem criar acessos' }, { status: 403 });
    }

    const finalRole = role === 'admin_empresa' ? 'admin_empresa' : 'funcionario';

    // Cliente admin (service role) para criar o usuário
    const admin = createServerClient(ENV.SUPABASE_URL, ENV.SUPABASE_SERVICE_ROLE_KEY, {
      cookies: { getAll() { return cookieStore.getAll(); }, setAll() {} },
    });

    const { data: created, error: authErr } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name, role: finalRole, company_id: caller.company_id, phone: phone ?? '' },
    });

    if (authErr) {
      return NextResponse.json({ error: authErr.message }, { status: 500 });
    }

    // Garante o profile vinculado à mesma empresa
    await admin.from('profiles').upsert(
      { user_id: created.user.id, company_id: caller.company_id, name, role: finalRole, email, phone: phone ?? null },
      { onConflict: 'user_id' }
    );

    return NextResponse.json({ success: true, user_id: created.user.id });
  } catch (error) {
    const raw = error instanceof Error ? error.message : String(error);
    console.error('[invite] erro:', raw);
    return NextResponse.json({ error: raw }, { status: 500 });
  }
}
