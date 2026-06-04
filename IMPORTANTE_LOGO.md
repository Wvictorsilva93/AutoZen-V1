# ⚠️ IMPORTANTE: Configuração da Logo

## 📸 Adicionar Logo AutoZen

A logo do AutoZen que você forneceu precisa ser salva no projeto para que apareça na tela de autenticação.

### Passos:

1. **Salvar a imagem da logo**
   - A logo está na imagem que você enviou
   - Você pode extrair/recortar apenas a parte da logo (símbolo AZ + texto AUTOZEN)
   - Ou usar a imagem completa com o fundo preto

2. **Nomear o arquivo**
   - Nome do arquivo: `logo-autozen.png`
   - Formato recomendado: PNG com fundo transparente (melhor resultado visual)
   - Formato alternativo: PNG com fundo preto (também funciona)

3. **Colocar na pasta correta**
   ```
   AutoZen/
   └── public/
       └── logo-autozen.png  ← Cole aqui
   ```

4. **Tamanho recomendado da imagem**
   - Largura: 800px - 1200px (será redimensionada automaticamente)
   - Altura: proporcional
   - O Next.js irá otimizar automaticamente

## 🎨 Cores da Logo na Interface

A logo do AutoZen usa as cores:
- **Branco/Cinza**: `#FFFFFF` e gradiente cinza
- **Azul Cyan**: `#00D9FF` (cor turquesa da logo)

Estas cores complementam perfeitamente a paleta azul do sistema:
- Background: `#0A0F1C` (azul escuro profundo)
- Azul primário: `#2563EB`
- Azul glow: `#3B82F6`

## ✅ Verificar se Funcionou

Após adicionar a logo:

1. Execute o projeto:
   ```bash
   npm run dev
   ```

2. Abra `http://localhost:3000`

3. A logo deve aparecer no canto superior esquerdo da tela

## 🔧 Alternativa Temporária

Se você não tiver a logo em arquivo separado agora, o sistema irá:
- Mostrar um erro de imagem no console (normal, não quebra nada)
- Você pode temporariamente comentar a linha da logo no arquivo `components/auth/AuthScreen.tsx`

Para comentar temporariamente:
```tsx
{/* <Image
  src="/logo-autozen.png"
  alt="AutoZen"
  width={200}
  height={60}
  className="h-12 w-auto"
  priority
/> */}
```

Ou substituir por texto:
```tsx
<div className="text-3xl font-bold text-blue-glow">
  AutoZen
</div>
```

## 📝 Extração da Logo

Se precisar extrair a logo da imagem fornecida:

1. Abra a imagem em um editor (Photoshop, GIMP, Figma, etc.)
2. Selecione apenas a parte da logo (círculo AZ + texto AUTOZEN)
3. Exporte como PNG com fundo transparente
4. Salve como `logo-autozen.png`
5. Cole na pasta `public/`

Pronto! 🚀
