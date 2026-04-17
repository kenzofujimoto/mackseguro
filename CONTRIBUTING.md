# Guia de Contribuicao — MackSeguro

Obrigado por querer contribuir! Este guia explica tudo que voce precisa saber para participar do projeto, mesmo que seja sua primeira vez contribuindo com open source.

---

## Antes de Comecar

1. Leia o [Codigo de Conduta](CODE_OF_CONDUCT.md)
2. Veja as [equipes](docs/TEAMS.md) e descubra onde voce se encaixa
3. Procure issues com a label [`good first issue`](../../labels/good%20first%20issue) — sao tarefas simples pensadas para iniciantes

---

## Setup do Ambiente

### 1. Faca um Fork

Clique no botao **Fork** no canto superior direito do repositorio no GitHub. Isso cria uma copia do projeto na sua conta.

### 2. Clone o seu Fork

```bash
git clone https://github.com/SEU-USUARIO/mackseguro.git
cd mackseguro
```

### 3. Configure o Upstream

```bash
git remote add upstream https://github.com/kenzofujimoto/mackseguro.git
```

### 4. Instale e Configure

```bash
npm install
cp .env.example .env.local
# Edite .env.local com sua chave do Clerk (peca ao lead tecnico)
npm run dev
```

> **Nao tem chave do Clerk?** O app funciona sem login — voce so nao consegue testar funcionalidades que exigem autenticacao. Para conteudo e visual, nao precisa.

---

## Fluxo de Trabalho

### 1. Atualize sua master

Antes de comecar qualquer trabalho:

```bash
git checkout master
git pull upstream master
```

### 2. Crie uma branch

```bash
git checkout -b tipo/descricao-curta
```

**Convencao de nomes para branches:**

| Tipo | Exemplo | Quando usar |
|------|---------|-------------|
| `feat/` | `feat/certificado-pdf` | Nova funcionalidade |
| `fix/` | `fix/sync-progress-bug` | Correcao de bug |
| `content/` | `content/nova-trilha-lgpd` | Novo conteudo educacional |
| `docs/` | `docs/atualiza-readme` | Documentacao |
| `style/` | `style/dark-mode` | Mudancas visuais |
| `test/` | `test/quiz-coverage` | Testes |

### 3. Faca suas alteracoes

- Faca commits pequenos e frequentes (um commit = uma mudanca logica)
- Use a convencao de commits (veja abaixo)
- Teste manualmente no navegador

### 4. Commits

Use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git commit -m "feat: adiciona download de certificado em PDF"
git commit -m "fix: corrige sync de progresso entre dispositivos"
git commit -m "content: adiciona modulo sobre LGPD na trilha de seguranca"
git commit -m "docs: atualiza instrucoes de setup no README"
git commit -m "test: adiciona testes para componente QuizSection"
git commit -m "style: melhora responsividade da pagina de trilhas"
```

**Anatomia de um bom commit:**
- Comece com o tipo (`feat:`, `fix:`, `content:`, `docs:`, `style:`, `test:`, `refactor:`, `chore:`)
- Use o imperativo ("adiciona", nao "adicionado" ou "adicionando")
- Maximo 72 caracteres na primeira linha
- Se precisar explicar mais, pule uma linha e escreva o corpo

### 5. Abra uma PR

```bash
git push origin feat/certificado-pdf
```

No GitHub, abra um **Pull Request** para `kenzofujimoto/mackseguro` branch `master`. O template de PR vai aparecer automaticamente — preencha todas as secoes.

---

## Checklist da PR

Antes de submeter, verifique:

- [ ] O codigo compila sem erros: `npm run build`
- [ ] Testei manualmente no navegador
- [ ] O commit segue a convencao de commits
- [ ] A PR tem uma descricao clara do que foi feito e por que
- [ ] Para mudancas visuais: screenshots antes/depois foram anexadas
- [ ] Nenhuma chave API ou secret foi commitada
- [ ] Nao adicionei dependencias sem consultar a Equipe Core

---

## Guias por Equipe

### Equipe Conteudo: editando `mock.ts`

Se voce e da **Equipe Conteudo**, provavelmente so precisa editar o arquivo `src/data/mock.ts`. Aqui esta como adicionar conteudo:

#### Adicionando um modulo a uma trilha existente

1. Encontre a trilha no array `trilhas` e adicione o modulo:

```typescript
{
  id: 6, // proximo ID disponivel
  titulo: "Seu Titulo",
  descricao: "Descricao curta do modulo.",
  duracao: "15 min",
  xp: 100,
},
```

2. Adicione o conteudo do modulo no array `conteudosModulos`:

```typescript
{
  trilhaSlug: "seguranca-digital", // slug da trilha
  moduloId: 6,                     // mesmo ID do passo 1
  videoTitulo: "Titulo do Video",
  videoDuracao: "12:00",
  videoUrl: "https://www.youtube.com/embed/VIDEO_ID",
  conteudo: [
    "Primeiro paragrafo do conteudo teorico...",
    "Segundo paragrafo...",
  ],
  questoes: [
    {
      id: 1,
      pergunta: "Sua pergunta aqui?",
      opcoes: ["Opcao A", "Opcao B", "Opcao C", "Opcao D"],
      respostaCorreta: 0, // indice da opcao correta (0 = A)
    },
  ],
  forum: [], // deixe vazio, sera preenchido pelos alunos
},
```

> **Dica:** O `videoUrl` deve ser a URL de embed do YouTube, nao a URL normal. Troque `watch?v=` por `embed/`.

#### Nao quer configurar o ambiente local?

Voce pode editar o `mock.ts` diretamente pelo GitHub:
1. Navegue ate `src/data/mock.ts` no repositorio
2. Clique no icone de lapis (editar)
3. Faca suas alteracoes
4. Clique em "Propose changes"
5. Abra a PR

Alguem da Equipe Core vai revisar, testar e fazer merge.

### Equipe Frontend: trabalhando com React + Tailwind

- Componentes ficam em `src/components/`, paginas em `src/pages/`
- Usamos Tailwind CSS — classes utilitarias direto no JSX, nao CSS separado
- Icones vem do Lucide React: `import { Icon } from "lucide-react"`
- Sempre teste responsividade (mobile + desktop)
- Consulte `src/index.css` para ver as cores e tokens de design disponiveis

### Equipe Core: cuidados especiais

- Nunca commite chaves de API ou secrets
- Alteracoes no schema do banco (`supabase-rls.sql`) precisam de review de pelo menos 1 mantenedor
- Novas dependencias (`npm install`) precisam de justificativa na PR
- Mudancas em `src/lib/` podem afetar todo o app — teste amplamente

### Equipe Comunidade/QA: escrevendo testes

- Testes ficam proximos aos arquivos que testam ou em `src/test/`
- Usamos Vitest + React Testing Library
- Rode todos os testes com `npm run test`
- Foque em testar comportamento do usuario, nao implementacao interna

---

## Usando IA para Contribuir

Usar ferramentas de IA (ChatGPT, Claude, Copilot, etc.) e permitido e incentivado como ferramenta de aprendizado. Regras:

1. **Entenda o que o codigo faz.** Se voce nao consegue explicar sua PR em 2 frases, voce nao entendeu o suficiente.
2. **Declare na PR.** O template pergunta se voce usou IA — seja honesto. Nao e deducao de nota, e transparencia.
3. **Teste tudo.** IA nao testa no navegador por voce. `npm run build` + teste manual sao obrigatorios.
4. **Cuidado com alucinacoes.** IA inventa bibliotecas, APIs e funcoes que nao existem. Verifique se tudo que foi sugerido realmente existe no projeto.
5. **Nao adicione dependencias sugeridas por IA** sem consultar a Equipe Core primeiro.

---

## Precisa de Ajuda?

- Abra uma **Issue** no GitHub descrevendo sua duvida
- Procure issues com a label [`question`](../../labels/question)
- Converse com o Lead Tecnico ou o Professor Orientador
- Consulte a [documentacao](docs/) para detalhes sobre a arquitetura

Nenhuma pergunta e boba. Todo mundo comecou sem saber nada.
