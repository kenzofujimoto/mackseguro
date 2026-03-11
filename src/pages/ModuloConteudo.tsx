import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Play,
  MessageSquare,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { trilhas, conteudosModulos, corMap } from "../data/mock.ts";
import type { CorKey } from "../data/mock.ts";

export default function ModuloConteudo() {
  const { slug, moduloId } = useParams<{ slug: string; moduloId: string }>();
  const trilha = trilhas.find((t) => t.slug === slug);
  const modId = Number(moduloId);

  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [forumText, setForumText] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!trilha) {
    return (
      <section className="bg-white px-4 py-20 text-center">
        <h1 className="mb-4 text-2xl font-bold text-[var(--color-text)]">Trilha não encontrada</h1>
        <Link to="/trilhas" className="font-medium text-[var(--color-mack)] hover:underline cursor-pointer">← Voltar para trilhas</Link>
      </section>
    );
  }

  const modulo = trilha.modulos.find((m) => m.id === modId);
  const conteudo = conteudosModulos.find((c) => c.trilhaSlug === slug && c.moduloId === modId);
  const cores = corMap[trilha.cor as CorKey];
  const modIndex = trilha.modulos.findIndex((m) => m.id === modId);
  const prevMod = modIndex > 0 ? trilha.modulos[modIndex - 1] : null;
  const nextMod = modIndex < trilha.modulos.length - 1 ? trilha.modulos[modIndex + 1] : null;

  if (!modulo || !conteudo) {
    return (
      <section className="bg-white px-4 py-20 text-center">
        <h1 className="mb-4 text-2xl font-bold text-[var(--color-text)]">Módulo não encontrado</h1>
        <Link to={`/trilhas/${slug}`} className="font-medium text-[var(--color-mack)] hover:underline cursor-pointer">← Voltar para a trilha</Link>
      </section>
    );
  }

  const quizScore = conteudo.questoes.reduce((acc, q) => {
    return acc + (selectedAnswers[q.id] === q.respostaCorreta ? 1 : 0);
  }, 0);

  return (
    <section className="min-h-screen bg-[var(--color-bg-surface)]">
      {/* Breadcrumb */}
      <div className="border-b border-[var(--color-border)] bg-[var(--color-bg)] px-4">
        <div className="mx-auto flex max-w-7xl items-center gap-2 py-3 text-sm text-[var(--color-text-muted)]">
          <Link to="/trilhas" className="hover:text-[var(--color-text-secondary)] cursor-pointer">Trilhas</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link to={`/trilhas/${slug}`} className="hover:text-[var(--color-text-secondary)] cursor-pointer">{trilha.titulo}</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-[var(--color-text)]">Módulo {modIndex + 1}</span>
          <button
            type="button"
            className="ml-auto rounded-md p-1.5 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-muted)] lg:hidden cursor-pointer"
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir navegação dos módulos"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8">
        {/* Sidebar — desktop */}
        <aside className="hidden w-60 shrink-0 lg:block">
          <nav className="sticky top-20">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Módulos</h3>
            <ol className="space-y-1">
              {trilha.modulos.map((m, i) => (
                <li key={m.id}>
                  <Link
                    to={`/trilhas/${slug}/modulo/${m.id}`}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors cursor-pointer ${
                      m.id === modId
                        ? `${cores.bg} ${cores.text} font-semibold`
                        : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-muted)]"
                    }`}
                  >
                    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      m.id === modId ? `${cores.fill} text-white` : "bg-[var(--color-bg-muted)] text-[var(--color-text-muted)]"
                    }`}>{i + 1}</span>
                    <span className="truncate">{m.titulo}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
        </aside>

        {/* Sidebar — mobile drawer */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div className="absolute inset-0 bg-black/30" onClick={() => setSidebarOpen(false)} aria-hidden="true" />
            <aside className="relative z-10 w-72 overflow-y-auto bg-[var(--color-bg)] p-4 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[var(--color-text)]">Módulos</h3>
                <button type="button" onClick={() => setSidebarOpen(false)} className="rounded-md p-1.5 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-muted)] cursor-pointer" aria-label="Fechar">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <ol className="space-y-1">
                {trilha.modulos.map((m, i) => (
                  <li key={m.id}>
                    <Link
                      to={`/trilhas/${slug}/modulo/${m.id}`}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors cursor-pointer ${
                        m.id === modId
                          ? `${cores.bg} ${cores.text} font-semibold`
                          : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-muted)]"
                      }`}
                    >
                      <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        m.id === modId ? `${cores.fill} text-white` : "bg-[var(--color-bg-muted)] text-[var(--color-text-muted)]"
                      }`}>{i + 1}</span>
                      <span className="truncate">{m.titulo}</span>
                    </Link>
                  </li>
                ))}
              </ol>
            </aside>
          </div>
        )}

        {/* Main content — continuous scroll */}
        <div className="min-w-0 flex-1">
          {/* Module header */}
          <div className="card-mk mb-8 p-6">
            <div className="flex items-start gap-4">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-bold ${cores.bg} ${cores.text}`}>{modIndex + 1}</div>
              <div className="flex-1">
                <h1 className="text-xl font-bold text-[var(--color-text)] sm:text-2xl">{modulo.titulo}</h1>
                <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{modulo.descricao}</p>
                <div className="mt-2 flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
                  <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{modulo.duracao}</span>
                  <span className={`font-medium ${cores.text}`}>+{modulo.xp} XP</span>
                  <span>Módulo {modIndex + 1} de {trilha.modulos.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="card-mk mb-8 p-6 sm:p-8">
            <h2 className="mb-5 text-lg font-bold text-[var(--color-text)]">Conteúdo</h2>
            <div className="space-y-4">
              {conteudo.conteudo.map((paragrafo, i) => (
                <p key={i} className="text-sm leading-relaxed text-[var(--color-text-secondary)]">{paragrafo}</p>
              ))}
            </div>
          </div>

          {/* Video */}
          <div className="card-mk mb-8 p-6 sm:p-8">
            <h2 className="mb-5 text-lg font-bold text-[var(--color-text)]">Vídeo</h2>
            <div className="relative aspect-video overflow-hidden rounded-xl bg-[var(--color-dark)]">
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
                  <Play className="ml-1 h-7 w-7 text-white" />
                </div>
                <p className="text-sm font-medium text-white/70">{conteudo.videoTitulo}</p>
                <p className="mt-1 text-xs text-white/40">Duração: {conteudo.videoDuracao}</p>
              </div>
            </div>
            <p className="mt-3 text-xs text-[var(--color-text-muted)]">Vídeo demonstrativo — conteúdo disponível em breve.</p>
          </div>

          {/* Quiz */}
          <div className="card-mk mb-8 p-6 sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[var(--color-text)]">Questionário</h2>
              {quizSubmitted && (
                <span className={`rounded-full px-3 py-1 text-sm font-semibold ${
                  quizScore === conteudo.questoes.length
                    ? "bg-[var(--color-emerald-light)] text-[var(--color-emerald)]"
                    : "bg-[var(--color-amber-light)] text-[var(--color-amber)]"
                }`}>{quizScore}/{conteudo.questoes.length} corretas</span>
              )}
            </div>

            <div className="space-y-6">
              {conteudo.questoes.map((q, qi) => (
                <div key={q.id} className="rounded-xl border border-[var(--color-border)] p-5">
                  <p className="mb-3 font-medium text-[var(--color-text)]">
                    <span className="mr-2 text-[var(--color-text-muted)]">{qi + 1}.</span>
                    {q.pergunta}
                  </p>
                  <div className="space-y-2">
                    {q.opcoes.map((opcao, oi) => {
                      const selected = selectedAnswers[q.id] === oi;
                      const isCorrect = oi === q.respostaCorreta;
                      let optionStyle = "border-[var(--color-border)] hover:border-[var(--color-mack)]/30 hover:bg-[var(--color-mack-bg)]/50";
                      if (selected && !quizSubmitted) {
                        optionStyle = "border-[var(--color-mack)] bg-[var(--color-mack-bg)]";
                      } else if (quizSubmitted && selected && isCorrect) {
                        optionStyle = "border-[var(--color-emerald)] bg-[var(--color-emerald-light)]";
                      } else if (quizSubmitted && selected && !isCorrect) {
                        optionStyle = "border-[var(--color-rose)] bg-[var(--color-rose-light)]";
                      } else if (quizSubmitted && isCorrect) {
                        optionStyle = "border-[var(--color-emerald)]/50 bg-[var(--color-emerald-light)]/50";
                      }
                      return (
                        <label key={oi} className={`flex items-center gap-3 rounded-lg border p-3 text-sm transition-all cursor-pointer ${optionStyle}`}>
                          <input type="radio" name={`q-${q.id}`} className="accent-[var(--color-mack)]" checked={selected} disabled={quizSubmitted} onChange={() => setSelectedAnswers((prev) => ({ ...prev, [q.id]: oi }))} />
                          <span className="flex-1 text-[var(--color-text-secondary)]">{opcao}</span>
                          {quizSubmitted && selected && isCorrect && <CheckCircle2 className="h-4 w-4 text-[var(--color-emerald)]" />}
                          {quizSubmitted && selected && !isCorrect && <XCircle className="h-4 w-4 text-[var(--color-rose)]" />}
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex gap-3">
              {!quizSubmitted ? (
                <button type="button" className="btn-primary" disabled={Object.keys(selectedAnswers).length < conteudo.questoes.length} onClick={() => setQuizSubmitted(true)}>
                  Verificar Respostas
                  <CheckCircle2 className="h-4 w-4" />
                </button>
              ) : (
                <button type="button" className="btn-outline" onClick={() => { setQuizSubmitted(false); setSelectedAnswers({}); }}>
                  Tentar Novamente
                </button>
              )}
            </div>
          </div>

          {/* Forum */}
          <div className="card-mk mb-8 p-6 sm:p-8">
            <h2 className="mb-6 text-lg font-bold text-[var(--color-text)]">Fórum de Dúvidas</h2>

            <div className="mb-6 rounded-xl border border-[var(--color-border)] p-4">
              <textarea
                className="w-full resize-none rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-mack)] focus:outline-none"
                rows={3}
                placeholder="Faça uma pergunta ou compartilhe uma dúvida..."
                value={forumText}
                onChange={(e) => setForumText(e.target.value)}
              />
              <div className="mt-2 flex justify-end">
                <button type="button" className="btn-primary text-sm">
                  <MessageSquare className="h-4 w-4" />
                  Publicar
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {conteudo.forum.map((post) => (
                <div key={post.id} className="rounded-xl border border-[var(--color-border)] p-4">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-mack-bg)] text-xs font-bold text-[var(--color-mack)]">{post.iniciais}</div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--color-text)]">{post.autor}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">{new Date(post.data).toLocaleDateString("pt-BR")}</p>
                    </div>
                  </div>
                  <p className="mb-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">{post.conteudo}</p>
                  <div className="flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
                    <MessageSquare className="h-3.5 w-3.5" />
                    {post.respostas} {post.respostas === 1 ? "resposta" : "respostas"}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            {prevMod ? (
              <Link to={`/trilhas/${slug}/modulo/${prevMod.id}`} className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text)] cursor-pointer">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">{prevMod.titulo}</span>
                <span className="sm:hidden">Anterior</span>
              </Link>
            ) : <div />}

            {nextMod ? (
              <Link to={`/trilhas/${slug}/modulo/${nextMod.id}`} className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2.5 text-sm font-medium text-[var(--color-mack)] transition-colors cursor-pointer">
                <span className="hidden sm:inline">{nextMod.titulo}</span>
                <span className="sm:hidden">Próximo</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <Link to={`/trilhas/${slug}`} className="btn-primary text-sm">
                Concluir Trilha
                <CheckCircle2 className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
