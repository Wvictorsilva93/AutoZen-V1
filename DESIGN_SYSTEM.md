# 🎨 AutoZen Design System

## Paleta de Cores

### Backgrounds
```css
Background Principal:    #0A0F1C  /* Azul profundo escuro */
Background Secundário:   #111827  /* Azul escuro acinzentado */
```

### Azuis (Primários)
```css
Azul Primário:          #2563EB  /* Azul vibrante */
Azul Glow:              #3B82F6  /* Azul brilhante para efeitos */
```

### Textos
```css
Texto Primary:          #FFFFFF  /* Branco puro */
Texto Secondary:        #94A3B8  /* Cinza azulado */
```

### Bordas e Efeitos
```css
Bordas:                 rgba(255,255,255,0.08)  /* Branco 8% */
Glassmorphism Card:     rgba(255,255,255,0.05)  /* Branco 5% */
Premium Card:           rgba(17,24,39,0.7)      /* Background com opacidade */
```

### Status Colors (Cards)
```css
Status Azul:           #3B82F6  /* Para "Em execução", "Andamento" */
Status Verde:          #10B981  /* Para "Positivo" */
Status Âmbar:          #F59E0B  /* Para "Hoje" */
```

---

## Tipografia

### Font Family
```css
Font: Inter (Google Fonts)
Weights: 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)
```

### Tamanhos e Uso

```css
/* Título Principal Hero */
font-size: 48px - 60px
font-weight: 700
line-height: 120%
text-shadow: glow azul

/* Subtítulo Hero */
font-size: 18px
font-weight: 400
color: #94A3B8

/* Título do Card Auth */
font-size: 24px
font-weight: 700

/* Labels de Form */
font-size: 14px
font-weight: 500

/* Inputs e Botões */
font-size: 14px
font-weight: 500-600

/* Status Badges */
font-size: 12px
font-weight: 500

/* Footer */
font-size: 14px
font-weight: 400
```

---

## Componentes

### 1. Glass Card (Cards Flutuantes)
```css
backdrop-blur: 20px
background: rgba(255,255,255,0.05)
border: 1px solid rgba(255,255,255,0.08)
border-radius: 16px
box-shadow: 0 8px 32px rgba(0,0,0,0.2)
```

**Uso**: Cards de métricas, elementos secundários

### 2. Premium Card (Card de Auth)
```css
backdrop-blur: 30px
background: rgba(17,24,39,0.7)
border: 1px solid rgba(255,255,255,0.08)
border-radius: 24px
box-shadow: 0 25px 50px rgba(0,0,0,0.3)
padding: 40px
```

**Uso**: Formulários principais, modais importantes

### 3. Input
```css
height: 48px
padding: 12px 16px
border: 1px solid rgba(255,255,255,0.08)
border-radius: 12px
background: rgba(255,255,255,0.05)
backdrop-blur: 2px

/* Hover */
background: rgba(255,255,255,0.07)

/* Focus */
border-color: #2563EB
ring: 2px solid #2563EB
```

### 4. Button Primary
```css
height: 48px
padding: 12px 24px
border-radius: 12px
background: #2563EB
font-weight: 600

/* Hover */
background: #3B82F6
box-shadow: 0 0 40px rgba(59,130,246,0.5)

/* Active */
transform: scale(0.98)
```

### 5. Tabs
```css
/* Container */
background: rgba(255,255,255,0.05)
border: 1px solid rgba(255,255,255,0.08)
border-radius: 12px
padding: 4px

/* Tab Ativa */
background: #2563EB
color: #FFFFFF
box-shadow: 0 0 20px rgba(37,99,235,0.3)

/* Tab Inativa */
color: #94A3B8
```

### 6. Checkbox
```css
width: 20px
height: 20px
border: 1px solid rgba(255,255,255,0.08)
border-radius: 6px
background: rgba(255,255,255,0.05)

/* Checked */
background: #2563EB
border-color: #2563EB
```

---

## Animações

### 1. Float (Cards)
```css
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}
duration: 6s
easing: ease-in-out
```

### 2. Fade In
```css
@keyframes fadeIn {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}
duration: 0.5s
easing: ease-out
```

### 3. Glow Pulse
```css
@keyframes glow {
  0%, 100% { box-shadow: 0 0 20px rgba(37,99,235,0.3); }
  50% { box-shadow: 0 0 40px rgba(59,130,246,0.5); }
}
duration: 2s
easing: ease-in-out
```

### 4. Gradient Pulse
```css
animation: pulse
duration: 4s (primeiro gradient) / 6s (segundo)
easing: ease-in-out
delay: 0s / 2s
```

---

## Efeitos Especiais

### 1. Noise Texture
```css
Aplicado via ::before
Background: SVG fractal noise
Opacity: 0.03
Covering: 100% do container
```

### 2. Gradient Blur Background
```css
Gradiente 1:
- Size: 500px × 500px
- Position: top-left (25% from left)
- Color: rgba(37,99,235,0.2)
- Blur: 120px

Gradiente 2:
- Size: 600px × 600px
- Position: bottom-right (25% from right)
- Color: rgba(59,130,246,0.1)
- Blur: 150px
```

### 3. Particle Field
```css
50 partículas azuis
Size: 1px - 3px
Color: rgba(59,130,246, opacity 0.2-0.7)
Speed: 0.5px por frame
Movement: aleatório com wrap-around
```

### 4. Text Shadow Glow
```css
text-shadow: 0 0 30px rgba(59,130,246,0.3)
```

**Uso**: Títulos principais

---

## Espaçamentos

### Padding/Margin Scale
```css
xs:  4px   (0.5rem)
sm:  8px   (1rem)
md:  16px  (2rem)
lg:  24px  (3rem)
xl:  32px  (4rem)
2xl: 48px  (6rem)
3xl: 64px  (8rem)
```

### Grid/Gap
```css
Cards Grid: gap-4 lg:gap-6  (16px / 24px)
Form Fields: space-y-5      (20px vertical)
Sections: p-8 lg:p-16       (32px / 64px)
```

---

## Responsividade

### Breakpoints
```css
sm:  640px   /* Mobile landscape */
md:  768px   /* Tablet */
lg:  1024px  /* Desktop */
xl:  1280px  /* Large desktop */
2xl: 1536px  /* Extra large */
```

### Layout Grid
```css
Desktop (lg+):
- grid-cols-2
- 50% left / 50% right

Tablet/Mobile (< lg):
- grid-cols-1
- Stacked vertical
- Left column first, right column second
```

---

## Ícones

### Library: Lucide React

Ícones usados:
- `Car` - Veículos
- `Coins` - Caixa/Financeiro
- `Calendar` - Agendamentos
- `FileText` - Ordens de Serviço
- `Mail` - Email
- `Lock` - Senha
- `Building2` - Empresa
- `User` - Usuário
- `Phone` - WhatsApp
- `Check` - Checkbox marcado

Tamanho padrão: `w-4 h-4` ou `w-5 h-5`

---

## Estados Interativos

### Hover
```css
Transição: 200ms ease
Botões: background mais claro + glow
Inputs: background ligeiramente mais claro
Cards: background mais claro
Links: cor mais vibrante
```

### Focus
```css
Ring: 2px solid #2563EB
Ring Offset: 2px (cor do background)
Outline: none (substituído pelo ring)
```

### Active
```css
Botões: scale(0.98)
Duration: 100ms
```

### Disabled
```css
Opacity: 0.5
Pointer Events: none
Cursor: not-allowed
```

---

## Acessibilidade

### Contraste
- Texto branco (#FFFFFF) sobre backgrounds escuros: ✅ WCAG AAA
- Texto secundário (#94A3B8) sobre backgrounds escuros: ✅ WCAG AA
- Azul primário (#2563EB) sobre backgrounds escuros: ✅ WCAG AA

### Focus Visible
- Ring de 2px sempre visível no foco
- Cor contrastante (#2563EB)

### Semantic HTML
- Labels associadas a inputs via htmlFor
- Buttons com type explícito
- Form com onSubmit adequado

---

## Inspirações

### Stripe
- Clareza e simplicidade
- Confiabilidade visual
- Hierarquia bem definida

### Linear
- Velocidade e fluidez
- Animações sutis
- Interface minimalista

### Notion
- Elegância e sofisticação
- Uso inteligente de espaços
- Microinterações delicadas

### Vercel
- Design premium
- Efeitos de glassmorphism
- Gradientes e glows

---

## 🎯 Resultado

Uma interface de autenticação premium, moderna e profissional que transmite:

✅ **Confiança** - Design sólido e profissional  
✅ **Modernidade** - Efeitos visuais contemporâneos  
✅ **Qualidade** - Atenção aos detalhes  
✅ **Escalabilidade** - Sistema pronto para crescer  
✅ **Usabilidade** - Interface intuitiva e clara  

**Nível de qualidade:** SaaS avaliado em milhões de dólares! 🚀
