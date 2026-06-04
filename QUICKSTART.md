# 🚀 Quick Start - AutoZen V4

## 📋 Checklist de Setup

### 1️⃣ Dependências Instaladas ✅
```bash
npm install
```

### 2️⃣ Variáveis de Ambiente ✅
Arquivo `.env.local` já configurado com:
- ✅ NEXT_PUBLIC_SUPABASE_URL
- ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY
- ✅ SUPABASE_SERVICE_ROLE_KEY

### 3️⃣ Aplicar Schema no Supabase
**⚠️ IMPORTANTE: Faça isso antes de testar!**

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **SQL Editor**
4. Cole o conteúdo de `supabase/schema.sql`
5. Clique em **Run**

Mais detalhes em: `supabase/README.md`

### 4️⃣ Testar Build ✅
```bash
npm run build
```

### 5️⃣ Iniciar Desenvolvimento
```bash
npm run dev
```

Acesse: http://localhost:3000

## 🎨 O que você verá

### Tela Inicial Premium
- **Lado Esquerdo:** Apresentação com logo, título e cards animados
- **Lado Direito:** Formulário de login/cadastro com tabs

### Tabs Disponíveis
1. **Entrar:** Login de usuários existentes
2. **Criar Empresa:** Cadastro de nova empresa (trial 7 dias)

### Visual
- ✅ Dark mode
- ✅ Glassmorphism
- ✅ Glow effects azul/cyan
- ✅ Animações suaves
- ✅ Responsivo (mobile-first)

## 🧪 Testando o Sistema

### Teste 1: Visualizar a Tela
```bash
npm run dev
```
Abra: http://localhost:3000

**Esperado:**
- Tela dividida em 2 colunas
- Logo AutoZen no lado esquerdo
- Cards animados com métricas fake
- Formulário glassmorphism no lado direito

### Teste 2: Cadastro de Empresa
1. Clique na tab "Criar Empresa"
2. Preencha:
   - Nome da Empresa: "Lava Jato Teste"
   - Responsável: "João Silva"
   - WhatsApp: "(11) 99999-9999"
   - Email: "teste@email.com"
   - Senha: "senha123"
3. Clique em "Criar Minha Empresa"

**Esperado:**
- Console.log com os dados
- (Futuro: Criar empresa no Supabase)

### Teste 3: Login
1. Clique na tab "Entrar"
2. Preencha:
   - Email: "admin@exemplo.com"
   - Senha: "qualquer"
3. Clique em "Entrar no AutoZen"

**Esperado:**
- Console.log com os dados
- (Futuro: Autenticar no Supabase)

## 🔍 Verificar Banco de Dados

### Via Supabase Dashboard
1. Acesse: https://supabase.com/dashboard
2. Vá em **Table Editor**
3. Verifique as tabelas criadas:
   - ✅ companies
   - ✅ users
   - ✅ customers
   - ✅ vehicles
   - ✅ services
   - ✅ orders
   - ✅ financial_entries
   - ✅ inventory
   - ✅ employees
   - ✅ appointments

### Via SQL Editor
```sql
-- Ver empresas cadastradas
SELECT * FROM companies;

-- Ver estrutura de uma tabela
\d customers;

-- Verificar RLS habilitado
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

## 📊 Estrutura Multi-Tenant

### Como funciona o isolamento?

1. **Cada empresa tem um UUID único** (`company_id`)
2. **Todas as tabelas possuem `company_id`**
3. **RLS filtra automaticamente** por empresa
4. **Usuário só vê dados da sua empresa**

### Exemplo:
```sql
-- Usuário da Empresa A tenta acessar dados
SELECT * FROM customers;

-- RLS aplica automaticamente:
SELECT * FROM customers 
WHERE company_id = (
  SELECT company_id FROM users 
  WHERE auth_id = auth.uid()
);
```

## 🎯 Próximos Passos

### Agora que o setup está completo:

1. ✅ Implementar autenticação real (Server Actions)
2. ✅ Criar middleware de proteção de rotas
3. ✅ Desenvolver dashboard
4. ✅ Implementar CRUD de clientes
5. ✅ Implementar CRUD de veículos

## 🆘 Troubleshooting

### Build falha
```bash
# Limpar cache
rm -rf .next node_modules
npm install
npm run build
```

### Supabase não conecta
1. Verifique `.env.local`
2. Teste as credenciais no dashboard do Supabase
3. Verifique se o projeto está ativo

### Imagem não carrega
1. Verifique se `public/logo.png` existe
2. Reinicie o servidor de desenvolvimento
3. Limpe o cache do navegador

### Erro de TypeScript
```bash
npm run type-check
```

## 📱 PWA (Futuro)

O sistema já está preparado para PWA:
- ✅ `manifest.json` criado
- ✅ Metadata configurada no layout
- ⏳ Service Worker (futuro)
- ⏳ Offline sync (futuro)

## 🔐 Segurança

### O que já está implementado:
- ✅ RLS em todas as tabelas
- ✅ Isolamento por company_id
- ✅ Policies de acesso
- ✅ TypeScript strict
- ✅ Sanitização de inputs (via Radix UI)

### O que falta:
- ⏳ Rate limiting
- ⏳ CSRF protection
- ⏳ XSS prevention (headers)
- ⏳ SQL injection prevention (parametrizado)

## 📈 Performance

### Otimizações Aplicadas:
- ✅ Next.js standalone output
- ✅ Singleton Supabase client
- ✅ Lazy loading de componentes
- ✅ CSS-in-JS otimizado (Tailwind)
- ✅ Imagens otimizadas (next/image)

## 🎓 Recursos de Aprendizado

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind Docs](https://tailwindcss.com/docs)
- [Shadcn/UI](https://ui.shadcn.com)

---

**Sistema pronto para desenvolvimento! 🚀**

Qualquer dúvida, consulte:
- `README.md` - Documentação geral
- `STRUCTURE.md` - Estrutura de pastas
- `supabase/README.md` - Setup do banco
