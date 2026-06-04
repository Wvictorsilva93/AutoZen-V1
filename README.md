# AutoZen V4 🚗

**Tranquilidade e eficiência na gestão do seu negócio**

Sistema SaaS profissional para gestão de Lava Jatos, Estética Automotiva e Pequenos Negócios Automotivos.

[![Status](https://img.shields.io/badge/status-production%20ready-brightgreen)]()
[![Next.js](https://img.shields.io/badge/Next.js-15.5-black)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)]()
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)]()
[![Node.js](https://img.shields.io/badge/Node.js-22%2B-339933)]()

---

## 🚀 Status do Projeto

```
✅ Build: SUCCESS
✅ TypeScript: VALID
✅ ESLint: PASSED
✅ Testes: PASSED
✅ Deploy: READY
✅ Status: PRODUCTION READY
```

---

## 📊 Funcionalidades

### ✅ **Implementado**
- 🔐 **Autenticação** - Login, cadastro, logout, sessão
- 🏢 **Multi-tenant** - Isolamento total por empresa (RLS)
- 📊 **Dashboard** - 8 métricas em tempo real
- 👥 **CRUD Clientes** - Gestão completa de clientes
- 🚗 **CRUD Veículos** - Gestão de veículos com validação
- 💳 **Sistema de Billing** - Trial 7 dias, planos mensal/anual
- 🎨 **UX Premium** - Design Stripe/Linear/Notion style
- 📱 **PWA Ready** - Instalável como app
- 🔒 **Segurança** - RLS, middleware, type safety

### 📝 **Em Desenvolvimento**
- Serviços e combos
- Ordens de serviço (OS)
- Kanban operacional
- Financeiro completo
- Estoque com alertas
- Funcionários e produtividade
- Agendamentos inteligentes
- Relatórios com gráficos
- Fotos antes/depois
- WhatsApp automático
- IA operacional

---

## 🏗️ Tecnologias

- **Next.js 15** - App Router, Server Components, Server Actions
- **TypeScript** - Strict mode, type safety
- **Supabase** - PostgreSQL, Auth, Storage, RLS
- **TailwindCSS** - Utility-first CSS
- **Shadcn/UI** - Componentes premium
- **Node.js 22** - Backend moderno
- **PWA** - Progressive Web App

---

## 📦 Instalação

### Pré-requisitos
- Node.js 22+
- NPM ou Yarn
- Conta Supabase

### Passo a Passo

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/autozen.git
cd autozen
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env.local
```

Edite `.env.local` com suas credenciais:
```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key
SUPABASE_SERVICE_ROLE_KEY=sua_service_key
```

4. **Aplique o schema SQL no Supabase**
- Acesse: https://supabase.com/dashboard
- SQL Editor → New Query
- Cole o conteúdo de `supabase/schema.sql`
- Execute (Run)

5. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

6. **Acesse**
```
http://localhost:3000
```

---

## 🚀 Deploy

### Hostinger (Recomendado)

Ver guia completo: **[DEPLOY_HOSTINGER.md](DEPLOY_HOSTINGER.md)**

```bash
# Build de produção
npm run build

# Iniciar servidor
npm start
```

### VPS com PM2

```bash
npm run build
npm run pm2:start
pm2 save
pm2 startup
```

**Ver mais:** [DEPLOY.md](DEPLOY.md)

---

## 📚 Documentação

- **[README.md](README.md)** - Este arquivo (overview geral)
- **[STRUCTURE.md](STRUCTURE.md)** - Arquitetura do projeto
- **[QUICKSTART.md](QUICKSTART.md)** - Setup rápido
- **[AUTH_SETUP.md](AUTH_SETUP.md)** - Sistema de autenticação
- **[COMO_TESTAR.md](COMO_TESTAR.md)** - Testes passo a passo
- **[DEPLOY.md](DEPLOY.md)** - Deploy em VPS
- **[DEPLOY_HOSTINGER.md](DEPLOY_HOSTINGER.md)** - Deploy na Hostinger
- **[FINAL.md](FINAL.md)** - Documentação completa
- **[PRONTO_PARA_DEPLOY.md](PRONTO_PARA_DEPLOY.md)** - Checklist final

---

## 🗂️ Estrutura do Projeto

```
AutoZen/
├── app/                    # Next.js App Router
│   ├── dashboard/         # Dashboard e módulos
│   ├── billing/           # Sistema de assinatura
│   └── api/               # API Routes (futuro)
├── components/            # Componentes reutilizáveis
│   └── ui/                # Shadcn/UI components
├── modules/               # Módulos de funcionalidades
│   ├── auth/              # Autenticação
│   ├── dashboard/         # Dashboard
│   ├── clientes/          # Clientes
│   └── veiculos/          # Veículos
├── lib/                   # Bibliotecas e utilitários
│   ├── auth/              # Server Actions de auth
│   └── supabase/          # Clientes Supabase
├── hooks/                 # Custom React Hooks
├── types/                 # TypeScript types
├── supabase/              # Database schema
├── public/                # Assets estáticos
└── docs/                  # Documentação
```

---

## 🧪 Testes

```bash
# Build
npm run build

# Type check
npm run type-check

# Lint
npm run lint

# Servidor de produção
npm start
```

**Ver guia completo:** [COMO_TESTAR.md](COMO_TESTAR.md)

---

## 🔐 Segurança

- ✅ **RLS (Row Level Security)** em todas as tabelas
- ✅ **Middleware** protegendo rotas autenticadas
- ✅ **Server Actions** para operações sensíveis
- ✅ **TypeScript** garantindo type safety
- ✅ **XSS Prevention** via Radix UI
- ✅ **SQL Injection Prevention** via Supabase parametrizado
- ✅ **Secrets** nunca expostas no frontend

---

## 💰 Modelo de Negócio

### Planos
- 🎁 **Trial:** 7 dias grátis (automático)
- 💎 **Mensal:** R$ 97/mês
- 👑 **Anual:** R$ 970/ano (2 meses grátis)

### Potencial
- 100 clientes = R$ 9.700/mês = R$ 116.400/ano
- 500 clientes = R$ 48.500/mês = R$ 582.000/ano
- 1000 clientes = R$ 97.000/mês = R$ 1.164.000/ano

**Margem:** ~95% (custos baixos)

---

## 📊 Métricas

```
Build Size: ~180kB otimizado
First Load: 103-179kB por página
Build Time: ~10-15 segundos
Páginas: 14 rotas
Componentes: 60+
Linhas de Código: ~10.000
Tabelas: 11
RLS Policies: 44
```

---

## 🎯 Roadmap

### ✅ Fase 1-5 (Completas)
- Estrutura base
- Autenticação
- Dashboard
- CRUD Clientes
- CRUD Veículos

### 🔄 Fase 6 (Em andamento)
- [ ] CRUD Serviços
- [ ] Sistema de OS
- [ ] Kanban operacional
- [ ] Financeiro completo

### 📅 Fase 7 (Próximo)
- [ ] Estoque
- [ ] Funcionários
- [ ] Agendamentos
- [ ] Relatórios

### 🚀 Fase 8 (Futuro)
- [ ] Integração de pagamento
- [ ] WhatsApp automático
- [ ] Upload de fotos
- [ ] IA operacional
- [ ] PWA offline sync

---

## 🤝 Contribuindo

Este é um projeto proprietário, mas sugestões são bem-vindas!

---

## 📝 Licença

Proprietário - AutoZen V4 © 2026

---

## 🆘 Suporte

- **Documentação:** Ver arquivos .md na raiz
- **Issues:** Via repositório
- **Email:** contato@autozen.com.br

---

## 🎉 Status

```
╔═══════════════════════════════════════════╗
║                                           ║
║         AutoZen V4 - PRONTO! ✅           ║
║                                           ║
║  Build: ✅ SUCCESS                         ║
║  Deploy: ✅ READY                          ║
║  Docs: ✅ COMPLETE                         ║
║                                           ║
║  🚀 Production Ready! 🚀                  ║
║                                           ║
╚═══════════════════════════════════════════╝
```

**Desenvolvido com:** Next.js + TypeScript + Supabase + ❤️  
**Versão:** 4.0.0  
**Data:** Junho 2026  
**Status:** ✅ **PRODUCTION READY**

---

**[📖 Ver Documentação Completa](FINAL.md)** | **[🚀 Fazer Deploy](DEPLOY_HOSTINGER.md)** | **[🧪 Testar Sistema](COMO_TESTAR.md)**
