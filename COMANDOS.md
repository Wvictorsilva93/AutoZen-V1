# 🚀 Comandos Rápidos do AutoZen

## Instalação e Execução

```bash
# 1. Instalar todas as dependências
npm install

# 2. Executar em modo desenvolvimento
npm run dev

# 3. Abrir no navegador
# http://localhost:3000
```

## Comandos de Desenvolvimento

```bash
# Executar em desenvolvimento (com hot reload)
npm run dev

# Build para produção
npm run build

# Executar versão de produção
npm start

# Verificar problemas de código
npm run lint
```

## ⚡ Início Rápido (Windows)

```cmd
cd C:\Users\Wander\Desktop\AutoZen
npm install
npm run dev
```

Depois abra: `http://localhost:3000`

## 🎨 Estrutura de Pastas Criada

```
AutoZen/
├── app/
│   ├── globals.css              ✅ Estilos globais e Tailwind
│   ├── layout.tsx               ✅ Layout principal da aplicação
│   └── page.tsx                 ✅ Página inicial (Auth Screen)
│
├── components/
│   ├── auth/
│   │   ├── AuthScreen.tsx       ✅ Tela principal de autenticação
│   │   ├── FloatingCard.tsx     ✅ Cards animados com métricas
│   │   ├── LoginForm.tsx        ✅ Formulário de login
│   │   └── SignupForm.tsx       ✅ Formulário de cadastro
│   │
│   ├── effects/
│   │   └── ParticleField.tsx    ✅ Efeito de partículas animadas
│   │
│   └── ui/
│       ├── button.tsx           ✅ Botão premium com glow
│       ├── checkbox.tsx         ✅ Checkbox estilizado
│       ├── input.tsx            ✅ Input com glassmorphism
│       └── tabs.tsx             ✅ Tabs animadas
│
├── lib/
│   └── utils.ts                 ✅ Utilitários (cn function)
│
├── public/
│   └── logo-autozen.png         ⚠️ ADICIONAR MANUALMENTE
│
├── .eslintrc.json               ✅ Configuração ESLint
├── .gitignore                   ✅ Arquivos ignorados no Git
├── next.config.js               ✅ Configuração Next.js
├── next-env.d.ts                ✅ Types do Next.js
├── package.json                 ✅ Dependências do projeto
├── postcss.config.js            ✅ Configuração PostCSS
├── tailwind.config.ts           ✅ Configuração Tailwind + Cores
├── tsconfig.json                ✅ Configuração TypeScript
│
└── Documentação:
    ├── README.md                ✅ Documentação principal
    ├── SETUP.md                 ✅ Guia de setup
    ├── IMPORTANTE_LOGO.md       ✅ Instruções para a logo
    └── COMANDOS.md              ✅ Este arquivo
```

## 📦 Dependências Instaladas

### Principais
- `next` - Framework React
- `react` - Biblioteca UI
- `react-dom` - React DOM
- `typescript` - Tipagem estática
- `tailwindcss` - CSS utility-first
- `framer-motion` - Animações avançadas

### UI Components
- `@radix-ui/react-tabs` - Componente de tabs
- `@radix-ui/react-checkbox` - Componente de checkbox
- `lucide-react` - Ícones modernos
- `clsx` - Utilitário para classNames
- `tailwind-merge` - Merge de classes Tailwind
- `class-variance-authority` - Variantes de componentes

## ✨ Features Implementadas

### Visual
- ✅ Dark mode premium (#0A0F1C)
- ✅ Glassmorphism (blur 20-30px)
- ✅ Gradient blur animado no background
- ✅ Partículas azuis animadas
- ✅ Noise texture sutil
- ✅ Glow azul nos elementos interativos

### Animações
- ✅ Floating effect nos cards
- ✅ Fade in suave
- ✅ Pulse nos gradientes
- ✅ Hover effects em todos os elementos
- ✅ Transições de 200ms
- ✅ Active state com scale

### Componentes
- ✅ Tabs animadas (Entrar / Criar Empresa)
- ✅ 4 cards flutuantes com métricas
- ✅ Formulário de login completo
- ✅ Formulário de cadastro completo
- ✅ Inputs com ícones
- ✅ Checkboxes estilizados
- ✅ Botões com glow

### UX
- ✅ Layout responsivo (desktop/tablet/mobile)
- ✅ Grid 50/50 no desktop
- ✅ Coluna única no mobile
- ✅ Validação de formulários
- ✅ Estados hover/focus/active
- ✅ Microinterações

## 🎯 Próximos Passos

### Imediato
1. ⚠️ Adicionar logo na pasta `public/`
2. ✅ Executar `npm install`
3. ✅ Executar `npm run dev`
4. ✅ Testar no navegador

### Backend (Futuro)
- [ ] Configurar Supabase
- [ ] Integrar autenticação real
- [ ] Criar banco de dados PostgreSQL
- [ ] Implementar multi-tenancy
- [ ] APIs de gestão

### Frontend (Futuro)
- [ ] Dashboard após login
- [ ] Gestão de clientes
- [ ] Gestão de veículos
- [ ] Gestão de serviços
- [ ] Sistema financeiro
- [ ] Agendamentos

## 🐛 Troubleshooting

### Erro: "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Erro: "Port 3000 is already in use"
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Ou rode em outra porta
npm run dev -- -p 3001
```

### Logo não aparece
- Verifique se o arquivo está em `public/logo-autozen.png`
- Verifique se o nome está correto (case-sensitive)
- Leia o arquivo `IMPORTANTE_LOGO.md`

## 📞 Suporte

Sistema desenvolvido seguindo os padrões de design de:
- Stripe (confiabilidade)
- Linear (modernidade)
- Notion (elegância)
- Vercel (premium)

✨ Interface premium digna de um SaaS de milhões! 🚀
