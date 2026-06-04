# 💻 Exemplos de Código - AutoZen

## 🔐 Integração com Supabase Auth

### 1. Configurar Cliente Supabase

**Arquivo:** `lib/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types para o banco
export type Tenant = {
  id: string;
  company_name: string;
  subdomain: string;
  created_at: string;
};

export type User = {
  id: string;
  tenant_id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'user';
};
```

### 2. Hook de Autenticação

**Arquivo:** `hooks/useAuth.ts`

```typescript
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Ouvir mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signUp = async (email: string, password: string, metadata: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };
}
```

### 3. LoginForm com Supabase

**Atualizar:** `components/auth/LoginForm.tsx`

```typescript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function LoginForm() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await signIn(email, password);

      if (error) {
        toast.error("Erro ao fazer login", {
          description: error.message,
        });
        return;
      }

      if (data.user) {
        toast.success("Login realizado com sucesso!");
        router.push("/dashboard");
      }
    } catch (err) {
      toast.error("Erro inesperado ao fazer login");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* ... inputs ... */}

      <Button type="submit" className="w-full mt-6" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Entrando...
          </>
        ) : (
          "Entrar no AutoZen"
        )}
      </Button>
    </form>
  );
}
```

---

## 🔒 Proteção de Rotas

### 1. Middleware de Autenticação

**Arquivo:** `middleware.ts`

```typescript
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Se não tiver sessão e tentar acessar rota protegida
  if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/';
    return NextResponse.redirect(redirectUrl);
  }

  // Se tiver sessão e tentar acessar login
  if (session && req.nextUrl.pathname === '/') {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/dashboard';
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: ['/', '/dashboard/:path*'],
};
```

### 2. Layout Protegido

**Arquivo:** `app/(dashboard)/layout.tsx`

```typescript
import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/');
  }

  return (
    <div className="flex h-screen bg-background-primary">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={session.user} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
```

---

## 📊 Fetch de Dados com React Query

### 1. Setup React Query

**Arquivo:** `app/layout.tsx`

```typescript
"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minuto
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

### 2. Hook Customizado para Clientes

**Arquivo:** `hooks/useClientes.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

type Cliente = {
  id: string;
  tenant_id: string;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  created_at: string;
};

export function useClientes() {
  const queryClient = useQueryClient();

  // Buscar todos os clientes
  const { data: clientes, isLoading, error } = useQuery({
    queryKey: ['clientes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Cliente[];
    },
  });

  // Criar cliente
  const createCliente = useMutation({
    mutationFn: async (newCliente: Omit<Cliente, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('clientes')
        .insert([newCliente])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
    },
  });

  // Atualizar cliente
  const updateCliente = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Cliente> & { id: string }) => {
      const { data, error } = await supabase
        .from('clientes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
    },
  });

  // Deletar cliente
  const deleteCliente = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('clientes')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
    },
  });

  return {
    clientes,
    isLoading,
    error,
    createCliente,
    updateCliente,
    deleteCliente,
  };
}
```

---

## 🎨 Componente de Tabela Reutilizável

**Arquivo:** `components/ui/data-table.tsx`

```typescript
"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  ColumnDef,
} from "@tanstack/react-table";
import { useState } from "react";
import { ArrowUpDown } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  return (
    <div className="glass-card overflow-hidden">
      <table className="w-full">
        <thead className="border-b border-white/8">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-4 text-left text-sm font-semibold text-text-primary"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-white/8 hover:bg-white/5 transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4 text-sm text-text-secondary">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-12 text-center text-text-secondary"
              >
                Nenhum resultado encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// Exemplo de uso:
export const clientesColumns: ColumnDef<Cliente>[] = [
  {
    accessorKey: "nome",
    header: "Nome",
  },
  {
    accessorKey: "email",
    header: "E-mail",
  },
  {
    accessorKey: "telefone",
    header: "Telefone",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <Button size="sm" variant="ghost">Editar</Button>
          <Button size="sm" variant="ghost">Excluir</Button>
        </div>
      );
    },
  },
];
```

---

## 📝 Validação com Zod

**Arquivo:** `lib/validations.ts`

```typescript
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
});

export const signupSchema = z.object({
  companyName: z.string().min(3, 'Nome da empresa deve ter no mínimo 3 caracteres'),
  responsibleName: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  whatsapp: z.string().regex(/^\(\d{2}\) \d{5}-\d{4}$/, 'WhatsApp inválido'),
  email: z.string().email('E-mail inválido'),
  password: z
    .string()
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Senha deve conter ao menos uma letra maiúscula')
    .regex(/[a-z]/, 'Senha deve conter ao menos uma letra minúscula')
    .regex(/[0-9]/, 'Senha deve conter ao menos um número'),
});

export const clienteSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  telefone: z.string().regex(/^\(\d{2}\) \d{5}-\d{4}$/, 'Telefone inválido'),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type ClienteInput = z.infer<typeof clienteSchema>;
```

**Usar no formulário:**

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginInput } from '@/lib/validations';

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    console.log(data); // Dados validados
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input {...register('email')} />
      {errors.email && <span className="text-red-400 text-sm">{errors.email.message}</span>}
      
      <Input type="password" {...register('password')} />
      {errors.password && <span className="text-red-400 text-sm">{errors.password.message}</span>}
      
      <Button type="submit">Entrar</Button>
    </form>
  );
}
```

---

## 📊 Dashboard com Métricas

**Arquivo:** `app/(dashboard)/dashboard/page.tsx`

```typescript
import { Suspense } from 'react';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import MetricCard from '@/components/dashboard/MetricCard';
import RecentClients from '@/components/dashboard/RecentClients';
import { Car, Coins, Calendar, FileText } from 'lucide-react';

async function getMetrics(tenantId: string) {
  const supabase = createServerComponentClient({ cookies });

  const [veiculos, caixa, agendamentos, ordens] = await Promise.all([
    supabase
      .from('veiculos')
      .select('id', { count: 'exact' })
      .eq('tenant_id', tenantId)
      .eq('status', 'em_atendimento'),

    supabase
      .from('financeiro')
      .select('valor')
      .eq('tenant_id', tenantId)
      .eq('data', new Date().toISOString().split('T')[0])
      .then(({ data }) => 
        data?.reduce((acc, curr) => acc + curr.valor, 0) || 0
      ),

    supabase
      .from('agendamentos')
      .select('id', { count: 'exact' })
      .eq('tenant_id', tenantId)
      .eq('data', new Date().toISOString().split('T')[0]),

    supabase
      .from('ordens_servico')
      .select('id', { count: 'exact' })
      .eq('tenant_id', tenantId)
      .eq('status', 'em_andamento'),
  ]);

  return {
    veiculos: veiculos.count || 0,
    caixa: caixa,
    agendamentos: agendamentos.count || 0,
    ordens: ordens.count || 0,
  };
}

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const tenantId = session?.user?.user_metadata?.tenant_id;
  const metrics = await getMetrics(tenantId);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          icon={Car}
          title="Veículos em Atendimento"
          value={metrics.veiculos}
          trend="+12%"
          trendUp
        />
        <MetricCard
          icon={Coins}
          title="Caixa do Dia"
          value={`R$ ${metrics.caixa.toLocaleString('pt-BR')}`}
          trend="+8%"
          trendUp
        />
        <MetricCard
          icon={Calendar}
          title="Agendamentos Hoje"
          value={metrics.agendamentos}
          trend="-5%"
          trendUp={false}
        />
        <MetricCard
          icon={FileText}
          title="OS Abertas"
          value={metrics.ordens}
          trend="+3%"
          trendUp
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense fallback={<div>Carregando...</div>}>
          <RecentClients tenantId={tenantId} />
        </Suspense>
      </div>
    </div>
  );
}
```

---

## 🎨 Componente de Modal

**Arquivo:** `components/ui/dialog.tsx`

```typescript
"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;

const DialogContent = ({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" />
    <DialogPrimitive.Content
      className={cn(
        "fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%]",
        "w-full max-w-lg glass-card-premium p-8",
        "animate-fade-in",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-6 top-6 rounded-lg p-2 hover:bg-white/10 transition-colors">
        <X className="h-4 w-4" />
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
);

export { Dialog, DialogTrigger, DialogContent };

// Exemplo de uso:
<Dialog>
  <DialogTrigger asChild>
    <Button>Novo Cliente</Button>
  </DialogTrigger>
  <DialogContent>
    <h2 className="text-2xl font-bold mb-6">Novo Cliente</h2>
    <ClienteForm onSuccess={() => {/* fechar modal */}} />
  </DialogContent>
</Dialog>
```

---

Estes exemplos cobrem os casos de uso mais comuns! 🚀
