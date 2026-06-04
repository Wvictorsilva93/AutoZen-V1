# AutoZen V4

**Tranquilidade e eficiência na gestão do seu negócio**

Sistema SaaS profissional para gestão de:
- Lava Jatos
- Estética Automotiva
- Lava Rápido
- Pequenos Negócios Automotivos

## 🚀 Tecnologias

- **Next.js 15+** App Router
- **TypeScript** Strict Mode
- **Supabase** PostgreSQL + Auth + Storage
- **TailwindCSS** + Shadcn/UI
- **Node.js 22**

## 🏗️ Arquitetura

- ✅ **SaaS Multiempresa Real** (Multi-tenant com RLS)
- ✅ **PWA Offline First** (IndexedDB + Service Worker)
- ✅ **Escalável** (Preparado para milhões de usuários)
- ✅ **UX Premium** (Estilo Stripe/Linear/Notion)
- ✅ **Produção Ready** (Hostinger/VPS)

## 📦 Instalação

```bash
npm install
```

## 🔧 Configuração

Criar arquivo `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave
SUPABASE_SERVICE_ROLE_KEY=sua_service_key
```

## 🏃 Desenvolvimento

```bash
npm run dev
```

## 🏗️ Build

```bash
npm run build
npm start
```

## 📁 Estrutura

```
/app              # Next.js App Router
/lib              # Utilitários e configurações
/types            # TypeScript types
/components       # Componentes reutilizáveis
/modules          # Módulos de funcionalidade
/public           # Assets estáticos
```

## 🎯 Roadmap

- [x] Estrutura base
- [ ] Sistema de autenticação
- [ ] Dashboard premium
- [ ] Módulo de clientes
- [ ] Módulo de veículos
- [ ] Sistema de OS
- [ ] Kanban operacional
- [ ] Financeiro
- [ ] Relatórios

## 📝 Licença

Proprietário - AutoZen V4
