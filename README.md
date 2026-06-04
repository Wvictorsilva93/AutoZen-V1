# AutoZen - Sistema Premium de Gestão Automotiva

Sistema SaaS Multi-tenant para gestão completa de negócios de estética automotiva, lava jato, detalhamento, polimento e serviços automotivos.

## 🚀 Stack Tecnológica

- **Next.js 16+** - Framework React
- **React 19+** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Shadcn/UI** - Componentes UI
- **Framer Motion** - Animações
- **Supabase** - Backend e Database
- **PostgreSQL** - Banco de dados

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar produção
npm start
```

## 🎨 Design System

### Cores

- **Background Principal**: `#0A0F1C`
- **Background Secundário**: `#111827`
- **Azul Primário**: `#2563EB`
- **Azul Glow**: `#3B82F6`
- **Texto Principal**: `#FFFFFF`
- **Texto Secundário**: `#94A3B8`
- **Bordas**: `rgba(255,255,255,0.08)`

### Componentes

- Glassmorphism com blur avançado
- Animações fluidas com Framer Motion
- Floating cards com efeitos parallax
- Inputs e forms premium
- Tabs animadas
- Sistema de glow e sombras

## 📁 Estrutura do Projeto

```
AutoZen/
├── app/
│   ├── layout.tsx          # Layout principal
│   ├── page.tsx             # Página inicial (Auth)
│   └── globals.css          # Estilos globais
├── components/
│   ├── auth/
│   │   ├── AuthScreen.tsx   # Tela principal de auth
│   │   ├── LoginForm.tsx    # Formulário de login
│   │   ├── SignupForm.tsx   # Formulário de cadastro
│   │   └── FloatingCard.tsx # Cards flutuantes
│   └── ui/
│       ├── button.tsx       # Componente Button
│       ├── input.tsx        # Componente Input
│       ├── checkbox.tsx     # Componente Checkbox
│       └── tabs.tsx         # Componente Tabs
├── lib/
│   └── utils.ts             # Utilitários
└── public/
    └── logo-autozen.png     # Logo do sistema
```

## 🎯 Funcionalidades da Tela de Auth

### Coluna Esquerda (Hero)
- Logo AutoZen
- Título e subtítulo impactantes
- 4 cards flutuantes com métricas:
  - Veículos em Atendimento
  - Caixa do Dia
  - Agendamentos
  - OS Abertas

### Coluna Direita (Autenticação)
- Card premium com glassmorphism
- Tabs animadas (Entrar / Criar Empresa)
- Formulário de Login:
  - Email
  - Senha
  - Lembrar acesso
  - Link "Esqueci minha senha"
- Formulário de Cadastro:
  - Nome da Empresa
  - Responsável
  - WhatsApp
  - Email
  - Senha
  - Aceite de termos

## ✨ Efeitos Premium

- ✅ Glassmorphism com blur 20-30px
- ✅ Floating effect nos cards
- ✅ Glow azul nos elementos interativos
- ✅ Gradients blur no background
- ✅ Noise texture sutil
- ✅ Animações Framer Motion
- ✅ Transições fluidas
- ✅ Microinterações
- ✅ Sombras suaves e modernas
- ✅ Parallax leve

## 🔧 Configuração

### Adicionar Logo

Coloque a logo `logo-autozen.png` na pasta `public/` na raiz do projeto.

### Variáveis de Ambiente

Crie um arquivo `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_supabase
```

## 📱 Responsividade

- **Desktop**: Layout 2 colunas (50/50)
- **Tablet**: Layout 1 coluna (empilhado)
- **Mobile**: Layout 1 coluna (otimizado)

## 🎨 Inspirações de Design

- Stripe
- Linear
- Notion
- Vercel

## 📄 Licença

© 2024 AutoZen. Todos os direitos reservados.
