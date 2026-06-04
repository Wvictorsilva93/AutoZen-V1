# 🎨 Guia de Customização do AutoZen

## Mudanças Rápidas de Visual

### 1. Alterar Paleta de Cores

**Arquivo:** `tailwind.config.ts`

```typescript
// Mudar para tema roxo/violeta
colors: {
  background: {
    primary: "#0A0A1C",    // Azul escuro → Roxo escuro
    secondary: "#1A1625",  // Cinza azulado → Roxo cinza
  },
  blue: {
    primary: "#8B5CF6",    // Azul → Roxo vibrante
    glow: "#A78BFA",       // Azul glow → Roxo claro
  },
}

// Mudar para tema verde/esmeralda
colors: {
  background: {
    primary: "#0A1C0F",
    secondary: "#182518",
  },
  blue: {
    primary: "#10B981",
    glow: "#34D399",
  },
}
```

### 2. Ajustar Intensidade dos Efeitos

**Arquivo:** `app/globals.css`

```css
/* Blur mais intenso */
.glass-card {
  @apply backdrop-blur-[40px] bg-white/10;  /* Era 20px e 0.05 */
}

/* Blur mais suave */
.glass-card {
  @apply backdrop-blur-[10px] bg-white/3;
}

/* Glow mais forte */
.glow-blue-strong {
  box-shadow: 0 0 60px rgba(59, 130, 246, 0.8);  /* Era 40px e 0.5 */
}
```

### 3. Mudar Fonte

**Arquivo:** `app/layout.tsx`

```typescript
// De Inter para outra fonte
import { Poppins } from "next/font/google";

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Ou usar uma fonte local
// Coloque a fonte em public/fonts/
```

### 4. Ajustar Tamanho do Título Hero

**Arquivo:** `components/auth/AuthScreen.tsx`

```tsx
// Maior
className="text-6xl lg:text-7xl font-bold..."  // Era 5xl/6xl

// Menor
className="text-4xl lg:text-5xl font-bold..."
```

### 5. Mudar Velocidade das Animações

**Arquivo:** `tailwind.config.ts`

```typescript
animation: {
  "float": "float 4s ease-in-out infinite",  // Era 6s (mais rápido)
  "float": "float 10s ease-in-out infinite", // Era 6s (mais lento)
}
```

---

## Customizações dos Componentes

### 1. Mudar Ícones dos Cards

**Arquivo:** `components/auth/AuthScreen.tsx`

```tsx
// Importar novos ícones
import { TrendingUp, DollarSign, Clock, CheckCircle } from "lucide-react";

// Substituir
<FloatingCard
  icon={TrendingUp}      // Era Car
  icon={DollarSign}      // Era Coins
  icon={Clock}           // Era Calendar
  icon={CheckCircle}     // Era FileText
/>
```

### 2. Customizar Valores dos Cards

```tsx
<FloatingCard
  title="Seu Novo Título"
  value={50}                    // Ou "R$ 10.000,00"
  status="Seu Status"
  statusColor="green"           // blue, green ou amber
  delay={0.3}
/>
```

### 3. Adicionar Mais Cards

```tsx
{/* No grid dos cards, adicione mais um */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* 4 cards existentes */}
  <FloatingCard
    icon={Users}
    title="Clientes Ativos"
    value={89}
    status="Total"
    statusColor="blue"
    delay={0.7}
  />
</div>
```

### 4. Mudar Texto do Botão

**Arquivo:** `components/auth/LoginForm.tsx`

```tsx
<Button type="submit" className="w-full mt-6">
  Acessar Sistema      {/* Era "Entrar no AutoZen" */}
</Button>
```

### 5. Adicionar Campo no Formulário

**Arquivo:** `components/auth/SignupForm.tsx`

```tsx
// Adicionar campo CPF/CNPJ
<div className="space-y-2">
  <label htmlFor="document" className="text-sm font-medium text-text-primary">
    CPF/CNPJ
  </label>
  <div className="relative">
    <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
    <Input
      id="document"
      type="text"
      placeholder="000.000.000-00"
      className="pl-11"
      required
    />
  </div>
</div>
```

---

## Adicionar Funcionalidades

### 1. Validação de Email

**Instalar biblioteca:**
```bash
npm install zod react-hook-form @hookform/resolvers
```

**Usar no formulário:**
```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const schema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
});

// No componente
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema),
});
```

### 2. Integrar com Supabase

**Instalar:**
```bash
npm install @supabase/supabase-js
```

**Criar arquivo:** `lib/supabase.ts`
```typescript
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

**Usar no LoginForm:**
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    console.error("Erro no login:", error);
  } else {
    console.log("Login sucesso:", data);
    // Redirecionar para dashboard
  }
};
```

### 3. Adicionar Toast de Notificação

**Instalar:**
```bash
npm install sonner
```

**Usar:**
```tsx
import { toast, Toaster } from 'sonner';

// No layout.tsx
<Toaster position="top-right" />

// Nos formulários
toast.success("Login realizado com sucesso!");
toast.error("Email ou senha inválidos");
```

### 4. Loading State

**No botão:**
```tsx
const [loading, setLoading] = useState(false);

<Button 
  type="submit" 
  disabled={loading}
  className="w-full mt-6"
>
  {loading ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Entrando...
    </>
  ) : (
    "Entrar no AutoZen"
  )}
</Button>
```

### 5. Modo Claro (Light Mode)

**Criar toggle de tema:**

```bash
npm install next-themes
```

**Configurar:** `app/layout.tsx`
```tsx
import { ThemeProvider } from 'next-themes';

<ThemeProvider attribute="class" defaultTheme="dark">
  {children}
</ThemeProvider>
```

**Ajustar cores no Tailwind:**
```css
.light {
  --background-primary: #F8FAFC;
  --background-secondary: #FFFFFF;
  --text-primary: #1E293B;
  --text-secondary: #64748B;
}
```

---

## Otimizações de Performance

### 1. Lazy Loading de Componentes

```tsx
import dynamic from 'next/dynamic';

const ParticleField = dynamic(
  () => import('@/components/effects/ParticleField'),
  { ssr: false }
);
```

### 2. Otimizar Animações

```tsx
// Desabilitar animações em mobile
const shouldAnimate = useMediaQuery('(min-width: 1024px)');

<motion.div
  animate={shouldAnimate ? { opacity: 1, y: 0 } : {}}
  initial={shouldAnimate ? { opacity: 0, y: 20 } : {}}
>
```

### 3. Reduzir Partículas em Mobile

**Arquivo:** `components/effects/ParticleField.tsx`

```tsx
const particleCount = window.innerWidth < 768 ? 20 : 50;

for (let i = 0; i < particleCount; i++) {
  // criar partículas
}
```

---

## Melhorias de Acessibilidade

### 1. Adicionar Skip Links

```tsx
<a 
  href="#main-content" 
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4"
>
  Pular para o conteúdo
</a>
```

### 2. ARIA Labels

```tsx
<button aria-label="Entrar no sistema">
  Entrar
</button>

<input 
  aria-describedby="email-hint"
  aria-invalid={errors.email ? "true" : "false"}
/>
```

### 3. Modo de Alto Contraste

```css
@media (prefers-contrast: high) {
  .glass-card {
    border-width: 2px;
    border-color: rgba(255,255,255,0.2);
  }
}
```

---

## SEO e Meta Tags

**Arquivo:** `app/layout.tsx`

```tsx
export const metadata: Metadata = {
  title: "AutoZen - Sistema de Gestão Premium",
  description: "Gestão completa para estética automotiva...",
  keywords: ["gestão automotiva", "lava jato", "estética"],
  authors: [{ name: "AutoZen Team" }],
  openGraph: {
    title: "AutoZen",
    description: "Sistema premium de gestão",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "AutoZen",
    description: "Sistema premium de gestão",
  },
};
```

---

## Adicionar Analytics

### Google Analytics

```bash
npm install @next/third-parties
```

```tsx
// app/layout.tsx
import { GoogleAnalytics } from '@next/third-parties/google'

<GoogleAnalytics gaId="G-XXXXXXXXXX" />
```

---

## Deploy

### Vercel (Recomendado)

```bash
npm install -g vercel
vercel
```

### Outras Plataformas

```bash
# Build
npm run build

# O output estará em .next/
# Upload para seu host (Netlify, AWS, etc)
```

---

## Testes

### Instalar Jest + Testing Library

```bash
npm install -D jest @testing-library/react @testing-library/jest-dom
```

### Exemplo de Teste

```tsx
// components/auth/__tests__/LoginForm.test.tsx
import { render, screen } from '@testing-library/react';
import LoginForm from '../LoginForm';

test('renderiza formulário de login', () => {
  render(<LoginForm />);
  expect(screen.getByLabelText('E-mail')).toBeInTheDocument();
});
```

---

## Dicas Finais

### 1. Mantenha o Design Consistente
- Use sempre as cores do design system
- Respeite os espaçamentos definidos
- Mantenha o padrão de glassmorphism

### 2. Performance
- Otimize imagens (use WebP)
- Lazy load componentes pesados
- Minimize animações em mobile

### 3. Acessibilidade
- Sempre use labels nos inputs
- Mantenha contraste adequado
- Teste com leitor de tela

### 4. Código Limpo
- Componentize tudo que for reutilizável
- Use TypeScript para type safety
- Documente funções complexas

### 5. Git
- Commit frequente
- Use mensagens descritivas
- Crie branches para features

---

## 📞 Recursos Úteis

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [Radix UI](https://www.radix-ui.com/)
- [Lucide Icons](https://lucide.dev/)
- [Supabase Docs](https://supabase.com/docs)

---

🚀 **Boa sorte customizando seu AutoZen!**
