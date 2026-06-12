import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { ENV } from '@/lib/env';

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

    if (!ENV.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: 'SUPABASE_SERVICE_ROLE_KEY não configurada no servidor.' },
        { status: 503 }
      );
    }

    const cookieStore = await cookies();
    const supabase = createServerClient(
      ENV.SUPABASE_URL,
      ENV.SUPABASE_SERVICE_ROLE_KEY,
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

    // 1. Cria a empresa (schema real: name, responsible_name, phone)
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .insert({
        name: company_name,
        responsible_name: responsible,
        phone: whatsapp,
        plan: 'basic',
        status: 'active',
      })
      .select('id')
      .single();

    if (companyError) {
      return NextResponse.json({ error: companyError.message }, { status: 500 });
    }

    // 2. Cria o usuário no Auth. O trigger handle_new_user cria o profile
    //    lendo company_id/name/role/phone do user_metadata.
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name: responsible,
        role: 'admin',
        company_id: company.id,
        phone: whatsapp,
      },
    });

    if (authError) {
      // Rollback da empresa criada
      await supabase.from('companies').delete().eq('id', company.id);
      return NextResponse.json({ error: authError.message }, { status: 500 });
    }

    // 3. Garante o vínculo do profile (defensivo, caso o trigger não preencha)
    await supabase
      .from('profiles')
      .upsert(
        {
          user_id: authData.user.id,
          company_id: company.id,
          name: responsible,
          role: 'admin',
          email,
          phone: whatsapp,
        },
        { onConflict: 'user_id' }
      );

    return NextResponse.json({ success: true, company_id: company.id });
  } catch (error) {
    const raw = error instanceof Error ? error.message : String(error);
    console.error('[register] erro:', raw);

    const isConnError =
      raw.includes('fetch failed') ||
      raw.includes('ENOTFOUND') ||
      raw.includes('getaddrinfo');

    if (isConnError) {
      return NextResponse.json(
        {
          error:
            'Não foi possível conectar ao Supabase. Verifique se o projeto existe e as variáveis em .env.local.',
        },
        { status: 503 }
      );
    }

    return NextResponse.json({ error: raw }, { status: 500 });
  }
}
