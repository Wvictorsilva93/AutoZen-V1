import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, company_name, responsible, whatsapp } = body;

    if (!email || !password || !company_name || !responsible || !whatsapp) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Read-only in Server Component
            }
          },
        },
      }
    );

    // 1. Create company
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .insert({
        name: company_name,
        responsible,
        whatsapp,
        email,
        subscription_status: 'trial',
      })
      .select()
      .single();

    if (companyError) {
      return NextResponse.json({ error: companyError.message }, { status: 500 });
    }

    // 2. Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { company_name, responsible, whatsapp },
    });

    if (authError) {
      // Rollback company
      await supabase.from('companies').delete().eq('id', company.id);
      return NextResponse.json({ error: authError.message }, { status: 500 });
    }

    // 3. Create user record
    const { error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        company_id: company.id,
        email,
        name: responsible,
        role: 'admin_empresa',
      });

    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, company_id: company.id });
  } catch (error) {
    const raw = error instanceof Error ? error.message : String(error);
    console.error('[register] erro:', raw);

    // Falha de conexão com o Supabase (projeto inexistente/pausado/offline)
    const isConnError =
      raw.includes('fetch failed') ||
      raw.includes('ENOTFOUND') ||
      raw.includes('getaddrinfo');

    if (isConnError) {
      return NextResponse.json(
        {
          error:
            'Não foi possível conectar ao Supabase. Verifique se o projeto existe e se as variáveis NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY estão corretas em .env.local.',
        },
        { status: 503 }
      );
    }

    return NextResponse.json({ error: raw }, { status: 500 });
  }
}
