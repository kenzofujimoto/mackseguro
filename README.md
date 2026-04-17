# MackSeguro

Plataforma educacional open source de seguranca digital, desenvolvida como projeto de extensao da **Universidade Presbiteriana Mackenzie** (FCI).

O objetivo e publicar conteudo educacional produzido por alunos voluntarios e disponibiliza-lo gratuitamente para a comunidade. Atualmente focado em seguranca digital, mas a plataforma e projetada para servir qualquer projeto de extensao no futuro.

**[Acesse o site](https://mackseguro.vercel.app)** | **[Contribua](#como-contribuir)**

---

## Funcionalidades

- **Trilhas de aprendizado** — modulos sequenciais com video, texto e quiz
- **Sistema de progresso** — acompanhe o que voce ja completou
- **Forum por modulo** — discussao entre alunos em cada conteudo
- **Gamificacao** — badges, XP e certificados em PDF
- **Materiais para download** — PDFs, ebooks, infograficos
- **Pilulas de seguranca** — dicas rapidas por categoria
- **Eventos** — palestras, workshops e mesas redondas
- **Funciona offline** — dados salvos localmente, sync opcional com nuvem

---

## Tech Stack

| Tecnologia | Uso |
|-----------|-----|
| React 19 + TypeScript | Frontend |
| Vite | Build e dev server |
| Tailwind CSS 4 | Estilizacao |
| Clerk | Autenticacao |
| Supabase | Banco de dados (PostgreSQL + RLS) |
| Vercel | Hospedagem |

---

## Quick Start

### Pre-requisitos

- [Node.js](https://nodejs.org/) 18+ instalado
- [Git](https://git-scm.com/) instalado
- Uma conta no [Clerk](https://clerk.com/) (gratuita)

### Setup

```bash
# 1. Clone o repositorio
git clone https://github.com/kenzofujimoto/mackseguro.git
cd mackseguro

# 2. Instale as dependencias
npm install

# 3. Configure as variaveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas chaves (veja abaixo)

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

O site estara disponivel em `http://localhost:5173`.

### Variaveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Obrigatorio — chave publica do Clerk
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...

# Opcional — sem isso o app funciona offline (so localStorage)
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...

# Flags de controle (true/false)
VITE_ENABLE_SUPABASE_SYNC=false
VITE_ENABLE_SUPABASE_READS=false
VITE_REQUIRE_AUTH_FOR_COURSE=false
```

> **Nota:** Se voce nao tem chaves do Supabase, tudo bem. O app funciona normalmente usando localStorage. Nenhuma funcionalidade quebra.

### Configurando Clerk + Supabase (opcional)

Se voce quer habilitar a sincronizacao com banco de dados:

1. **No Clerk Dashboard:**
   - Va em **JWT Templates** e crie um template chamado `supabase`
   - Payload: `{ "aud": "authenticated", "role": "authenticated" }`
   - Desative "Custom signing key"
   - Copie o dominio do campo Issuer

2. **No Supabase Dashboard:**
   - Va em **Settings > API > JWT Settings**
   - Adicione o provedor Clerk e cole o dominio copiado

3. **Execute o schema do banco:**
   - Rode o conteudo de `supabase-rls.sql` no SQL Editor do Supabase

---

## Scripts Disponiveis

```bash
npm run dev       # Servidor de desenvolvimento
npm run build     # Build de producao (TypeScript + Vite)
npm run preview   # Preview da build local
npm run test      # Rodar testes
```

---

## Estrutura do Projeto

```
mackseguro/
├── src/
│   ├── pages/           # Paginas do site (1 arquivo = 1 tela)
│   ├── components/      # Componentes reutilizaveis
│   ├── lib/             # Logica de negocios (auth, dados, sync)
│   ├── data/mock.ts     # Todo conteudo educacional do site
│   ├── hooks/           # Custom hooks do React
│   └── App.tsx          # Definicao de rotas
├── docs/                # Documentacao detalhada
│   ├── ARCHITECTURE.md  # Mapa completo da codebase
│   ├── TEAMS.md         # Equipes e responsabilidades
│   └── ROADMAP.md       # Plano de evolucao
└── supabase-rls.sql     # Schema e seguranca do banco
```

> Para saber **exatamente onde alterar cada coisa**, consulte o [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

---

## Como Contribuir

Contribuicoes sao bem-vindas! Desde correcoes de texto ate novas funcionalidades.

1. Leia o [Guia de Contribuicao](CONTRIBUTING.md)
2. Veja as [equipes](docs/TEAMS.md) e escolha a sua
3. Procure issues com a label [`good first issue`](../../labels/good%20first%20issue)
4. Faca um fork, crie uma branch, e abra uma PR

### Nao sabe programar?

Sem problema! A **Equipe Conteudo** precisa de pessoas para escrever modulos educacionais, criar quizzes e revisar textos. Voce so precisa editar um arquivo de texto (`src/data/mock.ts`). Veja o [guia da equipe](docs/TEAMS.md#equipe-2-conteudo--pedagogico).

### Equipes

| Equipe | Foco | Para quem |
|--------|------|-----------|
| [Core / Plataforma](docs/TEAMS.md#equipe-1-core--plataforma) | Infra, auth, banco | Interesse em backend |
| [Conteudo / Pedagogico](docs/TEAMS.md#equipe-2-conteudo--pedagogico) | Trilhas, quiz, materiais | Qualquer pessoa |
| [Frontend / UX](docs/TEAMS.md#equipe-3-frontend--ux) | Interface, design | Interesse em design/CSS |
| [Comunidade / QA](docs/TEAMS.md#equipe-4-comunidade--qa) | Testes, docs, issues | Gosta de organizar |

---

## Documentacao

| Documento | Conteudo |
|-----------|----------|
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | Estrutura do projeto, onde alterar o que, fluxo de dados |
| [TEAMS.md](docs/TEAMS.md) | Equipes, responsabilidades, guia para escolher a sua |
| [ROADMAP.md](docs/ROADMAP.md) | Plano de evolucao e proximos passos |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Como contribuir passo a passo |
| [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) | Codigo de conduta da comunidade |

---

## Sobre o Projeto

**MackSeguro** e um projeto de extensao da Faculdade de Computacao e Informatica (FCI) da Universidade Presbiteriana Mackenzie, em Sao Paulo.

O conteudo e produzido por alunos voluntarios sob orientacao de professores, com o objetivo de democratizar o acesso a educacao em seguranca digital.

### Mantenedores

- **Kenzo Fujimoto** — Lead tecnico e criador do projeto

### Licenca

Este projeto e distribuido sob a [Licenca MIT](LICENSE). Voce pode usar, modificar e distribuir livremente.

---

<p align="center">
  Feito com dedicacao na Universidade Presbiteriana Mackenzie
</p>
