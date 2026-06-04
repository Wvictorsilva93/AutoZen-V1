# 💻 AutoZen - Exemplos de Código V4

## 📋 Índice

1. [API Routes Completas](#api-routes-completas)
2. [Server Components](#server-components)
3. [Client Components](#client-components)
4. [Hooks Customizados](#hooks-customizados)
5. [Database Queries](#database-queries)
6. [Helpers e Utilities](#helpers-e-utilities)

---

## 🌐 API Routes Completas

### Clientes API - CRUD Completo

```typescript
// app/api/v1/clients/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { ClientSchema } from '@/validators/schemas';
import { apiResponse, apiError } from '@/lib/api/response';
import { parsePagination, calculatePagination } from '@/lib/api/pagination';
import { hasPermission } from '@/lib/auth/permissions';
import { z } from 'zod';

// GET /api/v1/clients - Listar clientes
export async function GET(req: NextRequest) {
  try {
    const supabase = createServerClient();
    
    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        apiError('Unauthorized'),
        { status: 401 }
      );
    }
    
    // Verificar permissão
    const canRead = await hasPermission('clients', 'read');
    if (!canRead) {
      return NextResponse.json(
        apiError('Forbidden'),
        { status: 403 }
      );
    }
    
    // Buscar company_id do usuário
    const { data: profile } = await supabase
      .from('profiles')
      .select('company_id')
      .eq('id', user.id)
      .single();
    
    if (!profile) {
      return NextResponse.json(
        apiError('Profile not found'),
        { status: 404 }
      );
    }
    
    // Parse query params
    const searchParams = req.nextUrl.searchParams;
    const { page, perPage } = parsePagination(searchParams);
    const search = searchParams.get('search') || '';
    const orderBy = searchParams.get('orderBy') || 'nome';
    const order = searchParams.get('order') || 'asc';
    
    // Count total
    const { count } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', profile.company_id)
      .is('deleted_at', null)
      .ilike('nome', `%${search}%`);
    
    // Query com paginação
    let query = supabase
      .from('clients')
      .select('*')
      .eq('company_id', profile.company_id)
      .is('deleted_at', null)
      .range((page - 1) * perPage, page * perPage - 1)
      .order(orderBy, { ascending: order === 'asc' });
    
    // Filtro de busca
    if (search) {
      query = query.or(`nome.ilike.%${search}%,telefone.ilike.%${search}%`);
    }
    
    const { data: clients, error } = await query;
    
    if (error) {
      return NextResponse.json(
        apiError(error.message),
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      apiResponse(
        clients,
        'Clientes listados com sucesso',
        calculatePagination(count || 0, page, perPage)
      )
    );
    
  } catch (error) {
    console.error('GET /api/v1/clients error:', error);
    return NextResponse.json(
      apiError('Internal server error'),
      { status: 500 }
    );
  }
}

// POST /api/v1/clients - Criar cliente
export async function POST(req: NextRequest) {
  try {
    const supabase = createServerClient();
    
    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        apiError('Unauthorized'),
        { status: 401 }
      );
    }
    
    // Verificar permissão
    const canCreate = await hasPermission('clients', 'create');
    if (!canCreate) {
      return NextResponse.json(
        apiError('Forbidden'),
        { status: 403 }
      );
    }
    
    // Parse e validar body
    const body = await req.json();
    const validated = ClientSchema.parse(body);
    
    // Buscar company_id
    const { data: profile } = await supabase
      .from('profiles')
      .select('company_id')
      .eq('id', user.id)
      .single();
    
    if (!profile) {
      return NextResponse.json(
        apiError('Profile not found'),
        { status: 404 }
      );
    }
    
    // Inserir
    const { data: client, error } = await supabase
      .from('clients')
      .insert({
        ...validated,
        company_id: profile.company_id,
        created_by: user.id,
        updated_by: user.id,
      })
      .select()
      .single();
    
    if (error) {
      return NextResponse.json(
        apiError(error.message),
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      apiResponse(client, 'Cliente criado com sucesso'),
      { status: 201 }
    );
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        apiError('Validation error', error.flatten().fieldErrors),
        { status: 400 }
      );
    }
    
    console.error('POST /api/v1/clients error:', error);
    return NextResponse.json(
      apiError('Internal server error'),
      { status: 500 }
    );
  }
}
```

### Cliente Individual - GET/PUT/DELETE

```typescript
// app/api/v1/clients/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { ClientSchema } from '@/validators/schemas';
import { apiResponse, apiError } from '@/lib/api/response';
import { hasPermission } from '@/lib/auth/permissions';
import { z } from 'zod';

// GET /api/v1/clients/:id - Buscar um cliente
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient();
    
    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        apiError('Unauthorized'),
        { status: 401 }
      );
    }
    
    // Verificar permissão
    const canRead = await hasPermission('clients', 'read');
    if (!canRead) {
      return NextResponse.json(
        apiError('Forbidden'),
        { status: 403 }
      );
    }
    
    // Buscar company_id
    const { data: profile } = await supabase
      .from('profiles')
      .select('company_id')
      .eq('id', user.id)
      .single();
    
    // Buscar cliente
    const { data: client, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', params.id)
      .eq('company_id', profile!.company_id)
      .is('deleted_at', null)
      .single();
    
    if (error || !client) {
      return NextResponse.json(
        apiError('Cliente não encontrado'),
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      apiResponse(client, 'Cliente encontrado')
    );
    
  } catch (error) {
    console.error('GET /api/v1/clients/:id error:', error);
    return NextResponse.json(
      apiError('Internal server error'),
      { status: 500 }
    );
  }
}

// PUT /api/v1/clients/:id - Atualizar cliente
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient();
    
    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        apiError('Unauthorized'),
        { status: 401 }
      );
    }
    
    // Verificar permissão
    const canUpdate = await hasPermission('clients', 'update');
    if (!canUpdate) {
      return NextResponse.json(
        apiError('Forbidden'),
        { status: 403 }
      );
    }
    
    // Parse e validar body
    const body = await req.json();
    const validated = ClientSchema.parse(body);
    
    // Buscar company_id
    const { data: profile } = await supabase
      .from('profiles')
      .select('company_id')
      .eq('id', user.id)
      .single();
    
    // Atualizar
    const { data: client, error } = await supabase
      .from('clients')
      .update({
        ...validated,
        updated_by: user.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .eq('company_id', profile!.company_id)
      .is('deleted_at', null)
      .select()
      .single();
    
    if (error || !client) {
      return NextResponse.json(
        apiError('Cliente não encontrado ou erro ao atualizar'),
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      apiResponse(client, 'Cliente atualizado com sucesso')
    );
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        apiError('Validation error', error.flatten().fieldErrors),
        { status: 400 }
      );
    }
    
    console.error('PUT /api/v1/clients/:id error:', error);
    return NextResponse.json(
      apiError('Internal server error'),
      { status: 500 }
    );
  }
}

// DELETE /api/v1/clients/:id - Soft delete cliente
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient();
    
    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        apiError('Unauthorized'),
        { status: 401 }
      );
    }
    
    // Verificar permissão
    const canDelete = await hasPermission('clients', 'delete');
    if (!canDelete) {
      return NextResponse.json(
        apiError('Forbidden'),
        { status: 403 }
      );
    }
    
    // Buscar company_id
    const { data: profile } = await supabase
      .from('profiles')
      .select('company_id')
      .eq('id', user.id)
      .single();
    
    // Soft delete
    const { error } = await supabase
      .from('clients')
      .update({
        deleted_at: new Date().toISOString(),
        deleted_by: user.id,
      })
      .eq('id', params.id)
      .eq('company_id', profile!.company_id)
      .is('deleted_at', null);
    
    if (error) {
      return NextResponse.json(
        apiError('Erro ao deletar cliente'),
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      apiResponse(null, 'Cliente deletado com sucesso')
    );
    
  } catch (error) {
    console.error('DELETE /api/v1/clients/:id error:', error);
    return NextResponse.json(
      apiError('Internal server error'),
      { status: 500 }
    );
  }
}
```

---

## 🖥️ Server Components

### Dashboard Page - Server Component

```typescript
// app/(app)/dashboard/page.tsx
import { createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { DashboardKPIs } from '@/components/dashboard/kpis';
import { RevenueChart } from '@/components/dashboard/revenue-chart';
import { RecentOrders } from '@/components/dashboard/recent-orders';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata = {
  title: 'Dashboard | AutoZen',
  description: 'Visão geral do seu negócio',
};

async function getCompanyData() {
  const supabase = createServerClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*, companies(*)')
    .eq('id', user.id)
    .single();
  
  return profile;
}

export default async function DashboardPage() {
  const profile = await getCompanyData();
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Bem-vindo, {profile.nome} - {profile.companies.nome_fantasia}
        </p>
      </div>
      
      {/* KPIs */}
      <Suspense fallback={<Skeleton className="h-32" />}>
        <DashboardKPIs companyId={profile.company_id} />
      </Suspense>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense fallback={<Skeleton className="h-64" />}>
          <RevenueChart companyId={profile.company_id} />
        </Suspense>
        
        <Suspense fallback={<Skeleton className="h-64" />}>
          <RecentOrders companyId={profile.company_id} />
        </Suspense>
      </div>
    </div>
  );
}
```

### Clientes Page - com Server Component

```typescript
// app/(app)/clientes/page.tsx
import { createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ClientsTable } from '@/components/tables/clients-table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusIcon } from 'lucide-react';

async function getClients(companyId: string, search: string = '') {
  const supabase = createServerClient();
  
  let query = supabase
    .from('clients')
    .select('*')
    .eq('company_id', companyId)
    .is('deleted_at', null)
    .order('nome', { ascending: true })
    .limit(50);
  
  if (search) {
    query = query.or(`nome.ilike.%${search}%,telefone.ilike.%${search}%`);
  }
  
  const { data } = await query;
  return data || [];
}

export default async function ClientesPage({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  const supabase = createServerClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('company_id')
    .eq('id', user.id)
    .single();
  
  const clients = await getClients(
    profile!.company_id,
    searchParams.search
  );
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Clientes</h1>
          <p className="text-muted-foreground">
            Gerencie sua base de clientes
          </p>
        </div>
        
        <Link href="/clientes/novo">
          <Button>
            <PlusIcon className="w-4 h-4 mr-2" />
            Novo Cliente
          </Button>
        </Link>
      </div>
      
      <ClientsTable data={clients} />
    </div>
  );
}
```

---


## 🎨 Client Components

### ClientForm - Form com React Hook Form + Zod

```typescript
// components/forms/client-form.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ClientSchema } from '@/validators/schemas';
import { useRouter } from 'next/navigation';
import type { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';

type ClientFormData = z.infer<typeof ClientSchema>;

interface ClientFormProps {
  initialData?: Partial<ClientFormData>;
  clientId?: string;
}

export function ClientForm({ initialData, clientId }: ClientFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ClientFormData>({
    resolver: zodResolver(ClientSchema),
    defaultValues: initialData || {
      tipo: 'PF',
    },
  });
  
  const tipo = watch('tipo');
  
  const onSubmit = async (data: ClientFormData) => {
    try {
      setIsLoading(true);
      
      const url = clientId
        ? `/api/v1/clients/${clientId}`
        : '/api/v1/clients';
      
      const method = clientId ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const result = await res.json();
      
      if (!res.ok) {
        throw new Error(result.error || 'Erro ao salvar cliente');
      }
      
      toast({
        title: 'Sucesso!',
        description: clientId
          ? 'Cliente atualizado com sucesso'
          : 'Cliente criado com sucesso',
      });
      
      router.push('/clientes');
      router.refresh();
      
    } catch (error) {
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Tipo */}
      <div className="space-y-2">
        <Label htmlFor="tipo">Tipo</Label>
        <Select
          value={tipo}
          onValueChange={(value) => setValue('tipo', value as 'PF' | 'PJ')}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PF">Pessoa Física</SelectItem>
            <SelectItem value="PJ">Pessoa Jurídica</SelectItem>
          </SelectContent>
        </Select>
        {errors.tipo && (
          <p className="text-sm text-red-500">{errors.tipo.message}</p>
        )}
      </div>
      
      {/* Nome */}
      <div className="space-y-2">
        <Label htmlFor="nome">Nome Completo *</Label>
        <Input
          id="nome"
          {...register('nome')}
          placeholder="João da Silva"
        />
        {errors.nome && (
          <p className="text-sm text-red-500">{errors.nome.message}</p>
        )}
      </div>
      
      {/* CPF ou CNPJ */}
      {tipo === 'PF' ? (
        <div className="space-y-2">
          <Label htmlFor="cpf">CPF *</Label>
          <Input
            id="cpf"
            {...register('cpf')}
            placeholder="000.000.000-00"
            maxLength={14}
          />
          {errors.cpf && (
            <p className="text-sm text-red-500">{errors.cpf.message}</p>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="cnpj">CNPJ *</Label>
          <Input
            id="cnpj"
            {...register('cnpj')}
            placeholder="00.000.000/0000-00"
            maxLength={18}
          />
          {errors.cnpj && (
            <p className="text-sm text-red-500">{errors.cnpj.message}</p>
          )}
        </div>
      )}
      
      {/* Telefone e WhatsApp */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="telefone">Telefone *</Label>
          <Input
            id="telefone"
            {...register('telefone')}
            placeholder="(11) 99999-9999"
          />
          {errors.telefone && (
            <p className="text-sm text-red-500">{errors.telefone.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="whatsapp">WhatsApp *</Label>
          <Input
            id="whatsapp"
            {...register('whatsapp')}
            placeholder="(11) 99999-9999"
          />
          {errors.whatsapp && (
            <p className="text-sm text-red-500">{errors.whatsapp.message}</p>
          )}
        </div>
      </div>
      
      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          placeholder="cliente@email.com"
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>
      
      {/* Endereço */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Endereço</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cep">CEP</Label>
            <Input
              id="cep"
              {...register('cep')}
              placeholder="01310-100"
            />
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="logradouro">Logradouro</Label>
            <Input
              id="logradouro"
              {...register('logradouro')}
              placeholder="Av. Paulista"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="numero">Número</Label>
            <Input
              id="numero"
              {...register('numero')}
              placeholder="1000"
            />
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="complemento">Complemento</Label>
            <Input
              id="complemento"
              {...register('complemento')}
              placeholder="Apto 101"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bairro">Bairro</Label>
            <Input
              id="bairro"
              {...register('bairro')}
              placeholder="Centro"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cidade">Cidade</Label>
            <Input
              id="cidade"
              {...register('cidade')}
              placeholder="São Paulo"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="estado">Estado</Label>
            <Input
              id="estado"
              {...register('estado')}
              placeholder="SP"
              maxLength={2}
            />
          </div>
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Salvando...' : clientId ? 'Atualizar' : 'Criar'}
        </Button>
      </div>
    </form>
  );
}
```

### ClientsTable - Tabela com TanStack Table

```typescript
// components/tables/clients-table.tsx
'use client';

import { useState } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, Edit, Trash } from 'lucide-react';
import Link from 'next/link';

interface Client {
  id: string;
  tipo: 'PF' | 'PJ';
  nome: string;
  cpf?: string;
  cnpj?: string;
  telefone: string;
  whatsapp: string;
  email?: string;
  created_at: string;
}

interface ClientsTableProps {
  data: Client[];
}

export function ClientsTable({ data }: ClientsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  
  const columns: ColumnDef<Client>[] = [
    {
      accessorKey: 'nome',
      header: 'Nome',
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('nome')}</div>
      ),
    },
    {
      accessorKey: 'tipo',
      header: 'Tipo',
      cell: ({ row }) => (
        <Badge variant={row.getValue('tipo') === 'PF' ? 'default' : 'secondary'}>
          {row.getValue('tipo')}
        </Badge>
      ),
    },
    {
      id: 'documento',
      header: 'CPF/CNPJ',
      cell: ({ row }) => {
        const client = row.original;
        return client.tipo === 'PF' ? client.cpf : client.cnpj;
      },
    },
    {
      accessorKey: 'telefone',
      header: 'Telefone',
    },
    {
      accessorKey: 'whatsapp',
      header: 'WhatsApp',
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const client = row.original;
        
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/clientes/${client.id}`}>
                  <Eye className="w-4 h-4 mr-2" />
                  Visualizar
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/clientes/${client.id}/editar`}>
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => handleDelete(client.id)}
              >
                <Trash className="w-4 h-4 mr-2" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      globalFilter,
    },
  });
  
  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este cliente?')) {
      return;
    }
    
    try {
      const res = await fetch(`/api/v1/clients/${id}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        window.location.reload();
      }
    } catch (error) {
      alert('Erro ao excluir cliente');
    }
  };
  
  return (
    <div className="space-y-4">
      {/* Busca */}
      <div className="flex items-center gap-4">
        <Input
          placeholder="Buscar clientes..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>
      
      {/* Tabela */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Nenhum cliente encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
```

---

## 🪝 Hooks Customizados

### useUser - Hook para dados do usuário

```typescript
// hooks/use-user.ts
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

interface Profile {
  id: string;
  company_id: string;
  nome: string;
  role: string;
  avatar_url?: string;
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const supabase = createClient();
    
    // Buscar usuário e profile
    const fetchUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          setProfile(profile);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
    
    // Listener para mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    
    return () => subscription.unsubscribe();
  }, []);
  
  return {
    user,
    profile,
    loading,
    isAuthenticated: !!user,
  };
}
```

### usePermission - Hook para verificar permissões

```typescript
// hooks/use-permission.ts
'use client';

import { useEffect, useState } from 'react';
import { useUser } from './use-user';

export function usePermission(resource: string, action: string) {
  const { profile, loading: userLoading } = useUser();
  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkPermission = async () => {
      if (userLoading || !profile) {
        return;
      }
      
      try {
        // Super admin tem acesso total
        if (profile.role === 'super_admin') {
          setHasPermission(true);
          return;
        }
        
        // Verificar permissão via API
        const res = await fetch(
          `/api/v1/permissions/check?resource=${resource}&action=${action}`
        );
        
        const data = await res.json();
        setHasPermission(data.allowed);
        
      } catch (error) {
        console.error('Error checking permission:', error);
        setHasPermission(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkPermission();
  }, [profile, resource, action, userLoading]);
  
  return {
    hasPermission,
    loading: loading || userLoading,
  };
}
```

### useClients - Hook para gerenciar clientes

```typescript
// hooks/use-clients.ts
'use client';

import { useEffect, useState } from 'react';
import useSWR from 'swr';

interface Client {
  id: string;
  nome: string;
  tipo: 'PF' | 'PJ';
  telefone: string;
  whatsapp: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useClients(search: string = '') {
  const { data, error, mutate } = useSWR(
    `/api/v1/clients?search=${search}`,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );
  
  return {
    clients: data?.data || [],
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}

export function useClient(id: string) {
  const { data, error, mutate } = useSWR(
    id ? `/api/v1/clients/${id}` : null,
    fetcher
  );
  
  return {
    client: data?.data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}
```

---

## 📊 Database Queries

### Queries com Supabase - Exemplos Práticos

```typescript
// lib/queries/clients.ts
import { createServerClient } from '@/lib/supabase/server';

export async function getClients(companyId: string, params: {
  search?: string;
  page?: number;
  perPage?: number;
  orderBy?: string;
  order?: 'asc' | 'desc';
}) {
  const supabase = createServerClient();
  
  const {
    search = '',
    page = 1,
    perPage = 20,
    orderBy = 'nome',
    order = 'asc',
  } = params;
  
  // Count
  const { count } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true })
    .eq('company_id', companyId)
    .is('deleted_at', null);
  
  // Query
  let query = supabase
    .from('clients')
    .select('*')
    .eq('company_id', companyId)
    .is('deleted_at', null)
    .order(orderBy, { ascending: order === 'asc' })
    .range((page - 1) * perPage, page * perPage - 1);
  
  if (search) {
    query = query.or(`nome.ilike.%${search}%,telefone.ilike.%${search}%`);
  }
  
  const { data, error } = await query;
  
  return {
    data: data || [],
    count: count || 0,
    error,
  };
}

export async function getClientById(id: string, companyId: string) {
  const supabase = createServerClient();
  
  const { data, error } = await supabase
    .from('clients')
    .select('*, vehicles(*)')
    .eq('id', id)
    .eq('company_id', companyId)
    .is('deleted_at', null)
    .single();
  
  return { data, error };
}

export async function createClient(
  data: any,
  companyId: string,
  userId: string
) {
  const supabase = createServerClient();
  
  const { data: client, error } = await supabase
    .from('clients')
    .insert({
      ...data,
      company_id: companyId,
      created_by: userId,
      updated_by: userId,
    })
    .select()
    .single();
  
  return { data: client, error };
}
```

### Queries Complexas - Dashboard KPIs

```typescript
// lib/queries/dashboard.ts
import { createServerClient } from '@/lib/supabase/server';

export async function getDashboardKPIs(companyId: string) {
  const supabase = createServerClient();
  
  const hoje = new Date();
  const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  
  // Faturamento do dia
  const { data: faturamentoDia } = await supabase
    .from('work_orders')
    .select('valor_total')
    .eq('company_id', companyId)
    .eq('status', 'FINALIZADA')
    .gte('created_at', hoje.toISOString().split('T')[0])
    .lt('created_at', new Date(hoje.getTime() + 86400000).toISOString().split('T')[0]);
  
  const totalDia = faturamentoDia?.reduce((acc, order) => acc + order.valor_total, 0) || 0;
  
  // Faturamento do mês
  const { data: faturamentoMes } = await supabase
    .from('work_orders')
    .select('valor_total')
    .eq('company_id', companyId)
    .eq('status', 'FINALIZADA')
    .gte('created_at', primeiroDiaMes.toISOString());
  
  const totalMes = faturamentoMes?.reduce((acc, order) => acc + order.valor_total, 0) || 0;
  
  // OS Abertas
  const { count: osAbertas } = await supabase
    .from('work_orders')
    .select('*', { count: 'exact', head: true })
    .eq('company_id', companyId)
    .in('status', ['ABERTA', 'EM_EXECUCAO']);
  
  // Veículos em atendimento
  const { count: veiculosAtendimento } = await supabase
    .from('work_orders')
    .select('vehicle_id', { count: 'exact', head: true })
    .eq('company_id', companyId)
    .eq('status', 'EM_EXECUCAO');
  
  // Clientes ativos (com OS nos últimos 30 dias)
  const trintaDiasAtras = new Date(hoje.getTime() - 30 * 86400000);
  
  const { data: clientesAtivos } = await supabase
    .from('work_orders')
    .select('client_id')
    .eq('company_id', companyId)
    .gte('created_at', trintaDiasAtras.toISOString());
  
  const clientesUnicos = new Set(clientesAtivos?.map(o => o.client_id)).size;
  
  // Ticket médio
  const ticketMedio = faturamentoMes && faturamentoMes.length > 0
    ? totalMes / faturamentoMes.length
    : 0;
  
  return {
    faturamentoDia: totalDia,
    faturamentoMes: totalMes,
    osAbertas: osAbertas || 0,
    veiculosAtendimento: veiculosAtendimento || 0,
    clientesAtivos: clientesUnicos,
    ticketMedio,
  };
}
```

---

## 🛠️ Helpers e Utilities

### Formatters

```typescript
// lib/formatters.ts

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(date));
}

export function formatCPF(cpf: string): string {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

export function formatCNPJ(cnpj: string): string {
  return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

export function formatPhone(phone: string): string {
  return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
}

export function formatCEP(cep: string): string {
  return cep.replace(/(\d{5})(\d{3})/, '$1-$2');
}
```

### Validators

```typescript
// lib/validators.ts

export function isValidCPF(cpf: string): boolean {
  cpf = cpf.replace(/[^\d]/g, '');
  
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return false;
  }
  
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cpf.charAt(9))) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cpf.charAt(10))) return false;
  
  return true;
}

export function isValidCNPJ(cnpj: string): boolean {
  cnpj = cnpj.replace(/[^\d]/g, '');
  
  if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) {
    return false;
  }
  
  // Simplificado - implementar validação completa
  return true;
}

export function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function isValidPhone(phone: string): boolean {
  const digitsOnly = phone.replace(/\D/g, '');
  return digitsOnly.length >= 10 && digitsOnly.length <= 11;
}
```

---

**Documento:** EXEMPLOS_CODIGO_V4.md  
**Versão:** 4.0  
**Data:** Junho 2026

