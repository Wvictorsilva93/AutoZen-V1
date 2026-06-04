# ⚡ Guia Rápido - AutoZen V2

## 🚀 Início em 3 Passos

```bash
# 1. Instalar
npm install

# 2. Rodar
npm run dev

# 3. Acessar
http://localhost:3000
```

---

## 📍 URLs Importantes

| URL | O que você verá |
|-----|-----------------|
| `/` | ✅ Tela de autenticação premium |
| `/dashboard` | ✅ Dashboard completo com KPIs |
| `/design-system` | ✅ Showcase de todos os componentes |

---

## 🎨 Usar Componentes (Copy & Paste)

### Botões

```tsx
import { Button } from "@/components/ui/button";

// Primário
<Button className="btn-primary h-10 px-4">Salvar</Button>

// Secundário
<Button className="btn-secondary h-10 px-4">Cancelar</Button>

// Com ícone
<Button className="btn-primary h-10 px-4">
  <Save className="w-4 h-4 mr-2" />
  Salvar
</Button>
```

### Badges

```tsx
import { Badge } from "@/components/ui/badge";

<Badge variant="success">Pago</Badge>
<Badge variant="warning">Pendente</Badge>
<Badge variant="error">Atrasado</Badge>
<Badge variant="info">Em análise</Badge>
<Badge variant="premium">Premium</Badge>
```

### Alerts

```tsx
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

<Alert variant="success">
  <AlertTitle>Sucesso!</AlertTitle>
  <AlertDescription>
    Sua operação foi realizada com sucesso.
  </AlertDescription>
</Alert>
```

### Cards

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Título do Card</CardTitle>
    <CardDescription>Descrição opcional</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Conteúdo do card aqui</p>
  </CardContent>
</Card>
```

### Card de Métrica (KPI)

```tsx
<Card className="card-stat">
  <p className="text-body-sm text-text-secondary mb-1">
    Faturamento
  </p>
  <p className="heading-2 text-text-primary">
    R$ 48.250,00
  </p>
  <Badge variant="success" className="mt-2">+12.5%</Badge>
</Card>
```

### Inputs

```tsx
import { Input } from "@/components/ui/input";

// Simples
<Input type="text" placeholder="Digite algo..." />

// Com ícone
<div className="relative">
  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
  <Input type="email" placeholder="seu@email.com" className="pl-11" />
</div>
```

### Loading (Skeleton)

```tsx
import { Skeleton } from "@/components/ui/skeleton";

// Normal
<Skeleton className="h-12 w-full" />

// Com shimmer
<Skeleton shimmer className="h-32 w-full" />
```

---

## 🎨 Classes CSS Prontas

### Botões
```tsx
className="btn-primary"      // Azul primário
className="btn-secondary"    // Com borda
className="btn-ghost"        // Sem fundo
className="btn-success"      // Verde
className="btn-warning"      // Amarelo
className="btn-error"        // Vermelho
```

### Cards
```tsx
className="card-primary"      // Card padrão
className="card-stat"         // Card de métrica
className="card-interactive"  // Card clicável
className="glass-card"        // Glass effect
```

### Tabelas
```tsx
<div className="table-container">
  <table className="w-full">
    <thead className="table-header">
      <tr>
        <th>Nome</th>
      </tr>
    </thead>
    <tbody>
      <tr className="table-row">
        <td>João</td>
      </tr>
    </tbody>
  </table>
</div>
```

---

## 🎨 Cores

```tsx
// Backgrounds
className="bg-background-primary"    // #0A0F1C
className="bg-background-secondary"  // #111827
className="bg-background-card"       // #151D2F
className="bg-background-hover"      // #1E293B

// Brand
className="bg-blue-primary"          // #2563EB
className="bg-blue-glow"             // #3B82F6

// Semantic
className="bg-success"               // #10B981
className="bg-warning"               // #F59E0B
className="bg-error"                 // #EF4444
className="bg-purple"                // #8B5CF6

// Text
className="text-text-primary"        // #FFFFFF
className="text-text-secondary"      // #94A3B8
```

---

## 📝 Tipografia

```tsx
<h1 className="display-xl">Display XL</h1>        // 60px
<h1 className="display-lg">Display LG</h1>        // 48px
<h1 className="heading-1">Heading 1</h1>          // 36px
<h2 className="heading-2">Heading 2</h2>          // 30px
<h3 className="heading-3">Heading 3</h3>          // 24px
<h4 className="heading-4">Heading 4</h4>          // 20px
<p className="text-body-lg">Body Large</p>        // 18px
<p className="text-body">Body</p>                 // 16px
<p className="text-body-sm">Body Small</p>        // 14px
<p className="text-caption">Caption</p>           // 12px
```

---

## 📐 Espaçamentos

```tsx
gap-4    // 4px
gap-8    // 8px
gap-12   // 12px
gap-16   // 16px
gap-20   // 20px
gap-24   // 24px
gap-32   // 32px
gap-40   // 40px
gap-48   // 48px
gap-64   // 64px
gap-80   // 80px
```

---

## 🔘 Border Radius

```tsx
rounded-input    // 12px - Inputs
rounded-card     // 20px - Cards
rounded-modal    // 24px - Modais
rounded-button   // 14px - Botões
rounded-badge    // 999px - Badges
```

---

## 🌑 Sombras

```tsx
shadow-sm              // Sutil
shadow-md              // Média
shadow-premium         // Premium
shadow-glow-blue       // Glow azul
shadow-glow-blue-strong // Glow forte
```

---

## ✨ Animações

```tsx
animate-fade-in         // Fade simples
animate-fade-in-up      // Fade + sobe
animate-scale-in        // Scale in
animate-float           // Flutuante
animate-glow            // Glow pulsante
animate-shimmer         // Shimmer
```

---

## 📱 Responsividade

```tsx
// Mobile first
<div className="w-full md:w-1/2 lg:w-1/3">
  
// Hide on mobile
<div className="hidden lg:block">

// Grid responsivo
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
```

### Breakpoints
- `sm:` - 640px
- `md:` - 768px (Tablet)
- `lg:` - 1024px (Desktop)
- `xl:` - 1280px
- `2xl:` - 1440px (Max container)

---

## 🎭 Layout Completo

```tsx
// app/(dashboard)/sua-pagina/page.tsx
export default function SuaPagina() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="heading-2">Título da Página</h1>
        <p className="text-body text-text-secondary mt-1">
          Descrição da página
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Seus cards aqui */}
      </div>

      {/* Conteúdo principal */}
      <Card>
        <CardHeader>
          <CardTitle>Seção</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Conteúdo */}
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## 🔍 Ícones (Lucide React)

```tsx
import { 
  Car,           // Veículos
  Users,         // Clientes
  Calendar,      // Agendamentos
  FileText,      // OS
  DollarSign,    // Financeiro
  Package,       // Estoque
  Settings,      // Configurações
  Search,        // Busca
  Plus,          // Adicionar
  Edit,          // Editar
  Trash2,        // Excluir
  Check,         // Confirmar
  X,             // Fechar
  ChevronRight,  // Seta direita
  ArrowUpRight,  // Trend up
  Loader2,       // Loading
} from "lucide-react";

// Uso
<Car className="w-5 h-5 text-blue-glow" />
```

---

## 🎯 Padrões Comuns

### Header de Página

```tsx
<div className="flex items-center justify-between">
  <div>
    <h1 className="heading-2">Dashboard</h1>
    <p className="text-body text-text-secondary mt-1">
      Visão geral do sistema
    </p>
  </div>
  <Button className="btn-primary h-10 px-4">
    Nova OS
  </Button>
</div>
```

### Grid de KPIs

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {stats.map((stat) => (
    <Card key={stat.title} className="card-stat">
      <p className="text-body-sm text-text-secondary mb-1">
        {stat.title}
      </p>
      <p className="heading-2 text-text-primary">
        {stat.value}
      </p>
      <Badge variant="success" className="mt-2">
        {stat.change}
      </Badge>
    </Card>
  ))}
</div>
```

### Tabela Simples

```tsx
<Card>
  <CardHeader>
    <CardTitle>Lista de Clientes</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="table-container">
      <table className="w-full">
        <thead className="table-header">
          <tr>
            <th className="px-6 py-4 text-left text-body-sm font-semibold">
              Nome
            </th>
            <th className="px-6 py-4 text-left text-body-sm font-semibold">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="table-row">
              <td className="px-6 py-4 text-body-sm">
                {item.nome}
              </td>
              <td className="px-6 py-4">
                <Badge variant="success">{item.status}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </CardContent>
</Card>
```

---

## 📚 Documentação Completa

| Arquivo | Conteúdo |
|---------|----------|
| `DESIGN_SYSTEM_V2.md` | ⭐ Design System completo |
| `ATUALIZACAO_V2.md` | Guia de migração V1→V2 |
| `CHANGELOG_V2.md` | Histórico de mudanças |
| `EXEMPLOS_CODIGO.md` | Exemplos práticos |

---

## 🆘 Problemas?

### Componente não aparece
```bash
# Limpar cache
rm -rf .next
npm run dev
```

### Classes não funcionam
```bash
# Reinstalar
npm install
```

### Ver todos componentes
```
http://localhost:3000/design-system
```

---

## 🎉 Pronto!

Você tem tudo para criar interfaces **enterprise premium**!

**Dica:** Acesse `/design-system` para copiar e colar exemplos visuais.

---

**AutoZen V2** - Design System Enterprise 🚀
