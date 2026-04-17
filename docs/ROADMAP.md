# Roadmap — MackSeguro

Plano de evolucao do projeto e estrategia para colaboracao publica.

---

## Visao de Longo Prazo

O MackSeguro nasceu como plataforma de educacao em seguranca digital do projeto de extensao da Universidade Presbiteriana Mackenzie. O objetivo e que no futuro a plataforma sirva de base para **qualquer projeto de extensao** da universidade — nao so seguranca.

---

## Fase 1: Fundacao Open Source (atual)

**Objetivo:** Tornar o projeto acessivel para contribuicoes externas.

- [x] Codigo fonte no GitHub
- [x] README com instrucoes de setup
- [x] Guia de contribuicao (CONTRIBUTING.md)
- [x] Documentacao de arquitetura (docs/ARCHITECTURE.md)
- [x] Definicao de equipes (docs/TEAMS.md)
- [x] Templates de issues e PRs
- [x] Codigo de conduta
- [x] Licenca MIT
- [ ] Criar `.env.example` com todas as variaveis documentadas
- [ ] Criar labels no GitHub para equipes e tipos de tarefa
- [ ] Criar milestones para o semestre atual
- [ ] Criar issues iniciais marcadas com `good first issue`

---

## Fase 2: Conteudo e Comunidade

**Objetivo:** Expandir o conteudo educacional e atrair contribuidores.

- [ ] Completar trilha "Seguranca Digital para Todos" (todos os modulos com quiz)
- [ ] Adicionar trilha sobre LGPD e protecao de dados
- [ ] Adicionar trilha sobre seguranca em redes sociais
- [ ] Criar materiais para download de cada modulo
- [ ] Melhorar sistema de forum (notificacoes, marcacao de resolvido)
- [ ] Adicionar busca de conteudo no site
- [ ] Internacionalizacao (i18n) — suporte a ingles

---

## Fase 3: Plataforma Multi-Projeto

**Objetivo:** Permitir que outros projetos de extensao usem a mesma plataforma.

- [ ] Separar conteudo do codigo (CMS ou banco de dados)
- [ ] Sistema de "espacos" — cada projeto de extensao tem seu espaco
- [ ] Painel administrativo para gerenciar conteudo sem codigo
- [ ] Sistema de permissoes por projeto
- [ ] Temas visuais por projeto (nao so vermelho Mackenzie)
- [ ] API publica para integracao com outros sistemas

---

## Fase 4: Escala e Sustentabilidade

**Objetivo:** Tornar o projeto autossustentavel.

- [ ] Dashboard de analytics (engajamento, conclusao de trilhas)
- [ ] Sistema de mentoria (alunos avancados ajudam iniciantes)
- [ ] Integracao com Moodle/LMS da universidade
- [ ] App mobile (PWA ou React Native)
- [ ] Programa de reconhecimento para contribuidores
- [ ] Documentacao para replicar em outras universidades

---

## Como Priorizar

Usamos labels de prioridade no GitHub:

| Label | Significado |
|-------|-------------|
| `priority:critical` | Bloqueia usuarios, deve ser corrigido imediatamente |
| `priority:high` | Importante para o semestre atual |
| `priority:medium` | Desejavel, mas nao urgente |
| `priority:low` | Nice to have, pode esperar |

---

## Como Propor Mudancas no Roadmap

1. Abra uma **Issue** com o template "Feature Request"
2. Descreva o problema que voce quer resolver (nao a solucao)
3. A comunidade e os mantenedores discutem
4. Se aprovado, entra no roadmap com prioridade definida

Decisoes arquiteturais grandes (ex: trocar framework, mudar banco) passam por uma **ADR (Architecture Decision Record)** — um documento curto explicando o contexto, opcoes e decisao. Esses documentos ficam em `docs/decisions/`.
