# Guia de Contribuição — MackSeguro

Obrigado por contribuir com o MackSeguro! 🎉 Este guia explica como participar do projeto de forma organizada.

---

## Primeiros Passos

### 1. Faça um Fork

Clique no botão **Fork** no canto superior direito do repositório no GitHub. Isso cria uma cópia do projeto na sua conta.

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
# Edite .env.local com sua chave do Clerk (peça ao lead técnico)
npm run dev
```

---

## Fluxo de Trabalho

### Criando uma Branch

Sempre crie uma branch a partir da `master` atualizada:

```bash
git checkout master
git pull upstream master
git checkout -b tipo/descricao-curta
```

**Convenção de nomes para branches:**

| Tipo | Exemplo |
|---|---|
| `feat/` | `feat/certificado-pdf` |
| `fix/` | `fix/sync-progress-bug` |
| `docs/` | `docs/atualiza-readme` |
| `content/` | `content/nova-trilha-lgpd` |
| `style/` | `style/dark-mode` |
| `test/` | `test/quiz-coverage` |

### Fazendo Commits

Use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Exemplos de bons commits:
git commit -m "feat: adiciona download de certificado em PDF"
git commit -m "fix: corrige sync de progresso entre dispositivos"
git commit -m "content: adiciona módulo sobre LGPD na trilha de segurança"
git commit -m "docs: atualiza instruções de setup no README"
git commit -m "test: adiciona testes para componente QuizSection"
```

### Submetendo a PR

```bash
git push origin feat/certificado-pdf
```

No GitHub, abra um **Pull Request** para `kenzofujimoto/mackseguro` branch `master`.

---

## Checklist da PR

Antes de submeter sua PR, verifique:

- [ ] O código compila sem erros: `npm run build`
- [ ] Os testes passam: `npm run test`
- [ ] O commit segue a convenção de commits
- [ ] A PR tem uma descrição clara do que foi feito e por quê
- [ ] Para mudanças visuais: screenshots antes/depois foram anexadas
- [ ] Nenhuma chave API ou secret foi commitada
- [ ] O código foi testado manualmente no navegador

---

## Guia por Equipe

### Equipe Conteúdo: editando `mock.ts`

Se você é da **Equipe 3 (Conteúdo & Pedagógico)**, provavelmente só precisará editar o arquivo `src/data/mock.ts`. Aqui está como adicionar conteúdo:

#### Adicionando um módulo a uma trilha existente

1. Encontre a trilha no array `trilhas` e adicione o módulo:

```typescript
{
  id: 6, // próximo ID disponível
  titulo: "Seu Título",
  descricao: "Descrição curta do módulo.",
  duracao: "15 min",
  xp: 100,
},
```

2. Adicione o conteúdo do módulo no array `conteudosModulos`:

```typescript
{
  trilhaSlug: "seguranca-digital", // slug da trilha
  moduloId: 6,                     // mesmo ID do passo 1
  videoTitulo: "Título do Vídeo",
  videoDuracao: "12:00",
  videoUrl: "https://www.youtube.com/embed/VIDEO_ID",
  conteudo: [
    "Primeiro parágrafo do conteúdo teórico...",
    "Segundo parágrafo...",
  ],
  questoes: [
    {
      id: 1,
      pergunta: "Sua pergunta aqui?",
      opcoes: ["Opção A", "Opção B", "Opção C", "Opção D"],
      respostaCorreta: 0, // índice da opção correta (0 = A)
    },
  ],
  forum: [], // deixe vazio, será preenchido pelos alunos
},
```

> **Dica:** O `videoUrl` deve ser a URL de embed do YouTube, não a URL normal. Troque `watch?v=` por `embed/`.

---

## Precisa de ajuda?

- Abra uma **Issue** no GitHub descrevendo sua dúvida
- Converse com o Lead Técnico (Kenzo) ou o Professor Orientador
- Consulte o `README.md` para detalhes sobre a arquitetura
