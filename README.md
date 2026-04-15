<p align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Mackenzie_logo.svg/640px-Mackenzie_logo.svg.png" alt="Mackenzie" height="80" />
</p>

<h1 align="center">🛡️ MackSeguro</h1>

<p align="center">
  Plataforma educacional open source do <strong>Instituto Presbiteriano Mackenzie</strong><br/>
  sobre <strong>Segurança Digital</strong> e <strong>Saúde Online</strong> para a comunidade.
</p>

<p align="center">
  <a href="#-início-rápido">Início Rápido</a> •
  <a href="#-arquitetura">Arquitetura</a> •
  <a href="#-como-contribuir">Como Contribuir</a> •
  <a href="#-equipes">Equipes</a> •
  <a href="#-roadmap">Roadmap</a>
</p>

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Stack Tecnológica](#-stack-tecnológica)
- [Início Rápido](#-início-rápido)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Arquitetura](#-arquitetura)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Guia de Funcionalidades](#-guia-de-funcionalidades)
- [Banco de Dados (Supabase)](#-banco-de-dados-supabase)
- [Autenticação (Clerk)](#-autenticação-clerk)
- [Como Contribuir](#-como-contribuir)
- [Equipes](#-equipes)
- [Roadmap](#-roadmap)
- [Licença](#-licença)

---

## 🎯 Sobre o Projeto

O **MackSeguro** é um projeto extensionista vinculado ao Instituto Presbiteriano Mackenzie. A plataforma oferece **trilhas de aprendizado interativas** sobre segurança digital e saúde online, voltadas ao público geral — incluindo idosos, jovens, trabalhadores e educadores.

### Funcionalidades Atuais

| Funcionalidade | Descrição |
|---|---|
| **Trilhas de Aprendizado** | Cursos modulares com conteúdo teórico, vídeo-aulas do YouTube e questionários de fixação |
| **Quiz com Pontuação** | Perguntas de múltipla escolha ao final de cada módulo, com feedback imediato e rastreamento de XP |
| **Fórum por Módulo** | Sistema de comentários com likes, respostas e denúncias, vinculado a cada aula |
| **Progresso Sincronizado** | Progresso do aluno salvo localmente e sincronizado com Supabase (cross-device) |
| **Autenticação** | Login/cadastro social via Clerk (Google, GitHub, etc.) |
| **Materiais Gratuitos** | PDFs, cartilhas, e-books e infográficos disponíveis para download |
| **Pílulas de Segurança** | Dicas rápidas e práticas sobre ameaças digitais |
| **Eventos** | Agenda de palestras, workshops e mesas-redondas do projeto |
| **SEO** | Tags meta dinâmicas via componente `<Seo />` em todas as páginas |

### Trilhas Disponíveis

1. **Segurança Digital para Todos** (5 módulos / 500 XP) — Senhas, phishing, privacidade, Wi-Fi, dispositivos
2. **Saúde Digital e Bem-Estar** (4 módulos / 400 XP) — Tempo de tela, cyberbullying, fake news, equilíbrio

---

## 🧰 Stack Tecnológica

| Camada | Tecnologia | Versão |
|---|---|---|
| **Framework** | React | 19.x |
| **Build Tool** | Vite | 7.x |
| **Linguagem** | TypeScript | 5.9 |
| **Estilização** | Tailwind CSS | 4.x |
| **Roteamento** | React Router DOM | 7.x |
| **Ícones** | Lucide React | 0.577 |
| **Autenticação** | Clerk (`@clerk/react`) | 6.x |
| **Banco de Dados** | Supabase (`@supabase/supabase-js`) | 2.x |
| **Testes** | Vitest + Testing Library | 3.x |
| **Deploy** | Vercel | — |

---

## 🚀 Início Rápido

### Pré-requisitos

- **Node.js** ≥ 18
- **npm** ≥ 9
- Conta no [Clerk](https://clerk.com) (autenticação)
- Conta no [Supabase](https://supabase.com) (banco de dados) — *opcional para desenvolvimento local*

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/kenzofujimoto/mackseguro.git
cd mackseguro

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas chaves (veja a seção abaixo)

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

### Scripts Disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento (Vite) |
| `npm run build` | Compila TypeScript e gera o build de produção |
| `npm run preview` | Serve o build de produção localmente |
| `npm run test` | Executa os testes com relatório de cobertura |
| `npm run test:watch` | Executa os testes em modo de observação |

---

## 🔑 Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto baseado no `.env.example`:

```env
# === OBRIGATÓRIA ===
VITE_CLERK_PUBLISHABLE_KEY=pk_test_sua_chave_do_clerk

# === ACESSO AOS CURSOS ===
VITE_REQUIRE_AUTH_FOR_COURSE=false
# true  → exige login para acessar os módulos
# false → módulos abertos sem login (padrão)

# === SUPABASE (persistência remota) ===
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_anon_key

# === FLAGS DE SINCRONIZAÇÃO ===
VITE_ENABLE_SUPABASE_SYNC=false
# true  → grava o progresso e o fórum no Supabase
# false → usa apenas localStorage (padrão)

VITE_ENABLE_SUPABASE_READS=false
# true  → lê progresso e fórum do Supabase (cross-device)
# false → lê apenas do localStorage (padrão)
```

> **⚠️ Importante:** Para habilitar a sincronização cross-device, **ambas** as flags `VITE_ENABLE_SUPABASE_SYNC` e `VITE_ENABLE_SUPABASE_READS` devem estar como `true`, e o Clerk deve estar configurado com o template JWT `supabase` (veja a seção de Autenticação).

---

## 🏗️ Arquitetura

```
┌────────────┐     ┌──────────┐     ┌──────────────┐
│   Vercel   │────▶│  Vite +  │────▶│  React 19    │
│  (Deploy)  │     │  Build   │     │  SPA Router  │
└────────────┘     └──────────┘     └──────┬───────┘
                                           │
                    ┌──────────────────────┼──────────────────────┐
                    │                      │                      │
              ┌─────▼─────┐         ┌──────▼──────┐       ┌──────▼──────┐
              │   Clerk   │         │ localStorage │       │  Supabase   │
              │  (Auth)   │         │  (Progresso  │       │ (Postgres)  │
              │           │         │   + Fórum)   │       │             │
              └─────┬─────┘         └──────────────┘       └──────┬──────┘
                    │                                             │
                    └─────────────── JWT Token ───────────────────┘
```

### Fluxo de Dados do Progresso

1. Aluno completa um quiz → `markModuleCompleted()` salva no **localStorage**
2. Se `SUPABASE_SYNC=true` → `queueRemoteModuleProgressSync()` grava no **Supabase** (fire-and-forget)
3. Ao fazer login em outro dispositivo → `syncRemoteProgressToLocal()` busca do Supabase e faz **merge bidirecional** com o localStorage

---

## 📁 Estrutura de Pastas

```
mackseguro/
├── public/                     # Arquivos estáticos (imagens, materiais)
├── src/
│   ├── App.tsx                 # Roteamento + integração Clerk/Supabase
│   ├── main.tsx                # Ponto de entrada (ClerkProvider + BrowserRouter)
│   ├── index.css               # Design system (CSS custom properties)
│   ├── components/
│   │   ├── auth/               # CourseAccessGate (gate de login p/ cursos)
│   │   ├── layout/             # Navbar, Footer
│   │   ├── seo/                # Componente <Seo /> para meta tags dinâmicas
│   │   └── system/             # Componentes utilitários do sistema
│   ├── data/
│   │   └── mock.ts             # Dados de trilhas, módulos, quizzes, materiais etc.
│   ├── hooks/
│   │   └── useUserDataRefresh.ts   # Hook para re-renderizar ao mudar o progresso
│   ├── lib/
│   │   ├── clerkConfig.ts      # Validação da publishable key do Clerk
│   │   ├── supabaseConfig.ts   # Criação e configuração do client Supabase
│   │   ├── userData.ts         # Gerenciamento de progresso e fórum (localStorage)
│   │   ├── remotePersistence.ts # Operações de escrita no Supabase (upsert/delete)
│   │   └── forumRemote.ts      # Leitura de comentários do fórum via Supabase
│   ├── pages/
│   │   ├── Home.tsx            # Landing page com trilhas, pílulas e estatísticas
│   │   ├── Trilhas.tsx         # Listagem de todas as trilhas
│   │   ├── TrilhaDetalhe.tsx   # Detalhe de uma trilha (lista de módulos)
│   │   ├── ModuloConteudo.tsx  # Conteúdo do módulo (vídeo, texto, quiz, fórum)
│   │   ├── Materiais.tsx       # Materiais para download
│   │   ├── Pilulas.tsx         # Dicas rápidas de segurança
│   │   ├── Eventos.tsx         # Agenda de eventos
│   │   ├── Sobre.tsx           # Sobre o projeto
│   │   ├── AuthSignIn.tsx      # Página de login (Clerk)
│   │   └── AuthSignUp.tsx      # Página de cadastro (Clerk)
│   └── test/                   # Configuração de testes
├── supabase-rls.sql            # Schema do banco + políticas RLS
├── .env.example                # Template de variáveis de ambiente
├── vercel.json                 # Configuração de rewrites para SPA
├── vite.config.ts              # Configuração do Vite
└── tsconfig.json               # Configuração do TypeScript
```

---

## 📖 Guia de Funcionalidades

### Onde editar o conteúdo das trilhas e módulos

Todo o conteúdo pedagógico está em **`src/data/mock.ts`**. Este arquivo contém:

- `trilhas[]` — Definição das trilhas (título, slug, módulos, XP)
- `conteudosModulos[]` — Conteúdo de cada módulo (textos, questões, vídeo)
- `materiais[]` — Materiais para download
- `pilulas[]` — Dicas rápidas
- `eventos[]` — Agenda de eventos

**Para adicionar um novo módulo:**
1. Adicione o módulo no array `modulos` da trilha correspondente em `trilhas[]`
2. Adicione o conteúdo do módulo em `conteudosModulos[]` com o `trilhaSlug` e `moduloId` corretos
3. A rota será gerada automaticamente: `/trilhas/{slug}/modulo/{id}`

### Onde editar o visual

- **Design tokens:** `src/index.css` (cores, fontes, espaçamentos via CSS custom properties)
- **Layout global:** `src/components/layout/Navbar.tsx` e `Footer.tsx`
- **Cards e botões:** As classes utilitárias como `card-mk`, `btn-primary`, `btn-outline` estão definidas no `index.css`

### Onde editar a autenticação

- **Configuração do Clerk:** `src/lib/clerkConfig.ts`
- **Gate de acesso:** `src/components/auth/CourseAccessGate.tsx`
- **Integração Clerk+Supabase:** `src/App.tsx` (componente `ClerkSupabaseIntegration`)

---

## 🗄️ Banco de Dados (Supabase)

O schema completo está em **`supabase-rls.sql`**. Para configurar o banco:

1. Crie um projeto no [Supabase](https://supabase.com)
2. Acesse **SQL Editor** no painel do Supabase
3. Cole e execute o conteúdo de `supabase-rls.sql`

### Tabelas

| Tabela | Descrição |
|---|---|
| `forum_comments` | Comentários do fórum (id text PK, author_id, content, etc.) |
| `forum_comment_likes` | Curtidas nos comentários (PK composta: comment_id + user_id) |
| `forum_comment_reports` | Denúncias de comentários |
| `module_progress` | Progresso dos módulos (completed, quiz_score, quiz_total) |

### Row Level Security (RLS)

Todas as tabelas possuem RLS habilitado. As políticas garantem que:
- **Leitura de comentários:** qualquer usuário autenticado
- **Escrita de comentários:** apenas o próprio autor (`author_id`)
- **Curtidas / denúncias:** apenas o próprio usuário
- **Progresso:** cada usuário vê e edita apenas seu próprio progresso

A função `requesting_user_id()` extrai o `sub` do JWT do Clerk para validar a identidade.

---

## 🔐 Autenticação (Clerk)

### Configuração do JWT Template para Supabase

Para que o Clerk emita tokens válidos para o Supabase:

1. Acesse o [Dashboard do Clerk](https://dashboard.clerk.com)
2. Vá em **JWT Templates** → **New Template** → **Supabase**
3. Configure o template com o **JWT Secret** do seu projeto Supabase (encontrado em `Settings > API > JWT Settings` no painel Supabase)
4. O nome do template deve ser **`supabase`** (esse é o valor usado em `getToken({ template: "supabase" })`)

---

## 🤝 Como Contribuir

O MackSeguro é um projeto **open source** mantido por alunos voluntários do Mackenzie. As contribuições são feitas via Pull Requests (PRs) no GitHub, que passam por revisão e aprovação dos mantenedores.

### Mantenedores (Aprovadores de PRs)

| Papel | Responsável |
|---|---|
| **Criador e Lead Técnico** | Kenzo Fujimoto ([@kenzofujimoto](https://github.com/kenzofujimoto)) |
| **Professor Orientador** | Professor responsável pelo projeto extensionista |

### Fluxo de Contribuição

```
1. Fork do repositório
       │
2. Crie uma branch descritiva
   git checkout -b feat/nome-da-feature
       │
3. Desenvolva e teste localmente
   npm run dev  →  npm run test
       │
4. Commit com mensagem padronizada
   git commit -m "feat: adiciona geração de certificado"
       │
5. Push para seu fork
   git push origin feat/nome-da-feature
       │
6. Abra um Pull Request para a branch `master`
       │
7. Aguarde a revisão e aprovação de um mantenedor
       │
8. Merge! 🎉
```

### Convenção de Commits

Usamos o padrão [Conventional Commits](https://www.conventionalcommits.org/):

| Prefixo | Uso |
|---|---|
| `feat:` | Nova funcionalidade |
| `fix:` | Correção de bug |
| `docs:` | Alteração na documentação |
| `style:` | Formatação, CSS (sem mudança de lógica) |
| `refactor:` | Refatoração de código |
| `test:` | Adição ou modificação de testes |
| `chore:` | Dependências, configurações, CI/CD |
| `content:` | Alteração no conteúdo pedagógico (trilhas, quizzes) |

### Regras para Pull Requests

1. **Uma PR por feature/fix** — Não misture alterações de escopo diferente
2. **Testes passando** — Execute `npm run test` antes de submeter
3. **Build sem erros** — Execute `npm run build` antes de submeter
4. **Descrição clara** — Explique o que foi feito e por quê
5. **Screenshots** — Para mudanças visuais, inclua capturas de tela (antes/depois)
6. **Sem secrets** — Nunca commite chaves de API. Use `.env.local`

---

## 👥 Equipes

O projeto é organizado em **4 equipes de alunos voluntários**, cada uma com escopo e responsabilidades definidos. Um aluno pode fazer parte de mais de uma equipe conforme interesse e disponibilidade.

---

### 🔧 Equipe 1 — Core & Infraestrutura

> Mantém a base rodar estável e segura.

| Responsabilidade | Detalhes |
|---|---|
| **Backend e Banco** | Gerenciar o schema Supabase, RLS policies e migrations |
| **Autenticação** | Manutenção da integração Clerk ↔ Supabase (JWT, tokens) |
| **Sincronização** | Garantir que o progresso sincronize entre dispositivos |
| **CI/CD e Deploy** | Pipeline de deploy na Vercel, previews de PRs |
| **Performance** | Otimização de bundle, lazy loading, cache strategies |
| **Segurança** | Auditoria de dependências, proteção contra XSS/CSRF |

**Perfil ideal:** Alunos com experiência em TypeScript, APIs REST e bancos de dados.

**Arquivos-chave:**
- `src/lib/supabaseConfig.ts`
- `src/lib/remotePersistence.ts`
- `src/lib/userData.ts`
- `supabase-rls.sql`
- `src/App.tsx` (integração Clerk/Supabase)

---

### 🎨 Equipe 2 — Frontend & UI/UX

> Torna a plataforma bonita, acessível e intuitiva.

| Responsabilidade | Detalhes |
|---|---|
| **Design System** | Manter e evoluir o design system (tokens CSS, componentes) |
| **Responsividade** | Garantir que tudo funcione em mobile, tablet e desktop |
| **Acessibilidade** | Conformidade com WCAG (contraste, navegação por teclado, ARIA) |
| **Animações** | Micro-interações e transições suaves para engajamento |
| **Novas Páginas** | Construir páginas como Dashboard, Perfil, Certificados |
| **Dark Mode** | Implementar tema escuro para a plataforma |

**Perfil ideal:** Alunos com interesse em React, CSS/Tailwind e design de interfaces.

**Arquivos-chave:**
- `src/index.css` (tokens do design system)
- `src/components/layout/Navbar.tsx`, `Footer.tsx`
- `src/pages/*.tsx` (todas as páginas)

---

### 📚 Equipe 3 — Conteúdo & Pedagógico

> Garante que o conteúdo educacional seja preciso, atualizado e acessível.

| Responsabilidade | Detalhes |
|---|---|
| **Trilhas e Módulos** | Criar e revisar o conteúdo textual das trilhas |
| **Quizzes** | Elaborar perguntas de qualidade com opções plausíveis |
| **Vídeo-Aulas** | Selecionar e manter vídeos atualizados no YouTube |
| **Materiais** | Produzir e revisar PDFs, cartilhas e infográficos |
| **Pílulas** | Criar dicas rápidas e práticas de segurança digital |
| **Eventos** | Organizar e atualizar a agenda de eventos presenciais |
| **Revisão** | Verificar correção ortográfica e pedagógica de todo o conteúdo |

**Perfil ideal:** Alunos de qualquer curso com interesse em educação, comunicação ou segurança.

**Arquivo-chave:**
- `src/data/mock.ts` — **Este é o único arquivo que esta equipe precisa editar na maioria dos casos.** Contém todas as trilhas, módulos, quizzes, materiais, pílulas e eventos.

**Exemplo — Adicionando uma nova pílula:**
```typescript
// Em src/data/mock.ts, adicione ao array `pilulas`:
{
  id: 5,
  titulo: "Verifique o remetente",
  conteudo: "Antes de clicar em qualquer link, verifique...",
  categoria: "Phishing",
  data: "2026-04-15",
  cor: "red",
},
```

---

### 🧪 Equipe 4 — QA, Testes & Comunidade

> Garante qualidade, resolve issues e cuida da experiência da comunidade.

| Responsabilidade | Detalhes |
|---|---|
| **Testes Automatizados** | Escrever e manter testes com Vitest + Testing Library |
| **Testes Manuais** | Testar fluxos críticos (login, quiz, progresso, fórum) em múltiplos navegadores |
| **Triagem de Issues** | Classificar bugs e feature requests reportados pela comunidade |
| **Code Review** | Auxiliar na revisão de PRs antes da aprovação dos mantenedores |
| **Documentação** | Manter o README, CONTRIBUTING e documentação interna atualizados |
| **Moderação do Fórum** | Monitorar denúncias de comentários e moderar conteúdo |

**Perfil ideal:** Alunos detalhistas com interesse em qualidade de software e comunidade.

**Arquivos-chave:**
- `src/**/*.test.ts` / `src/**/*.test.tsx`
- `README.md`, `CONTRIBUTING.md`

---

### Resumo das Equipes

| # | Equipe | Foco Principal | Nº Sugerido |
|---|---|---|---|
| 1 | **Core & Infra** | Backend, banco, auth, sync, deploy | 2-3 alunos |
| 2 | **Frontend & UI/UX** | Interface, design, acessibilidade | 3-4 alunos |
| 3 | **Conteúdo & Pedagógico** | Trilhas, quizzes, materiais, eventos | 3-5 alunos |
| 4 | **QA, Testes & Comunidade** | Testes, issues, code review, docs | 2-3 alunos |

---

## 🗺️ Roadmap

### ✅ v1.0 — MVP (Concluído)
- [x] Landing page com hero section e estatísticas
- [x] 2 trilhas com 9 módulos ao total
- [x] Sistema de quiz com pontuação e feedback
- [x] Fórum de discussão por módulo
- [x] Autenticação via Clerk (Google, GitHub, etc.)
- [x] Materiais para download
- [x] Pílulas de segurança
- [x] Agenda de eventos
- [x] Deploy na Vercel
- [x] SEO dinâmico com componente `<Seo />`

### 🔄 v1.1 — Sincronização (Em Progresso)
- [x] Schema do banco de dados no Supabase
- [x] Row Level Security (RLS) com JWT do Clerk
- [x] Gravação de progresso no Supabase (fire-and-forget)
- [x] Função de sync bidirecional (Supabase ↔ localStorage)
- [ ] 🐛 **Resolver sincronização completa entre dispositivos**
- [ ] Fórum totalmente remoto (ler + escrever via Supabase)

### 📋 v1.2 — Certificados & Admin
- [ ] Geração de certificado em PDF ao completar uma trilha
- [ ] Painel administrativo (ver estatísticas, gerenciar conteúdo)
- [ ] Dashboard do aluno com histórico de certificados

### 🎨 v1.3 — UI/UX Premium
- [ ] Dark mode
- [ ] Animações e micro-interações
- [ ] Redesign da página de módulo (melhor hierarquia visual)
- [ ] Acessibilidade (WCAG AA)
- [ ] PWA (Progressive Web App) para acesso offline

### 🚀 v2.0 — Escala
- [ ] Internacionalização (i18n)
- [ ] Gamificação avançada (badges, ranking)
- [ ] Novas trilhas (LGPD, Educação Financeira Digital)
- [ ] API RESTful para integração com outros sistemas
- [ ] Migrar conteúdo de `mock.ts` para o Supabase (CMS dinâmico)

---

## 📝 Licença

Este projeto é **open source** e está disponível para contribuições de alunos do Mackenzie e da comunidade.

---

<p align="center">
  Feito com ❤️ por alunos e professores do <strong>Instituto Presbiteriano Mackenzie</strong>
</p>
