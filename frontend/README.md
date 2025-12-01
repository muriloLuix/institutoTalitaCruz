# Instituto Talita Cruz - Frontend

Site institucional e ecommerce para a Coach/Professora de Inglês Talita Cruz.

## ?? Tecnologias

- React 19
- TypeScript
- Vite
- React Router DOM

## ?? Funcionalidades

### Página Inicial (Landing Page)
- **Hero Section**: Apresentação principal com call-to-action
- **Vídeo de Apresentação**: Seção para vídeo do YouTube ou local
- **Seção Hotmart**: Destaque para produtos vendidos no Hotmart (livros)
- **Seção Loja**: Apresentação do ecommerce interno
- **Biografia**: Sobre a professora Talita Cruz
- **FAQ**: Perguntas frequentes
- **Contato**: Formulário de contato

### Página de Loja
- Catálogo de produtos (livros, mentorias, cursos, materiais)
- Filtros por categoria
- Integração com API do backend (configurável)

### Componentes Globais
- **Header**: Navegação responsiva
- **Footer**: Informações e links
- **Chat**: Widget de chat online (visual pronto para integração com API externa)

## ?? Design

O site utiliza uma paleta de cores elegante baseada nas logos:
- **Preto** (#000000)
- **Dourado** (#d4af37)
- **Cinza escuro** (#1a1a1a)
- **Gradientes dourados** para destaques

## ?? Configuração

### Instalação

```bash
npm install
```

### Desenvolvimento

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## ?? Configurações Necessárias

### 1. URL do Vídeo de Apresentação

Edite `src/components/VideoSection.tsx` e configure a variável `videoUrl`:

```typescript
const videoUrl = 'https://www.youtube.com/watch?v=SEU_VIDEO_ID';
// ou para vídeo local:
// const videoUrl = '/videos/apresentacao.mp4';
```

### 2. URL do Hotmart

Edite `src/components/HotmartSection.tsx` e configure a variável `hotmartUrl`:

```typescript
const hotmartUrl = 'https://seu-link-hotmart.com';
```

### 3. API do Backend

Crie um arquivo `.env` na raiz do frontend com:

```
VITE_API_BASE_URL=http://localhost:8000/api
```

Ajuste a URL conforme necessário. Os endpoints estão configurados em `src/config/api.ts`.

### 4. Informações de Contato

Edite `src/components/Contato.tsx` para atualizar:
- E-mail
- WhatsApp
- Horário de atendimento

### 5. Integração do Chat

O componente Chat está pronto visualmente. Para integrar com uma API externa:

1. Edite `src/components/Chat.tsx`
2. Substitua a simulação de resposta pela chamada real à API
3. Configure os endpoints em `src/config/api.ts`

## ?? Responsividade

O site é totalmente responsivo e otimizado para:
- Desktop (1920px+)
- Tablet (768px - 1024px)
- Mobile (320px - 768px)

## ?? Rotas

- `/` - Página inicial (Landing Page)
- `/loja` - Catálogo de produtos (Ecommerce)

## ?? Notas

- O backend deve implementar os endpoints definidos em `src/config/api.ts`
- As imagens dos produtos devem ser adicionadas conforme necessário
- O formulário de contato está preparado para enviar dados ao backend
- O chat está apenas com visual, aguardando integração com API externa

## ?? Próximos Passos

1. Configurar URL do vídeo de apresentação
2. Configurar link do Hotmart
3. Implementar backend com os endpoints necessários
4. Integrar chat com API externa
5. Adicionar imagens reais dos produtos
6. Configurar informações de contato reais
