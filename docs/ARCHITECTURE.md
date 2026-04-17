# Arquitetura do MackSeguro

Guia completo da estrutura do projeto. Se voce quer saber **onde mexer** para fazer uma alteracao, este e o documento certo.

---

## Visao Geral

MackSeguro e uma SPA (Single Page Application) construida com React. O app roda inteiramente no navegador do usuario. Nao existe servidor backend proprio — usamos dois servicos externos:

- **Clerk** — cuida do login/cadastro dos usuarios
- **Supabase** — banco de dados PostgreSQL na nuvem (salva progresso e forum)

```
Navegador do Usuario
    |
    |--- React (interface, paginas, logica)
    |       |
    |       |--- localStorage (salva dados offline)
    |       |
    |       |--- Clerk (login / cadastro)
    |       |
    |       +--- Supabase (banco de dados remoto, opcional)
    |
    +--- Vercel (hospedagem dos arquivos estaticos)
```

---

## Stack Tecnologica

| Camada | Tecnologia | Versao | Para que serve |
|--------|-----------|--------|----------------|
| Framework | React | 19 | Construir a interface |
| Linguagem | TypeScript | 5.9 | JavaScript com tipos (menos bugs) |
| Build | Vite | 7 | Compilar e servir o projeto |
| Estilo | Tailwind CSS | 4 | Classes utilitarias para CSS |
| Rotas | React Router DOM | 7 | Navegacao entre paginas |
| Auth | Clerk | 6 | Login, cadastro, sessao |
| Banco | Supabase | 2 | PostgreSQL + RLS na nuvem |
| PDF | jsPDF + html2canvas | — | Gerar certificados em PDF |
| Icones | Lucide React | — | Icones SVG |
| Testes | Vitest + Testing Library | — | Testes unitarios |
| Deploy | Vercel | — | Hospedagem |

---

## Estrutura de Pastas

```
mackseguro/
├── public/                     # Arquivos estaticos (favicon, imagens)
├── src/
│   ├── main.tsx                # Ponto de entrada — monta o React no DOM
│   ├── App.tsx                 # Define TODAS as rotas e integra Clerk+Supabase
│   ├── index.css               # Estilos globais e design tokens (cores, fontes)
│   │
│   ├── pages/                  # Paginas — cada arquivo = uma tela do site
│   │   ├── Home.tsx            # Pagina inicial (hero, estatisticas, pilares)
│   │   ├── Trilhas.tsx         # Lista de trilhas de aprendizado
│   │   ├── TrilhaDetalhe.tsx   # Detalhe de uma trilha (modulos, progresso)
│   │   ├── ModuloConteudo.tsx  # Conteudo do modulo (video, texto, quiz, forum)
│   │   ├── Materiais.tsx       # Materiais para download (PDFs, ebooks)
│   │   ├── Pilulas.tsx         # Dicas rapidas de seguranca
│   │   ├── Eventos.tsx         # Palestras, workshops, mesas redondas
│   │   ├── Sobre.tsx           # Sobre o projeto
│   │   └── Perfil.tsx          # Perfil do usuario (XP, badges, certificado)
│   │
│   ├── components/             # Componentes reutilizaveis
│   │   ├── auth/               # Componentes de autenticacao
│   │   │   └── CourseAccessGate.tsx  # Protege rotas que exigem login
│   │   ├── layout/             # Navbar, Footer
│   │   ├── profile/            # Geracao de certificado, avatar
│   │   ├── seo/                # Componente de meta tags
│   │   └── system/             # Error boundary
│   │
│   ├── lib/                    # Logica de negocios (CORE do app)
│   │   ├── supabaseConfig.ts   # Inicializa o cliente Supabase
│   │   ├── clerkConfig.ts      # Configuracao do Clerk
│   │   ├── userData.ts         # CRUD de dados do usuario (localStorage)
│   │   ├── remotePersistence.ts # Sincroniza localStorage <-> Supabase
│   │   ├── forumRemote.ts      # Operacoes remotas do forum
│   │   └── gamification/       # Sistema de badges e XP
│   │       └── badges.ts       # Calculo de conquistas
│   │
│   ├── hooks/                  # Custom hooks do React
│   ├── data/                   # Dados e tipos
│   │   └── mock.ts             # TODO CONTEUDO DO SITE (trilhas, modulos, quiz)
│   └── test/                   # Configuracao de testes
│
├── supabase-rls.sql            # Schema do banco + politicas de seguranca (RLS)
├── vercel.json                 # Configuracao de deploy
├── package.json                # Dependencias e scripts
├── tsconfig.json               # Configuracao do TypeScript
└── vite.config.ts              # Configuracao do Vite
```

---

## Onde Alterar o Que

Esta e a referencia principal. Encontre o que voce quer fazer e veja onde mexer:

### Conteudo Educacional

| Eu quero... | Arquivo | O que mexer |
|-------------|---------|-------------|
| Adicionar um modulo a uma trilha | `src/data/mock.ts` | Array `trilhas` (adicionar modulo) + array `conteudosModulos` (adicionar conteudo) |
| Editar texto de um modulo | `src/data/mock.ts` | Campo `conteudo` dentro de `conteudosModulos` |
| Adicionar perguntas ao quiz | `src/data/mock.ts` | Campo `questoes` dentro de `conteudosModulos` |
| Adicionar material para download | `src/data/mock.ts` | Array `materiais` |
| Adicionar pilula/dica rapida | `src/data/mock.ts` | Array `pilulas` |
| Adicionar evento | `src/data/mock.ts` | Array `eventos` |
| Criar uma trilha nova inteira | `src/data/mock.ts` | Novo objeto em `trilhas` + novos conteudos em `conteudosModulos` |

### Interface e Visual

| Eu quero... | Arquivo | O que mexer |
|-------------|---------|-------------|
| Mudar cores do tema | `src/index.css` | Bloco `@theme` (variaveis CSS) |
| Mudar a navbar | `src/components/layout/Navbar.tsx` | Componente Navbar |
| Mudar o footer | `src/components/layout/Footer.tsx` | Componente Footer |
| Mudar o layout de uma pagina | `src/pages/[Pagina].tsx` | O arquivo da pagina correspondente |
| Adicionar uma rota/pagina nova | `src/App.tsx` | Adicionar `<Route>` e importar a pagina |

### Autenticacao e Dados

| Eu quero... | Arquivo | O que mexer |
|-------------|---------|-------------|
| Mudar config do Clerk | `src/lib/clerkConfig.ts` | Configuracoes de chaves |
| Mudar config do Supabase | `src/lib/supabaseConfig.ts` | URL e chave anonima |
| Mudar como o progresso e salvo | `src/lib/userData.ts` | Funcoes de persistencia |
| Mudar sync com banco remoto | `src/lib/remotePersistence.ts` | Funcoes de sincronizacao |
| Mudar regras de seguranca do banco | `supabase-rls.sql` | Policies de RLS |
| Mudar como badges sao calculados | `src/lib/gamification/badges.ts` | Logica de conquistas |

### Projeto e Deploy

| Eu quero... | Arquivo | O que mexer |
|-------------|---------|-------------|
| Adicionar dependencia | Terminal | `npm install pacote` |
| Mudar variaveis de ambiente | `.env.local` | Chaves e flags |
| Mudar config de deploy | `vercel.json` | Configuracao da Vercel |
| Mudar config de testes | `vite.config.ts` | Secao `test` |

---

## Fluxo de Dados

### Como o conteudo chega na tela

```
mock.ts (dados hardcoded)
    |
    v
Pagina (ex: Trilhas.tsx) importa os dados
    |
    v
React renderiza os componentes com os dados
    |
    v
Usuario ve a trilha no navegador
```

### Como o progresso do usuario e salvo

```
Usuario completa um modulo/quiz
    |
    v
userData.ts salva no localStorage do navegador
    |
    v
[Se Supabase habilitado]
remotePersistence.ts envia para o banco na nuvem
    |
    v
Quando o usuario faz login em outro dispositivo,
o progresso remoto e sincronizado de volta
```

### Como a autenticacao funciona

```
Usuario clica em "Entrar"
    |
    v
Clerk exibe formulario de login (gerenciado por eles)
    |
    v
Usuario autenticado recebe um JWT (token)
    |
    v
App usa esse token para fazer requests ao Supabase
    |
    v
Supabase verifica o token e aplica RLS
(usuario so ve/edita SEUS proprios dados)
```

---

## Variaveis de Ambiente

Arquivo: `.env.local` (nunca commitar esse arquivo!)

```env
# Obrigatorio — sem isso o login nao funciona
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...

# Opcional — sem isso o app funciona offline (so localStorage)
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...

# Flags de controle
VITE_ENABLE_SUPABASE_SYNC=true      # Salvar progresso no banco?
VITE_ENABLE_SUPABASE_READS=true     # Carregar progresso do banco?
VITE_REQUIRE_AUTH_FOR_COURSE=false   # Exigir login para acessar modulos?
```

**Regra importante:** se as variaveis do Supabase estiverem vazias, o app funciona normalmente usando apenas localStorage. Nada quebra.

---

## Schema do Banco de Dados

4 tabelas no Supabase, todas protegidas por RLS:

```
module_progress          forum_comments
├── user_id              ├── author_id
├── trail_slug           ├── trail_slug
├── module_id            ├── module_id
├── completed            ├── content
├── quiz_score           ├── parent_id (respostas)
└── quiz_total           └── created_at

forum_comment_likes      forum_comment_reports
├── comment_id           ├── comment_id
├── user_id              ├── user_id
└── created_at           └── reason
```

O schema completo com policies esta em `supabase-rls.sql`.

---

## Comandos Essenciais

```bash
npm install          # Instala dependencias
npm run dev          # Inicia servidor local (http://localhost:5173)
npm run build        # Compila para producao
npm run test         # Roda testes
npm run preview      # Preview da build de producao
```
