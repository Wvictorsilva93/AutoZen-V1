# 🎨 AutoZen Design System V2 - Enterprise Premium

## 📐 Visão Geral

Design System completo para o AutoZen, um SaaS Multi-tenant enterprise voltado para gestão de negócios automotivos. Inspirado nos melhores produtos do mercado: Stripe, Linear, Vercel, Notion, Raycast e Arc Browser.

---

## 🎯 Princípios de Design

### O AutoZen deve transparecer:
- ✅ **Premium** - Qualidade em cada detalhe
- ✅ **Moderno** - Tecnologia de ponta
- ✅ **Minimalista** - Apenas o essencial
- ✅ **Escalável** - Cresce com o negócio
- ✅ **Enterprise** - Confiança e solidez
- ✅ **Rápido** - Performance perceptível
- ✅ **Profissional** - Sério e competente

### Evitar:
- ❌ Visual infantil ou genérico
- ❌ Excesso de cores e gradientes
- ❌ Efeitos exagerados ou distrações
- ❌ Interface poluída
- ❌ Aspecto de sistema legado

---

## 🎨 Paleta de Cores

### Base (Dark Mode)

```css
/* Backgrounds */
--background-primary:   #0A0F1C  /* Fundo principal */
--background-secondary: #111827  /* Fundo secundário */
--background-card:      #151D2F  /* Cards e superfícies */
--background-hover:     #1E293B  /* Estados hover */

/* Brand Colors */
--blue-primary:         #2563EB  /* Azul principal */
--blue-glow:            #3B82F6  /* Azul brilhante */

/* Semantic Colors */
--success:              #10B981  /* Verde sucesso */
--warning:              #F59E0B  /* Amarelo atenção */
--error:                #EF4444  /* Vermelho alerta */
--purple:               #8B5CF6  /* Roxo insights */

/* Text */
--text-primary:         #FFFFFF  /* Texto principal */
--text-secondary:       #94A3B8  /* Texto secundário */

/* Borders */
--border:               rgba(255,255,255,0.08)  /* Bordas padrão */
```

### Uso das Cores

| Cor | Quando Usar |
|-----|-------------|
| **Blue Primary** | Botões primários, links, elementos interativos principais |
| **Blue Glow** | Efeitos hover, estados ativos, ícones destacados |
| **Success** | Confirmações, status positivos, métricas crescentes |
| **Warning** | Alertas, pendências, ações que requerem atenção |
| **Error** | Erros, ações destrutivas, status negativos |
| **Purple** | Insights, analytics, funcionalidades premium |

---

## 📝 Tipografia

### Fonte Principal

```css
font-family: 'Inter', system-ui, -apple-system, sans-serif;
```

### Hierarquia Tipográfica

| Classe | Tamanho | Peso | Uso |
|--------|---------|------|-----|
| `display-xl` | 60px | 700 | Títulos de landing pages |
| `display-lg` | 48px | 700 | Títulos principais de seção |
| `heading-1` | 36px | 700 | Títulos de página |
| `heading-2` | 30px | 600 | Subtítulos principais |
| `heading-3` | 24px | 600 | Títulos de cards |
| `heading-4` | 20px | 600 | Títulos menores |
| `body-lg` | 18px | 400 | Texto enfatizado |
| `body` | 16px | 400 | Texto padrão |
| `body-sm` | 14px | 400 | Texto menor |
| `caption` | 12px | 400 | Legendas, labels |

### Boas Práticas

```css
/* Sempre use line-height adequado */
line-height: 1.6; /* Para body text */
line-height: 1.2; /* Para headings */

/* Font smoothing */
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;

/* OpenType features */
font-feature-settings: "rlig" 1, "calt" 1;
```

---

## 📐 Grid System

### Desktop (≥1024px)
- **12 colunas**
- Container máximo: **1440px**
- Gap: **24px**

### Tablet (768px - 1023px)
- **8 colunas**
- Gap: **20px**

### Mobile (<768px)
- **4 colunas**
- Gap: **16px**

### Espaçamentos

```css
/* Scale de espaçamentos */
4px   8px   12px  16px  20px
24px  32px  40px  48px  64px  80px

/* Uso */
gap-4     /* 4px  - espaçamentos mínimos */
gap-8     /* 8px  - elementos próximos */
gap-12    /* 12px - espaçamento pequeno */
gap-16    /* 16px - espaçamento padrão */
gap-24    /* 24px - espaçamento médio */
gap-32    /* 32px - espaçamento grande */
gap-48    /* 48px - seções */
gap-64    /* 64px - separação de módulos */
```

---

## 🔘 Border Radius

```css
/* Inputs e campos de formulário */
rounded-input: 12px

/* Cards e superfícies */
rounded-card: 20px

/* Modais e overlays */
rounded-modal: 24px

/* Botões */
rounded-button: 14px

/* Badges e pills */
rounded-badge: 999px (fully rounded)
```

---

## 🌑 Sombras

```css
/* Shadow Small - Elementos sutis */
shadow-sm: 0 2px 8px rgba(0,0,0,0.15)

/* Shadow Medium - Cards e dropdowns */
shadow-md: 0 10px 30px rgba(0,0,0,0.25)

/* Shadow Premium - Modais e overlays */
shadow-premium: 0 20px 60px rgba(0,0,0,0.35)

/* Glow Blue - Elementos interativos */
shadow-glow-blue: 0 0 30px rgba(59,130,246,0.30)
shadow-glow-blue-strong: 0 0 40px rgba(59,130,246,0.50)
```

---

## 💎 Glassmorphism

### Glass Card (Padrão)
```css
backdrop-blur: 20px
background: rgba(255,255,255,0.04)
border: 1px solid rgba(255,255,255,0.08)
border-radius: 20px
```

### Glass Card Premium (Modais)
```css
backdrop-blur: 30px
background: rgba(17,24,39,0.7)
border: 1px solid rgba(255,255,255,0.08)
border-radius: 24px
box-shadow: 0 20px 60px rgba(0,0,0,0.35)
```

### Glass Sidebar
```css
backdrop-blur: 20px
background: rgba(255,255,255,0.03)
border-right: 1px solid rgba(255,255,255,0.08)
```

---

## 🔘 Componentes

### Botões

#### Botão Primário
```tsx
<button className="btn-primary h-10 px-4">
  Salvar
</button>
```
- Cor: `#2563EB`
- Hover: Glow azul + cor mais clara
- Loading: Spinner branco
- Disabled: Opacidade 50%

#### Botão Secundário
```tsx
<button className="btn-secondary h-10 px-4">
  Cancelar
</button>
```
- Background: Transparente
- Border: `rgba(255,255,255,0.08)`
- Hover: Background `rgba(255,255,255,0.10)`

#### Botão Ghost
```tsx
<button className="btn-ghost h-10 px-4">
  Ver mais
</button>
```
- Sem fundo ou border
- Hover: Background sutil

#### Variantes de Cor
```tsx
<button className="btn-success">Confirmar</button>
<button className="btn-warning">Atenção</button>
<button className="btn-error">Excluir</button>
```

### Tamanhos
```tsx
h-8  px-3  /* Pequeno */
h-10 px-4  /* Médio (padrão) */
h-12 px-6  /* Grande */
```

---

### Inputs

#### Input Padrão
```tsx
<Input
  type="text"
  placeholder="Digite algo..."
  className="h-12"
/>
```

#### Com Ícone
```tsx
<div className="relative">
  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
  <Input
    type="email"
    placeholder="seu@email.com"
    className="pl-11"
  />
</div>
```

#### Estados
- **Default**: Border `rgba(255,255,255,0.08)`
- **Hover**: Background ligeiramente mais claro
- **Focus**: Ring azul 2px
- **Error**: Border e ring vermelhos
- **Disabled**: Opacidade 50%, cursor not-allowed

---

### Badges

```tsx
<Badge variant="success">Pago</Badge>
<Badge variant="warning">Pendente</Badge>
<Badge variant="error">Atrasado</Badge>
<Badge variant="info">Em análise</Badge>
<Badge variant="premium">Premium</Badge>
```

Uso:
- **Success**: Status positivos
- **Warning**: Atenção necessária
- **Error**: Problemas ou erros
- **Info**: Informações neutras
- **Premium**: Features exclusivas

---

### Alerts

```tsx
<Alert variant="success">
  <AlertTitle>Sucesso!</AlertTitle>
  <AlertDescription>
    Operação realizada com sucesso.
  </AlertDescription>
</Alert>
```

Variantes: `success`, `warning`, `error`, `info`

---

### Cards

```tsx
<Card>
  <CardHeader>
    <CardTitle>Título do Card</CardTitle>
    <CardDescription>Descrição opcional</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Conteúdo */}
  </CardContent>
  <CardFooter>
    {/* Ações */}
  </CardFooter>
</Card>
```

Variantes:
- `card-primary` - Card padrão
- `card-stat` - Card de métrica
- `card-interactive` - Card clicável

---

### Tabelas

```tsx
<div className="table-container">
  <table className="w-full">
    <thead className="table-header">
      <tr>
        <th>Nome</th>
        <th>Email</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      <tr className="table-row">
        <td>João Silva</td>
        <td>joao@email.com</td>
        <td><Badge variant="success">Ativo</Badge></td>
      </tr>
    </tbody>
  </table>
</div>
```

Recursos esperados:
- Pesquisa
- Ordenação
- Filtros
- Paginação
- Seleção múltipla
- Exportação (CSV, Excel, PDF)
- Ações rápidas

---

## 🎭 Animações

### Framer Motion

```tsx
import { motion } from "framer-motion";

// Fade In Up
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Conteúdo
</motion.div>

// Scale In
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.3 }}
>
  Modal
</motion.div>
```

### Classes CSS

```css
.animate-fade-in      /* Fade in simples */
.animate-fade-in-up   /* Fade in + move up */
.animate-scale-in     /* Scale in */
.animate-slide-in-right  /* Slide from left */
.animate-float        /* Floating effect */
.animate-glow         /* Glow pulsante */
.animate-shimmer      /* Shimmer effect */
```

### Microinterações

- Botões: `scale(0.98)` no active
- Cards: `scale(1.02)` no hover
- Inputs: Transição suave de border
- Ícones: Rotação ou mudança de cor
- Loading: Skeleton com shimmer

---

## 📱 Layout

### Sidebar

**Especificações:**
- Largura: `280px` (expandida) / `80px` (colapsada)
- Retrátil e colapsável
- Fixo na lateral esquerda
- Scroll independente

**Estrutura:**
```
├─ Logo + Nome da empresa
├─ Seletor de empresa (multi-tenant)
├─ Menu de navegação
├─ [Espaço expansível]
└─ Perfil do usuário + Plano
```

**Menu Items:**
1. Dashboard
2. Clientes
3. Veículos
4. Agendamentos
5. Ordens de Serviço
6. Serviços
7. Estoque
8. Financeiro
9. Equipe
10. Relatórios
11. Configurações

---

### Header

**Especificações:**
- Altura: `64px` (4rem)
- Fixo no topo
- Backdrop blur
- Border bottom

**Estrutura:**
```
[Busca global] [................] [Notificações] [Ajuda] [Avatar]
```

---

### Dashboard

**Layout Modular:**
- Widgets arrastáveis (futuro)
- Grid responsivo
- Cards de KPI
- Gráficos interativos

**KPIs Principais:**
- Faturamento
- Clientes
- Veículos
- OS (Ordens de Serviço)
- Agendamentos
- Ticket Médio
- Receitas
- Despesas
- Lucro

---

## 📊 Módulos do Sistema

### 1. Clientes

**Cadastro Completo:**
- Dados pessoais (Nome, CPF/CNPJ)
- Contato (Email, Telefone, WhatsApp)
- Endereço completo
- Observações
- Histórico de serviços
- Veículos vinculados

---

### 2. Veículos

**Informações:**
- Placa
- Marca/Modelo
- Ano/Cor
- Km atual
- Tipo de combustível
- Observações técnicas
- Galeria de fotos
- Documentos anexos

---

### 3. Agendamentos

**Visualizações:**
- Calendário mensal
- Lista
- Kanban

**Status:**
- Agendado
- Confirmado
- Em Atendimento
- Concluído
- Cancelado

---

### 4. Ordens de Serviço

**Informações:**
- Cliente e veículo
- Serviços selecionados
- Produtos utilizados
- Checklist de inspeção
- Fotos (antes/depois)
- Observações técnicas
- Assinatura digital
- Status e timeline

---

### 5. Financeiro

**Módulos:**
- Contas a Receber
- Contas a Pagar
- Fluxo de Caixa
- DRE Simplificada
- Metas
- Indicadores

**Dashboard Financeiro:**
- Receita total
- Lucro
- Despesas
- Margem
- Ticket médio
- Gráficos de evolução

---

### 6. Estoque

**Gestão:**
- Produtos
- Categorias
- Fornecedores
- Movimentações
- Alertas de estoque mínimo

---

### 7. Relatórios

**Formatos:**
- PDF (visualização e download)
- Excel (download)
- CSV (exportação)

**Recursos:**
- Filtros avançados
- Agendamento automático
- Envio por email

---

## ♿ Acessibilidade

### WCAG AA Compliance

```tsx
// Sempre use labels
<label htmlFor="email">E-mail</label>
<Input id="email" type="email" />

// ARIA labels quando necessário
<button aria-label="Fechar modal">
  <X />
</button>

// Navegação por teclado
<div role="dialog" aria-labelledby="modal-title">
```

### Contraste

Todos os textos atendem WCAG AA:
- Texto principal (#FFFFFF) sobre backgrounds escuros
- Texto secundário (#94A3B8) sobre backgrounds escuros
- Cores de status com contraste adequado

### Navegação por Teclado

- Tab: Navegar entre elementos
- Enter/Space: Ativar elementos
- Esc: Fechar modais
- ⌘K: Busca global

---

## 🌗 Dark Mode

**Padrão do sistema:**
- Dark mode é o tema principal
- Light mode opcional (futuro)
- Persistência da preferência do usuário

---

## 📏 Boas Práticas

### DO ✅

- Use componentes do design system
- Mantenha espaçamentos consistentes
- Aplique glassmorphism sutilmente
- Priorize performance
- Seja minimalista
- Use animações com propósito

### DON'T ❌

- Não crie variações de cores
- Não use sombras exageradas
- Não adicione animações desnecessárias
- Não polu a interface
- Não ignore acessibilidade
- Não quebre a hierarquia visual

---

## 🚀 Performance

### Otimizações

- Code splitting por rota
- Lazy loading de componentes
- Image optimization (Next.js)
- CSS purging (Tailwind)
- Bundle size monitoring

### Lighthouse Targets

- Performance: 95+
- Accessibility: 100
- Best Practices: 100
- SEO: 100

---

## 📚 Recursos

### Inspirações

- **Stripe**: Clareza e confiabilidade
- **Linear**: Velocidade e modernidade
- **Vercel**: Premium e tecnologia
- **Notion**: Elegância e usabilidade
- **Raycast**: Eficiência e produtividade
- **Arc Browser**: Inovação e design

### Ferramentas

- Figma (design)
- Tailwind CSS (styling)
- Framer Motion (animation)
- Radix UI (primitives)
- Lucide Icons (icons)

---

## 🎯 Resultado Esperado

Um Design System **Enterprise Premium** que:

✅ Transmite **tecnologia** e **inovação**  
✅ Inspira **confiança** e **profissionalismo**  
✅ Proporciona **produtividade** e **eficiência**  
✅ Mantém **consistência** absoluta  
✅ Compete visualmente com os **melhores SaaS do mercado**  
✅ Escala do **MVP ao Enterprise** sem quebrar  

---

**AutoZen Design System V2**  
_Interface Premium para Gestão Automotiva de Alto Padrão_ 🚀
