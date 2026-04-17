# Equipes do MackSeguro

O projeto e organizado em 4 equipes. Cada equipe tem responsabilidades claras e arquivos especificos sob sua responsabilidade. Voce pode participar de mais de uma equipe.

---

## Equipe 1: Core / Plataforma

**Responsabilidade:** Manter a infraestrutura tecnica do projeto funcionando — autenticacao, banco de dados, sincronizacao, build e deploy.

**Perfil ideal:** Quem tem interesse em backend, DevOps ou arquitetura de software.

**Arquivos sob responsabilidade:**
- `src/lib/supabaseConfig.ts` — configuracao do Supabase
- `src/lib/clerkConfig.ts` — configuracao do Clerk
- `src/lib/userData.ts` — persistencia local
- `src/lib/remotePersistence.ts` — sincronizacao remota
- `src/lib/forumRemote.ts` — operacoes remotas do forum
- `src/lib/gamification/` — sistema de badges e XP
- `supabase-rls.sql` — schema e politicas de seguranca do banco
- `vite.config.ts` — configuracao de build
- `vercel.json` — configuracao de deploy
- `package.json` — dependencias

**Tarefas tipicas:**
- Corrigir bugs de sincronizacao de dados
- Adicionar novas tabelas ou policies no Supabase
- Otimizar performance da aplicacao
- Gerenciar dependencias e atualizacoes
- Configurar CI/CD e ambientes

**Labels no GitHub:** `team:core`, `infra`, `auth`, `database`

---

## Equipe 2: Conteudo / Pedagogico

**Responsabilidade:** Criar e manter todo o conteudo educacional — trilhas, modulos, quizzes, materiais, dicas e eventos.

**Perfil ideal:** Qualquer pessoa, mesmo sem experiencia em programacao. Se voce sabe editar um arquivo de texto, consegue contribuir.

**Arquivos sob responsabilidade:**
- `src/data/mock.ts` — **arquivo principal** (todo conteudo do site)

**Tarefas tipicas:**
- Escrever novos modulos educacionais
- Criar perguntas de quiz
- Adicionar materiais para download (PDFs, ebooks)
- Adicionar dicas rapidas (pilulas)
- Cadastrar eventos (palestras, workshops)
- Revisar conteudo existente (correcoes, atualizacoes)

**Como contribuir (passo a passo):**

1. Abra o arquivo `src/data/mock.ts`
2. Encontre o array correspondente ao que voce quer adicionar:
   - `trilhas` — trilhas de aprendizado
   - `conteudosModulos` — conteudo de cada modulo
   - `materiais` — materiais para download
   - `pilulas` — dicas rapidas
   - `eventos` — eventos
3. Copie um item existente e modifique com seu conteudo
4. Teste localmente com `npm run dev`
5. Abra uma PR

**Dica:** Se voce nao sabe rodar o projeto localmente, basta editar o `mock.ts` pelo proprio GitHub (botao de editar) e abrir uma PR. Alguem da Equipe Core vai revisar e testar.

**Labels no GitHub:** `team:content`, `content`, `quiz`, `material`

---

## Equipe 3: Frontend / UX

**Responsabilidade:** Cuidar da interface, experiencia do usuario, acessibilidade e design visual.

**Perfil ideal:** Quem tem interesse em design, CSS, ou quer aprender React na pratica.

**Arquivos sob responsabilidade:**
- `src/pages/` — todas as paginas
- `src/components/` — componentes reutilizaveis
- `src/hooks/` — custom hooks
- `src/index.css` — estilos globais e design tokens
- `src/App.tsx` — rotas (quando envolve nova pagina)

**Tarefas tipicas:**
- Melhorar o visual de paginas existentes
- Criar novos componentes
- Implementar responsividade (mobile)
- Melhorar acessibilidade (a11y)
- Adicionar animacoes e transicoes
- Implementar dark mode
- Criar novas paginas

**Tecnologias que voce vai usar:**
- React (JSX/TSX)
- Tailwind CSS (classes utilitarias)
- Lucide React (icones)

**Labels no GitHub:** `team:frontend`, `ui`, `ux`, `a11y`, `design`

---

## Equipe 4: Comunidade / QA

**Responsabilidade:** Garantir qualidade, escrever testes, manter documentacao, moderar forum e organizar issues.

**Perfil ideal:** Quem gosta de organizar, documentar, testar, ou quer aprender sobre qualidade de software.

**Arquivos sob responsabilidade:**
- `src/test/` — configuracao de testes
- `docs/` — toda documentacao
- `README.md` — documentacao principal
- `CONTRIBUTING.md` — guia de contribuicao
- `.github/` — templates de issues e PRs

**Tarefas tipicas:**
- Escrever testes para funcionalidades existentes
- Reportar bugs com detalhes (steps to reproduce)
- Revisar PRs de outras equipes
- Atualizar documentacao quando algo muda
- Triagear issues novas (adicionar labels, prioridade)
- Responder duvidas de novos contribuidores
- Testar o site em diferentes navegadores/dispositivos

**Labels no GitHub:** `team:community`, `test`, `docs`, `bug`, `good first issue`

---

## Tabela Resumo

| Equipe | Foco | Arquivo Principal | Dificuldade para Iniciantes |
|--------|------|-------------------|-----------------------------|
| Core / Plataforma | Infra, auth, banco | `src/lib/` | Media-Alta |
| Conteudo / Pedagogico | Trilhas, quiz, materiais | `src/data/mock.ts` | Baixa |
| Frontend / UX | Interface, design | `src/pages/`, `src/components/` | Media |
| Comunidade / QA | Testes, docs, issues | `docs/`, `src/test/` | Baixa-Media |

---

## Como Escolher sua Equipe

Nao sabe por onde comecar? Use este guia:

- **"Nunca programei antes"** → Equipe Conteudo. Voce vai editar texto dentro de um arquivo, nao precisa entender o codigo.
- **"Sei HTML/CSS basico"** → Equipe Frontend. Tailwind CSS e intuitivo e voce aprende React aos poucos.
- **"Quero aprender backend"** → Equipe Core. Voce vai mexer com banco de dados, autenticacao e APIs.
- **"Gosto de organizar e revisar"** → Equipe Comunidade/QA. Testar, documentar e manter o projeto funcionando.
- **"Uso IA para programar"** → Qualquer equipe! Mas leia a secao abaixo.

---

## Usando IA para Contribuir

Usar ferramentas de IA (ChatGPT, Claude, Copilot, etc.) e bem-vindo neste projeto. Mas com responsabilidade:

**Pode:**
- Usar IA para entender codigo que voce nao conhece
- Pedir para IA explicar um erro
- Gerar um rascunho de codigo e depois adaptar
- Usar IA para aprender conceitos novos

**Deve:**
- **Entender o que o codigo faz** antes de commitar. Se voce nao consegue explicar o que seu PR faz em 2 frases, voce nao entendeu o suficiente.
- **Testar manualmente** — IA nao testa no navegador por voce
- **Revisar imports e dependencias** — IA frequentemente inventa bibliotecas que nao existem no projeto
- **Verificar se o codigo compila** — `npm run build` antes de abrir PR

**Nao pode:**
- Copiar e colar codigo de IA sem entender
- Adicionar dependencias que a IA sugeriu sem consultar a Equipe Core
- Commitar codigo gerado por IA que voce nao testou
- Usar IA para gerar PRs em massa sem qualidade

**Regra de ouro:** Se a IA escreveu, voce e responsavel. Trate como se voce tivesse escrito cada linha.
