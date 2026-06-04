# 🛠️ Guia de Implementação - AutoZen V3

## 🎯 Objetivo

Guia prático para implementar cada módulo do AutoZen seguindo a arquitetura V3.

---

## 📋 Checklist Geral

### Antes de Começar
- [ ] Ler ARQUITETURA_COMPLETA_V3.md
- [ ] Entender multi-tenancy
- [ ] Configurar Supabase
- [ ] Configurar variáveis de ambiente

### Ordem de Implementação
1. ✅ Auth System (V1)
2. ✅ Design System (V2)
3. ⏳ Multi-tenant Auth (V3)
4. ⏳ Módulo Clientes
5. ⏳ Módulo Veículos
6. ⏳ Módulo Agendamentos
7. ⏳ Módulo OS
8. ⏳ Módulo Serviços
9. ⏳ Módulo Estoque
10. ⏳ Módulo Financeiro
11. ⏳ Módulo Relatórios
12. ⏳ Integrações

---

## 🔐 1. Autenticação Multi-tenant

### Setup Supabase

```sql
-- 1. Criar tabela de tenants
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  razao_social TEXT NOT NULL,
  nome_fantasia TEXT NOT NULL,
  cnpj TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT,
  
  -- Assinatura
  status TEXT NOT NULL DEFAULT 'trial',
  plano TEXT NOT NULL DEFAULT 'premium',
  data_inicio TIMESTAMP DEFAULT NOW(),
  data_renovacao TIMESTAMP,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Criar tabela de profiles (estende auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  nome TEXT NOT NULL,
  avatar_url TEXT,
  telefone TEXT,
  
  -- Permissões
  role TEXT NOT NULL DEFAULT 'atendente',
  permissoes JSONB DEFAULT '[]',
  
  -- Status
  ativo BOOLEAN DEFAULT true,
  ultimo_acesso TIMESTAMP,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. RLS no profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

### Hook de Auth

```typescript
// hooks/useAuth.ts
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar sessão
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Buscar profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*, tenants(*)')
          .eq('id', session.user.id)
          .single();
          
        setProfile(profileData);
        setTenant(profileData?.tenants);
      }
      
      setLoading(false);
    });

    // Listener de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
        // Buscar profile novamente
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return { user, profile, tenant, loading };
}
```

---

## 👥 2. Módulo Clientes

### Database Schema

```sql
CREATE TABLE clientes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Tipo
  tipo TEXT NOT NULL DEFAULT 'PF', -- PF ou PJ
  
  -- Dados Pessoais
  nome TEXT NOT NULL,
  cpf TEXT,
  cnpj TEXT,
  data_nascimento DATE,
  
  -- Contato
  email TEXT,
  telefone TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  
  -- Endereço
  cep TEXT,
  logradouro TEXT,
  numero TEXT,
  complemento TEXT,
  bairro TEXT,
  cidade TEXT,
  estado TEXT,
  
  -- Observações
  observacoes TEXT,
  tags TEXT[],
  
  -- Status
  ativo BOOLEAN DEFAULT true,
  
  -- Metadata
  created_by UUID REFERENCES profiles(id),
  updated_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT unique_cpf_per_tenant UNIQUE (tenant_id, cpf),
  CONSTRAINT unique_cnpj_per_tenant UNIQUE (tenant_id, cnpj)
);

-- Índices
CREATE INDEX idx_clientes_tenant ON clientes(tenant_id);
CREATE INDEX idx_clientes_nome ON clientes(nome);
CREATE INDEX idx_clientes_cpf ON clientes(cpf);
CREATE INDEX idx_clientes_ativo ON clientes(ativo);

-- RLS
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view clients from own tenant"
  ON clientes FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can insert clients in own tenant"
  ON clientes FOR INSERT
  WITH CHECK (
    tenant_id IN (
      SELECT tenant_id FROM profiles WHERE id = auth.uid()
    )
  );
```

### Componente de Lista

```typescript
// app/(dashboard)/clientes/page.tsx
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Users } from "lucide-react";
import Link from "next/link";

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadClientes();
  }, [search]);

  async function loadClientes() {
    setLoading(true);
    
    let query = supabase
      .from('clientes')
      .select('*')
      .eq('ativo', true)
      .order('nome');
    
    if (search) {
      query = query.or(`nome.ilike.%${search}%,cpf.ilike.%${search}%`);
    }
    
    const { data, error } = await query;
    
    if (!error) {
      setClientes(data || []);
    }
    
    setLoading(false);
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading-2">Clientes</h1>
          <p className="text-body text-text-secondary mt-1">
            Gerencie sua base de clientes
          </p>
        </div>
        <Link href="/clientes/novo">
          <Button className="btn-primary h-10 px-4">
            <Plus className="w-4 h-4 mr-2" />
            Novo Cliente
          </Button>
        </Link>
      </div>

      {/* Filtros */}
      <Card className="p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <Input
            type="text"
            placeholder="Buscar por nome ou CPF..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-11"
          />
        </div>
      </Card>

      {/* Lista */}
      <Card>
        <div className="table-container">
          <table className="w-full">
            <thead className="table-header">
              <tr>
                <th className="px-6 py-4 text-left text-body-sm font-semibold">
                  Nome
                </th>
                <th className="px-6 py-4 text-left text-body-sm font-semibold">
                  Contato
                </th>
                <th className="px-6 py-4 text-left text-body-sm font-semibold">
                  CPF/CNPJ
                </th>
                <th className="px-6 py-4 text-left text-body-sm font-semibold">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-body-sm font-semibold">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    Carregando...
                  </td>
                </tr>
              ) : clientes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-text-secondary">
                    Nenhum cliente encontrado
                  </td>
                </tr>
              ) : (
                clientes.map((cliente) => (
                  <tr key={cliente.id} className="table-row">
                    <td className="px-6 py-4">
                      <Link href={`/clientes/${cliente.id}`} className="font-medium hover:text-blue-glow">
                        {cliente.nome}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-body-sm text-text-secondary">
                      {cliente.whatsapp}
                    </td>
                    <td className="px-6 py-4 text-body-sm text-text-secondary">
                      {cliente.cpf || cliente.cnpj || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={cliente.ativo ? "success" : "default"}>
                        {cliente.ativo ? "Ativo" : "Inativo"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button className="btn-ghost h-8 px-3 text-body-sm">
                        Ver Perfil
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
```

---

## 🚗 3. Módulo Veículos

### Database Schema

```sql
CREATE TABLE veiculos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  
  -- Dados
  placa TEXT NOT NULL,
  marca TEXT NOT NULL,
  modelo TEXT NOT NULL,
  ano INTEGER NOT NULL,
  cor TEXT NOT NULL,
  km INTEGER DEFAULT 0,
  chassi TEXT,
  combustivel TEXT NOT NULL,
  
  -- Fotos
  fotos JSONB DEFAULT '[]',
  
  -- Documentos
  documentos JSONB DEFAULT '[]',
  
  -- Observações
  observacoes TEXT,
  
  -- Status
  ativo BOOLEAN DEFAULT true,
  
  -- Metadata
  created_by UUID REFERENCES profiles(id),
  updated_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT unique_placa_per_tenant UNIQUE (tenant_id, placa)
);

-- Índices
CREATE INDEX idx_veiculos_tenant ON veiculos(tenant_id);
CREATE INDEX idx_veiculos_cliente ON veiculos(cliente_id);
CREATE INDEX idx_veiculos_placa ON veiculos(placa);

-- RLS
ALTER TABLE veiculos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view vehicles from own tenant"
  ON veiculos FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM profiles WHERE id = auth.uid()
    )
  );
```

---

Continua no próximo arquivo...
