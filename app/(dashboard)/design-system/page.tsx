import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Search, Download, Trash2 } from "lucide-react";

export default function DesignSystemPage() {
  return (
    <div className="p-6 space-y-12 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="heading-1">Design System</h1>
        <p className="text-body text-text-secondary mt-2">
          Componentes e padrões do AutoZen
        </p>
      </div>

      {/* Typography */}
      <section className="space-y-6">
        <h2 className="heading-2">Tipografia</h2>
        <Card>
          <CardContent className="space-y-4 pt-6">
            <div>
              <p className="text-caption text-text-secondary mb-1">Display XL</p>
              <p className="display-xl">Grandes Títulos</p>
            </div>
            <Separator />
            <div>
              <p className="text-caption text-text-secondary mb-1">Display LG</p>
              <p className="display-lg">Títulos Principais</p>
            </div>
            <Separator />
            <div>
              <p className="text-caption text-text-secondary mb-1">Heading 1</p>
              <h1 className="heading-1">Título de Página</h1>
            </div>
            <Separator />
            <div>
              <p className="text-caption text-text-secondary mb-1">Heading 2</p>
              <h2 className="heading-2">Subtítulo Principal</h2>
            </div>
            <Separator />
            <div>
              <p className="text-caption text-text-secondary mb-1">Heading 3</p>
              <h3 className="heading-3">Título de Card</h3>
            </div>
            <Separator />
            <div>
              <p className="text-caption text-text-secondary mb-1">Body</p>
              <p className="text-body">
                Texto padrão do sistema. Lorem ipsum dolor sit amet consectetur.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Colors */}
      <section className="space-y-6">
        <h2 className="heading-2">Cores</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="w-full h-20 rounded-card bg-blue-primary mb-3"></div>
              <p className="text-body-sm font-medium">Blue Primary</p>
              <p className="text-caption text-text-secondary">#2563EB</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="w-full h-20 rounded-card bg-success mb-3"></div>
              <p className="text-body-sm font-medium">Success</p>
              <p className="text-caption text-text-secondary">#10B981</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="w-full h-20 rounded-card bg-warning mb-3"></div>
              <p className="text-body-sm font-medium">Warning</p>
              <p className="text-caption text-text-secondary">#F59E0B</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="w-full h-20 rounded-card bg-error mb-3"></div>
              <p className="text-body-sm font-medium">Error</p>
              <p className="text-caption text-text-secondary">#EF4444</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Buttons */}
      <section className="space-y-6">
        <h2 className="heading-2">Botões</h2>
        <Card>
          <CardContent className="pt-6 space-y-6">
            <div>
              <p className="text-body-sm font-medium mb-3">Variantes</p>
              <div className="flex flex-wrap gap-3">
                <Button className="btn-primary">Primary</Button>
                <Button className="btn-secondary">Secondary</Button>
                <Button className="btn-ghost">Ghost</Button>
                <Button className="btn-success">Success</Button>
                <Button className="btn-warning">Warning</Button>
                <Button className="btn-error">Error</Button>
              </div>
            </div>
            <Separator />
            <div>
              <p className="text-body-sm font-medium mb-3">Com Ícones</p>
              <div className="flex flex-wrap gap-3">
                <Button className="btn-primary">
                  <Search className="w-4 h-4 mr-2" />
                  Buscar
                </Button>
                <Button className="btn-secondary">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button className="btn-error">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir
                </Button>
              </div>
            </div>
            <Separator />
            <div>
              <p className="text-body-sm font-medium mb-3">Tamanhos</p>
              <div className="flex flex-wrap items-center gap-3">
                <Button className="btn-primary h-8 px-3 text-body-sm">Pequeno</Button>
                <Button className="btn-primary h-10 px-4">Médio</Button>
                <Button className="btn-primary h-12 px-6">Grande</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Inputs */}
      <section className="space-y-6">
        <h2 className="heading-2">Inputs</h2>
        <Card>
          <CardContent className="pt-6 space-y-4">
            <Input type="text" placeholder="Input padrão" />
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <Input type="text" placeholder="Input com ícone" className="pl-11" />
            </div>
            <Input type="text" placeholder="Input desabilitado" disabled />
            <Input type="text" placeholder="Input com erro" className="input-error" />
          </CardContent>
        </Card>
      </section>

      {/* Badges */}
      <section className="space-y-6">
        <h2 className="heading-2">Badges</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-3">
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="error">Error</Badge>
              <Badge variant="info">Info</Badge>
              <Badge variant="premium">Premium</Badge>
              <Badge variant="default">Default</Badge>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Alerts */}
      <section className="space-y-6">
        <h2 className="heading-2">Alerts</h2>
        <div className="space-y-4">
          <Alert variant="success">
            <AlertTitle>Sucesso!</AlertTitle>
            <AlertDescription>
              Sua operação foi realizada com sucesso.
            </AlertDescription>
          </Alert>
          <Alert variant="warning">
            <AlertTitle>Atenção</AlertTitle>
            <AlertDescription>
              Esta ação requer sua atenção.
            </AlertDescription>
          </Alert>
          <Alert variant="error">
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>
              Ocorreu um erro ao processar sua solicitação.
            </AlertDescription>
          </Alert>
          <Alert variant="info">
            <AlertTitle>Informação</AlertTitle>
            <AlertDescription>
              Aqui está uma informação importante para você.
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* Cards */}
      <section className="space-y-6">
        <h2 className="heading-2">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Card Simples</CardTitle>
              <CardDescription>Descrição do card</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-body-sm text-text-secondary">
                Conteúdo do card aqui.
              </p>
            </CardContent>
          </Card>

          <Card className="card-stat">
            <p className="text-body-sm text-text-secondary mb-1">
              Faturamento
            </p>
            <p className="heading-2 text-text-primary">R$ 48.250</p>
            <Badge variant="success" className="mt-2">+12.5%</Badge>
          </Card>

          <Card className="card-interactive">
            <CardHeader>
              <CardTitle>Card Interativo</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-body-sm text-text-secondary">
                Este card é clicável
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Skeleton */}
      <section className="space-y-6">
        <h2 className="heading-2">Loading States</h2>
        <Card>
          <CardContent className="pt-6 space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-8 w-1/2" />
            <div className="pt-4">
              <p className="text-caption text-text-secondary mb-3">Com Shimmer:</p>
              <Skeleton shimmer className="h-32 w-full" />
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
