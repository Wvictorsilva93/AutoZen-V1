# 🚀 Deploy Hostinger - AutoZen V4

## ✅ Sistema Pronto para Deploy

O AutoZen está 100% pronto para deploy na Hostinger Node.js.

## 📋 Pré-requisitos

- ✅ Build funcionando (`npm run build` ✓)
- ✅ Variáveis de ambiente configuradas
- ✅ Supabase database criado
- ✅ Schema SQL aplicado
- ✅ Conta Hostinger com Node.js habilitado

---

## 🎯 Passo a Passo Completo

### 1️⃣ Preparar Projeto Local

```bash
# Garantir que está tudo atualizado
npm install

# Testar build local
npm run build

# Testar funcionamento
npm start
```

**Deve abrir em:** http://localhost:3000

---

### 2️⃣ Configurar Variáveis de Ambiente na Hostinger

1. Acesse: **Painel Hostinger** → **Websites** → **Seu Site**
2. Vá em: **Node.js** → **Environment Variables**
3. Adicione TODAS as variáveis:

```env
NEXT_PUBLIC_SUPABASE_URL=https://rpakyjmdijhmpqsnnjke.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwYWt5am1kaWpobXBxc25uamtlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0ODcyMDQsImV4cCI6MjA5NTA2MzIwNH0.HrP5BTGkIgjgKQRnxGnuTh9tJmIsCVtKtPSDhtL39sA
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwYWt5am1kaWpobXBxc25uamtlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTQ4NzIwNCwiZXhwIjoyMDk1MDYzMjA0fQ.tgE4L1MehD1nk6_szEAbj3uzzwvz9nik3lbHj2iAH_g
NEXT_PUBLIC_APP_URL=https://seudominio.com
NODE_ENV=production
```

**⚠️ IMPORTANTE:** Salve as variáveis ANTES de fazer o deploy!

---

### 3️⃣ Fazer Upload do Projeto

**Opção A: Via Git (Recomendado)**

1. Criar repositório Git:
```bash
git init
git add .
git commit -m "Deploy AutoZen V4"
```

2. No painel Hostinger:
   - Vá em **Git** → **Create Repository**
   - Conecte seu GitHub/GitLab
   - Configure deploy automático

**Opção B: Via FTP**

1. Compactar o projeto (exceto `node_modules` e `.next`):
```bash
# Windows
Compress-Archive -Path * -DestinationPath autozen.zip -Exclude node_modules,.next
```

2. No painel Hostinger:
   - Vá em **File Manager**
   - Faça upload do `autozen.zip`
   - Extraia na pasta do domínio

---

### 4️⃣ Configurar Node.js na Hostinger

1. No painel, vá em: **Node.js Application**
2. Configure:
   - **Application mode:** Production
   - **Application root:** `/public_html` (ou sua pasta)
   - **Application URL:** https://seudominio.com
   - **Application startup file:** `server.js`
   - **Node.js version:** 22.x (ou maior)

3. Clique em **Create**

---

### 5️⃣ Criar Script de Startup

Criar arquivo `server.js` na raiz:

```javascript
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = process.env.PORT || 3000

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('Internal server error')
    }
  })
    .once('error', (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`)
    })
})
```

---

### 6️⃣ Instalar Dependências no Servidor

Via terminal SSH na Hostinger:

```bash
cd /home/username/public_html
npm install
npm run build
```

Ou configurar script no painel:
- **Entry Point:** `npm start`
- **Build Command:** `npm install && npm run build`

---

### 7️⃣ Configurar .htaccess (Se necessário)

Se usar Apache, criar `.htaccess`:

```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]
```

---

### 8️⃣ Aplicar Schema SQL no Supabase

**⚠️ CRÍTICO: Faça isso antes de testar!**

1. Acesse: https://supabase.com/dashboard
2. SQL Editor → New Query
3. Cole o conteúdo de `supabase/schema.sql`
4. Execute (Run)
5. Aguarde: "Success. No rows returned"

---

### 9️⃣ Configurar Domínio

1. No painel Hostinger: **Domains**
2. Aponte para a aplicação Node.js
3. Configure SSL (Let's Encrypt - gratuito)
4. Aguarde propagação DNS (até 24h)

---

### 🔟 Testar Deploy

1. Acesse: https://seudominio.com
2. Deve aparecer a tela de login
3. Teste cadastro:
   - Criar nova empresa
   - Login
   - Dashboard
   - CRUD Clientes
   - CRUD Veículos

---

## 🐛 Troubleshooting

### Erro: "Module not found"
```bash
# Limpar e reinstalar
rm -rf node_modules .next
npm install
npm run build
```

### Erro: "Cannot find module 'next'"
```bash
# Verificar package.json
npm install next@latest
```

### Erro: "Failed to fetch" (Supabase)
1. Verificar variáveis de ambiente
2. Verificar URL do Supabase
3. Verificar CORS no Supabase:
   - Dashboard → Settings → API
   - Adicionar domínio em "Allowed Origins"

### Erro: "Supabase env missing"
1. Verificar variáveis no painel Hostinger
2. Reiniciar aplicação Node.js
3. Rebuild: `npm run build`

### Erro 500 Internal Server Error
```bash
# Ver logs
tail -f logs/error.log

# Ou no painel Hostinger
Node.js → Logs
```

### Site não carrega
1. Verificar se Node.js está rodando
2. Verificar porta (3000)
3. Verificar .htaccess
4. Verificar DNS

---

## ⚙️ Configurações Avançadas

### PM2 (Recomendado)

Se tiver acesso SSH:

```bash
npm install -g pm2

# Iniciar
pm2 start npm --name "autozen" -- start

# Salvar
pm2 save

# Auto-start no boot
pm2 startup
```

### Nginx (Se disponível)

Configurar proxy reverso:

```nginx
server {
    listen 80;
    server_name seudominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🔄 Atualização do Sistema

```bash
cd /home/username/public_html

# Pull das mudanças (se Git)
git pull

# Reinstalar dependências
npm install

# Rebuild
npm run build

# Reiniciar
pm2 restart autozen
# OU via painel Hostinger
```

---

## 📊 Monitoramento

### Logs
```bash
# Ver logs em tempo real
pm2 logs autozen

# Ou via painel
Hostinger → Node.js → Logs
```

### Status
```bash
pm2 status
pm2 monit
```

---

## 🔐 Segurança

1. **Firewall:**
```bash
# Permitir apenas 80, 443
ufw allow 80
ufw allow 443
ufw enable
```

2. **Headers de Segurança:**

Adicionar em `next.config.ts`:
```typescript
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'Referrer-Policy',
          value: 'origin-when-cross-origin',
        },
      ],
    },
  ]
}
```

---

## 📱 PWA (Opcional)

Para habilitar instalação como app:

1. Adicionar ícones em `/public`:
   - icon-192.png
   - icon-512.png

2. Manifest já configurado em `/public/manifest.json`

3. Service Worker (futuro)

---

## ✅ Checklist Final

- [ ] Variáveis de ambiente configuradas
- [ ] Schema SQL aplicado no Supabase
- [ ] Build funcionando localmente
- [ ] Projeto enviado para Hostinger
- [ ] Node.js application criada
- [ ] Dependências instaladas
- [ ] Build executado no servidor
- [ ] Domínio apontado
- [ ] SSL configurado
- [ ] Site acessível
- [ ] Login funcionando
- [ ] Cadastro funcionando
- [ ] Dashboard carregando
- [ ] CRUDs funcionando

---

## 🎉 Deploy Completo!

Seu AutoZen está no ar! 🚀

**URL:** https://seudominio.com

**Próximos passos:**
1. ✅ Testar todas as funcionalidades
2. ✅ Adicionar primeiros clientes de teste
3. ✅ Configurar backup automático
4. ✅ Monitorar performance
5. ✅ Marketing e vendas!

---

## 🆘 Suporte

**Documentação:**
- README.md
- AUTH_SETUP.md
- COMO_TESTAR.md
- FINAL.md

**Hostinger:**
- Suporte 24/7 via chat
- https://support.hostinger.com

**Supabase:**
- https://supabase.com/docs
- https://supabase.com/dashboard

**AutoZen:**
- Status do sistema: Rodando ✅
- Versão: 4.0.0
- Node.js: 22+
- Next.js: 15.5.19
