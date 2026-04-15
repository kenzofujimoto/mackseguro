import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { SignInButton, useUser } from "@clerk/react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock,
  Heart,
  Menu,
  MessageSquare,
  Play,
  ShieldAlert,
  X,
  XCircle,
} from "lucide-react";
import { trilhas, conteudosModulos, corMap } from "../data/mock.ts";
import type { CorKey } from "../data/mock.ts";
import Seo from "../components/seo/Seo.tsx";
import { useUserDataRefresh } from "../hooks/useUserDataRefresh.ts";
import {
  addRemoteForumComment,
  canReadForumFromRemote,
  fetchRemoteForumComments,
  reportRemoteForumComment,
  toggleRemoteForumLike,
} from "../lib/forumRemote.ts";
import {
  addForumComment,
  getForumComments,
  isForumCommentHidden,
  isModuleCompleted,
  markModuleCompleted,
  migrateAnonymousPosts,
  reportForumComment,
  subscribeToUserDataChanges,
  toggleForumCommentLike,
  type ForumComment,
} from "../lib/userData.ts";

type ReportReason = "spam" | "abuso" | "desinformacao" | "outro";

const reportReasonLabel: Record<ReportReason, string> = {
  spam: "Spam ou propaganda",
  abuso: "Abuso ou discurso ofensivo",
  desinformacao: "Desinformação",
  outro: "Outro",
};

function sortByRecent(comments: ForumComment[]): ForumComment[] {
  return [...comments].sort((a, b) => {
    const first = new Date(a.createdAt).getTime();
    const second = new Date(b.createdAt).getTime();
    return second - first;
  });
}

function sortByOldest(comments: ForumComment[]): ForumComment[] {
  return [...comments].sort((a, b) => {
    const first = new Date(a.createdAt).getTime();
    const second = new Date(b.createdAt).getTime();
    return first - second;
  });
}

export default function ModuloConteudo() {
  const { slug, moduloId } = useParams<{ slug: string; moduloId: string }>();
  const slugValue = slug ?? "";
  const modId = Number(moduloId);
  const trilha = trilhas.find((t) => t.slug === slugValue);
  const { isLoaded, isSignedIn, user } = useUser();
  const dataVersion = useUserDataRefresh();

  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [moduleCompleted, setModuleCompleted] = useState(() => {
    if (!slugValue || Number.isNaN(modId)) {
      return false;
    }

    return isModuleCompleted(slugValue, modId);
  });

  const [forumComments, setForumComments] = useState<ForumComment[]>([]);
  const [forumText, setForumText] = useState("");
  const [forumError, setForumError] = useState("");
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [reportingCommentId, setReportingCommentId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState<ReportReason>("spam");
  const [reportedCommentId, setReportedCommentId] = useState<string | null>(null);

  useEffect(() => {
    if (!slugValue || Number.isNaN(modId)) {
      return;
    }
    setModuleCompleted(isModuleCompleted(slugValue, modId));
  }, [slugValue, modId, dataVersion]);

  useEffect(() => {
    if (!slugValue || Number.isNaN(modId)) {
      return;
    }

    setSidebarOpen(false);
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setForumText("");
    setForumError("");
    setActiveReplyId(null);
    setReplyText("");
    setReportingCommentId(null);
    setReportedCommentId(null);
  }, [modId, slugValue]);

  if (!trilha) {
    return (
      <>
        <Seo
          title="Trilha não encontrada"
          description="A trilha informada não foi encontrada no MackSeguro."
          canonicalPath="/trilhas"
        />

        <section className="bg-white px-4 py-20 text-center">
          <h1 className="mb-4 text-2xl font-bold text-[var(--color-text)]">Trilha não encontrada</h1>
          <Link to="/trilhas" className="font-medium text-[var(--color-mack)] hover:underline cursor-pointer">← Voltar para trilhas</Link>
        </section>
      </>
    );
  }

  const modulo = trilha.modulos.find((m) => m.id === modId);
  const conteudo = conteudosModulos.find((c) => c.trilhaSlug === slugValue && c.moduloId === modId);
  const cores = corMap[trilha.cor as CorKey];
  const modIndex = trilha.modulos.findIndex((m) => m.id === modId);
  const prevMod = modIndex > 0 ? trilha.modulos[modIndex - 1] : null;
  const nextMod = modIndex < trilha.modulos.length - 1 ? trilha.modulos[modIndex + 1] : null;
  const useRemoteForum = isLoaded && isSignedIn && canReadForumFromRemote();

  const currentUserId = user?.id ?? "";
  const currentUserName = user?.fullName
    ?? user?.username
    ?? user?.primaryEmailAddress?.emailAddress?.split("@")[0]
    ?? "Aluno";

  const refreshForum = useCallback(async () => {
    if (!conteudo || !slugValue || Number.isNaN(modId)) {
      return;
    }

    if (useRemoteForum) {
      try {
        const remoteComments = await fetchRemoteForumComments(slugValue, modId);
        if (remoteComments) {
          setForumComments(remoteComments);
          return;
        }
      } catch (error) {
        console.error("[ModuloConteudo] remote forum fetch failed", error);
      }
    }

    setForumComments(getForumComments(slugValue, modId, []));
  }, [conteudo, modId, slugValue, useRemoteForum]);

  useEffect(() => {
    void refreshForum();
  }, [refreshForum]);

  useEffect(() => {
    if (useRemoteForum || !conteudo || !slugValue || Number.isNaN(modId)) {
      return;
    }

    return subscribeToUserDataChanges(() => {
      setForumComments(getForumComments(slugValue, modId, []));
    });
  }, [conteudo, modId, slugValue, useRemoteForum]);

  if (!modulo || !conteudo) {
    return (
      <>
        <Seo
          title="Módulo não encontrado"
          description="O módulo solicitado não foi encontrado no MackSeguro."
          canonicalPath={`/trilhas/${trilha.slug}`}
        />

        <section className="bg-white px-4 py-20 text-center">
          <h1 className="mb-4 text-2xl font-bold text-[var(--color-text)]">Módulo não encontrado</h1>
          <Link to={`/trilhas/${trilha.slug}`} className="font-medium text-[var(--color-mack)] hover:underline cursor-pointer">← Voltar para a trilha</Link>
        </section>
      </>
    );
  }

  useEffect(() => {
    if (useRemoteForum || !conteudo || !isLoaded || !isSignedIn || !user?.id) {
      return;
    }

    const migratedCount = migrateAnonymousPosts(user.id, currentUserName);
    if (migratedCount > 0) {
      setForumComments(getForumComments(slugValue, modId, []));
    }
  }, [conteudo, currentUserName, isLoaded, isSignedIn, modId, slugValue, useRemoteForum, user?.id]);

  const topLevelComments = useMemo(() => {
    return sortByRecent(forumComments.filter((comment) => comment.parentId === null));
  }, [forumComments]);

  const replyMap = useMemo(() => {
    const map = new Map<string, ForumComment[]>();

    forumComments
      .filter((comment) => comment.parentId !== null)
      .forEach((comment) => {
        const parentId = comment.parentId!;
        const bucket = map.get(parentId) ?? [];
        bucket.push(comment);
        map.set(parentId, bucket);
      });

    map.forEach((bucket, key) => {
      map.set(key, sortByOldest(bucket));
    });

    return map;
  }, [forumComments]);

  const quizScore = conteudo.questoes.reduce((acc, q) => {
    return acc + (selectedAnswers[q.id] === q.respostaCorreta ? 1 : 0);
  }, 0);

  const handleSubmitQuiz = () => {
    setQuizSubmitted(true);
    markModuleCompleted(
      slugValue,
      modId,
      quizScore,
      conteudo.questoes.length,
      currentUserId,
    );
    setModuleCompleted(true);
  };

  const handlePublishComment = async () => {
    if (!isSignedIn) {
      setForumError("Entre com sua conta para comentar nesta aula.");
      return;
    }

    if (!currentUserId) {
      setForumError("Não foi possível identificar seu usuário. Tente recarregar a página.");
      return;
    }

    const content = forumText.trim();
    if (content.length < 12) {
      setForumError("Escreva pelo menos 12 caracteres para publicar seu comentário.");
      return;
    }

    try {
      if (useRemoteForum) {
        await addRemoteForumComment({
          slug: slugValue,
          moduloId: modId,
          userId: currentUserId,
          authorName: currentUserName,
          content,
          parentId: null,
        });
      } else {
        addForumComment({
          slug: slugValue,
          moduloId: modId,
          userId: currentUserId,
          authorName: currentUserName,
          content,
          parentId: null,
        });
      }

      setForumText("");
      setForumError("");
      await refreshForum();
    } catch (error) {
      console.error("[ModuloConteudo] publish comment failed", error);
      setForumError("Não foi possível publicar seu comentário agora. Tente novamente.");
    }
  };

  const handleReply = async (commentId: string) => {
    if (!isSignedIn) {
      setForumError("Entre com sua conta para comentar nesta aula.");
      return;
    }

    if (!currentUserId) {
      setForumError("Não foi possível identificar seu usuário. Tente recarregar a página.");
      return;
    }

    const content = replyText.trim();
    if (content.length < 6) {
      setForumError("Escreva pelo menos 6 caracteres para enviar sua resposta.");
      return;
    }

    try {
      if (useRemoteForum) {
        await addRemoteForumComment({
          slug: slugValue,
          moduloId: modId,
          userId: currentUserId,
          authorName: currentUserName,
          content,
          parentId: commentId,
        });
      } else {
        addForumComment({
          slug: slugValue,
          moduloId: modId,
          userId: currentUserId,
          authorName: currentUserName,
          content,
          parentId: commentId,
        });
      }

      setReplyText("");
      setActiveReplyId(null);
      setForumError("");
      await refreshForum();
    } catch (error) {
      console.error("[ModuloConteudo] reply failed", error);
      setForumError("Não foi possível enviar sua resposta agora. Tente novamente.");
    }
  };

  const handleToggleLike = async (commentId: string) => {
    if (!isSignedIn) {
      setForumError("Entre com sua conta para curtir comentários.");
      return;
    }

    if (!currentUserId) {
      setForumError("Não foi possível identificar seu usuário. Tente recarregar a página.");
      return;
    }

    try {
      if (useRemoteForum) {
        const comment = forumComments.find((item) => item.id === commentId);
        if (!comment) {
          return;
        }

        const liked = !comment.likeUserIds.includes(currentUserId);
        await toggleRemoteForumLike({
          commentId,
          userId: currentUserId,
          liked,
        });
      } else {
        toggleForumCommentLike(slugValue, modId, commentId, currentUserId);
      }

      await refreshForum();
    } catch (error) {
      console.error("[ModuloConteudo] toggle like failed", error);
      setForumError("Não foi possível registrar sua curtida agora. Tente novamente.");
    }
  };

  const handleReport = async (commentId: string) => {
    if (!isSignedIn) {
      setForumError("Entre com sua conta para denunciar comentários.");
      return;
    }

    if (!currentUserId) {
      setForumError("Não foi possível identificar seu usuário. Tente recarregar a página.");
      return;
    }

    try {
      if (useRemoteForum) {
        const result = await reportRemoteForumComment({
          commentId,
          userId: currentUserId,
          reason: reportReason,
        });

        if (result === "already-reported") {
          setForumError("Você já denunciou este comentário.");
          return;
        }
      } else {
        const success = reportForumComment(slugValue, modId, commentId, currentUserId, reportReason);
        if (!success) {
          setForumError("Você já denunciou este comentário.");
          return;
        }
      }

      setReportingCommentId(null);
      setReportedCommentId(commentId);
      setForumError("");
      await refreshForum();
    } catch (error) {
      console.error("[ModuloConteudo] report failed", error);
      setForumError("Não foi possível enviar sua denúncia agora. Tente novamente.");
    }
  };

  return (
    <>
      <Seo
        title={`${trilha.titulo} · ${modulo.titulo}`}
        description={modulo.descricao}
        canonicalPath={`/trilhas/${trilha.slug}/modulo/${modulo.id}`}
        type="article"
      />

      <section className="min-h-screen bg-[var(--color-bg-surface)]">
        <div className="border-b border-[var(--color-border)] bg-[var(--color-bg)] px-4">
          <div className="mx-auto flex max-w-7xl items-center gap-2 py-3 text-sm text-[var(--color-text-muted)]">
            <Link to="/trilhas" className="hover:text-[var(--color-text-secondary)] cursor-pointer">Trilhas</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link to={`/trilhas/${trilha.slug}`} className="hover:text-[var(--color-text-secondary)] cursor-pointer">{trilha.titulo}</Link>
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
          <aside className="hidden w-60 shrink-0 lg:block">
            <nav className="sticky top-20">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Módulos</h3>
              <ol className="space-y-1">
                {trilha.modulos.map((m, i) => (
                  <li key={m.id}>
                    <Link
                      to={`/trilhas/${trilha.slug}/modulo/${m.id}`}
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
                        to={`/trilhas/${trilha.slug}/modulo/${m.id}`}
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

          <div className="min-w-0 flex-1">
            <div className="card-mk mb-8 p-6">
              <div className="flex items-start gap-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-bold ${cores.bg} ${cores.text}`}>{modIndex + 1}</div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-xl font-bold text-[var(--color-text)] sm:text-2xl">{modulo.titulo}</h1>
                    {moduleCompleted && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-[var(--color-emerald-light)] px-2 py-0.5 text-xs font-medium text-[var(--color-emerald)]">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Concluído
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{modulo.descricao}</p>
                  <div className="mt-2 flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
                    <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{modulo.duracao}</span>
                    <span className={`font-medium ${cores.text}`}>+{modulo.xp} XP</span>
                    <span>Módulo {modIndex + 1} de {trilha.modulos.length}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-mk mb-8 p-6 sm:p-8">
              <h2 className="mb-5 text-lg font-bold text-[var(--color-text)]">Conteúdo</h2>
              <div className="space-y-4">
                {conteudo.conteudo.map((paragrafo, i) => (
                  <p key={i} className="text-sm leading-relaxed text-[var(--color-text-secondary)]">{paragrafo}</p>
                ))}
              </div>
            </div>

            <div className="card-mk mb-8 p-6 sm:p-8">
              <h2 className="mb-5 text-lg font-bold text-[var(--color-text)]">Vídeo</h2>
              <div className="relative aspect-video overflow-hidden rounded-xl bg-[var(--color-dark)]">
                {conteudo.videoUrl ? (
                  <iframe
                    title="Video do modulo"
                    src={conteudo.videoUrl}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
                      <Play className="ml-1 h-7 w-7 text-white" />
                    </div>
                    <p className="text-sm font-medium text-white/70">{conteudo.videoTitulo}</p>
                    <p className="mt-1 text-xs text-white/40">Duração: {conteudo.videoDuracao}</p>
                  </div>
                )}
              </div>
              <p className="mt-3 text-xs text-[var(--color-text-muted)]">
                {conteudo.videoUrl
                  ? `Duração estimada: ${conteudo.videoDuracao}`
                  : "Vídeo demonstrativo — conteúdo disponível em breve."}
              </p>
            </div>

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
                  <button type="button" className="btn-primary" disabled={Object.keys(selectedAnswers).length < conteudo.questoes.length} onClick={handleSubmitQuiz}>
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

            <div className="card-mk mb-8 p-6 sm:p-8">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-bold text-[var(--color-text)]">Comentários da aula</h2>
                <span className="inline-flex items-center gap-1 rounded-md bg-[var(--color-mack-bg)] px-2.5 py-1 text-xs font-semibold text-[var(--color-mack)]">
                  <MessageSquare className="h-3.5 w-3.5" />
                  {topLevelComments.length} tópicos
                </span>
              </div>

              {!isLoaded && (
                <div className="mb-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-muted)] px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                  Carregando estado de autenticação...
                </div>
              )}

              {isLoaded && !isSignedIn && (
                <div className="mb-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-muted)] px-4 py-4">
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Entre com sua conta para comentar nesta aula, responder colegas, curtir e denunciar conteúdos inadequados.
                  </p>
                  <SignInButton mode="redirect" forceRedirectUrl={`/trilhas/${trilha.slug}/modulo/${modulo.id}`}>
                    <button type="button" className="btn-primary mt-3 text-sm">
                      Entrar para comentar
                    </button>
                  </SignInButton>
                </div>
              )}

              {isLoaded && isSignedIn && (
                <div className="mb-6 rounded-xl border border-[var(--color-border)] p-4">
                  <textarea
                    className="w-full resize-none rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-mack)] focus:outline-none"
                    rows={3}
                    placeholder="Faça uma pergunta ou compartilhe uma dúvida..."
                    value={forumText}
                    onChange={(event) => setForumText(event.target.value)}
                  />
                  <div className="mt-2 flex justify-between gap-3">
                    <span className="text-xs text-[var(--color-text-muted)]">
                      Comentando como {currentUserName}
                    </span>
                    <button type="button" className="btn-primary text-sm" onClick={handlePublishComment}>
                      <MessageSquare className="h-4 w-4" />
                      Publicar
                    </button>
                  </div>
                </div>
              )}

              {forumError && (
                <p className="mb-4 rounded-md border border-[var(--color-rose)]/30 bg-[var(--color-rose-light)] px-3 py-2 text-xs text-[var(--color-rose)]">
                  {forumError}
                </p>
              )}

              <div className="space-y-4">
                {topLevelComments.map((comment) => {
                  const replies = replyMap.get(comment.id) ?? [];
                  const isCommentHidden = isForumCommentHidden(comment);
                  const isLikedByCurrentUser = Boolean(currentUserId)
                    && comment.likeUserIds.includes(currentUserId);
                  const totalReplies = comment.legacyReplyCount + replies.length;

                  return (
                    <article key={comment.id} className="rounded-xl border border-[var(--color-border)] p-4">
                      <div className="mb-3 flex items-start gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-mack-bg)] text-xs font-bold text-[var(--color-mack)]">
                          {comment.authorInitials}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-[var(--color-text)]">{comment.authorName}</p>
                          <p className="text-xs text-[var(--color-text-muted)]">
                            {new Date(comment.createdAt).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                      </div>

                      {isCommentHidden ? (
                        <div className="rounded-md border border-[var(--color-amber)]/40 bg-[var(--color-amber-light)] px-3 py-2 text-xs text-[var(--color-amber)]">
                          <p className="inline-flex items-center gap-1 font-medium">
                            <AlertTriangle className="h-3.5 w-3.5" />
                            Comentário ocultado para revisão da moderação.
                          </p>
                        </div>
                      ) : (
                        <>
                          <p className="mb-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                            {comment.content}
                          </p>

                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${
                                isLikedByCurrentUser
                                  ? "border-[var(--color-mack)] bg-[var(--color-mack-bg)] text-[var(--color-mack)]"
                                  : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
                              }`}
                              onClick={() => handleToggleLike(comment.id)}
                            >
                              <Heart className="h-3.5 w-3.5" />
                              Curtir ({comment.likeUserIds.length})
                            </button>

                            <button
                              type="button"
                              className="inline-flex items-center gap-1 rounded-md border border-[var(--color-border)] px-2.5 py-1 text-xs font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text)]"
                              onClick={() => {
                                setActiveReplyId(activeReplyId === comment.id ? null : comment.id);
                                setReplyText("");
                              }}
                            >
                              <MessageSquare className="h-3.5 w-3.5" />
                              Responder
                            </button>

                            <button
                              type="button"
                              className="inline-flex items-center gap-1 rounded-md border border-[var(--color-border)] px-2.5 py-1 text-xs font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text)]"
                              onClick={() => {
                                setReportingCommentId(reportingCommentId === comment.id ? null : comment.id);
                                setReportReason("spam");
                              }}
                            >
                              <ShieldAlert className="h-3.5 w-3.5" />
                              Denunciar
                            </button>

                            <span className="ml-auto text-xs text-[var(--color-text-muted)]">
                              {totalReplies} {totalReplies === 1 ? "resposta" : "respostas"}
                            </span>
                          </div>

                          {activeReplyId === comment.id && (
                            <div className="mt-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-muted)] p-3">
                              <textarea
                                className="w-full resize-none rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] p-2.5 text-sm text-[var(--color-text)] focus:border-[var(--color-mack)] focus:outline-none"
                                rows={2}
                                placeholder="Escreva sua resposta"
                                value={replyText}
                                onChange={(event) => setReplyText(event.target.value)}
                              />
                              <div className="mt-2 flex justify-end gap-2">
                                <button
                                  type="button"
                                  className="btn-outline text-xs"
                                  onClick={() => {
                                    setActiveReplyId(null);
                                    setReplyText("");
                                  }}
                                >
                                  Cancelar
                                </button>
                                <button
                                  type="button"
                                  className="btn-primary text-xs"
                                  onClick={() => handleReply(comment.id)}
                                >
                                  Enviar resposta
                                </button>
                              </div>
                            </div>
                          )}

                          {reportingCommentId === comment.id && (
                            <div className="mt-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-muted)] p-3">
                              <label htmlFor={`report-${comment.id}`} className="mb-1 block text-xs font-semibold text-[var(--color-text-secondary)]">
                                Motivo da denúncia
                              </label>
                              <select
                                id={`report-${comment.id}`}
                                className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-2.5 py-2 text-sm text-[var(--color-text)]"
                                value={reportReason}
                                onChange={(event) => setReportReason(event.target.value as ReportReason)}
                              >
                                {(Object.keys(reportReasonLabel) as ReportReason[]).map((reason) => (
                                  <option key={reason} value={reason}>
                                    {reportReasonLabel[reason]}
                                  </option>
                                ))}
                              </select>

                              <div className="mt-2 flex justify-end gap-2">
                                <button
                                  type="button"
                                  className="btn-outline text-xs"
                                  onClick={() => setReportingCommentId(null)}
                                >
                                  Cancelar
                                </button>
                                <button
                                  type="button"
                                  className="btn-primary text-xs"
                                  onClick={() => handleReport(comment.id)}
                                >
                                  <AlertTriangle className="h-3.5 w-3.5" />
                                  Confirmar denúncia
                                </button>
                              </div>
                            </div>
                          )}

                          {reportedCommentId === comment.id && (
                            <p className="mt-3 inline-flex items-center gap-1 rounded-md bg-[var(--color-amber-light)] px-2 py-1 text-xs font-medium text-[var(--color-amber)]">
                              <AlertTriangle className="h-3.5 w-3.5" />
                              Comentário denunciado para moderação.
                            </p>
                          )}

                          {replies.length > 0 && (
                            <div className="mt-4 space-y-3 border-l-2 border-[var(--color-border)] pl-4">
                              {replies.map((reply) => (
                                <div key={reply.id} className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-muted)] p-3">
                                  <div className="mb-2 flex items-center gap-2">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-bg)] text-[10px] font-bold text-[var(--color-mack)]">
                                      {reply.authorInitials}
                                    </div>
                                    <div>
                                      <p className="text-xs font-semibold text-[var(--color-text)]">{reply.authorName}</p>
                                      <p className="text-[11px] text-[var(--color-text-muted)]">
                                        {new Date(reply.createdAt).toLocaleDateString("pt-BR")}
                                      </p>
                                    </div>
                                  </div>
                                  <p className="text-sm text-[var(--color-text-secondary)]">{reply.content}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </article>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between">
              {prevMod ? (
                <Link to={`/trilhas/${trilha.slug}/modulo/${prevMod.id}`} className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text)] cursor-pointer">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">{prevMod.titulo}</span>
                  <span className="sm:hidden">Anterior</span>
                </Link>
              ) : <div />}

              {nextMod ? (
                <Link to={`/trilhas/${trilha.slug}/modulo/${nextMod.id}`} className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2.5 text-sm font-medium text-[var(--color-mack)] transition-colors cursor-pointer">
                  <span className="hidden sm:inline">{nextMod.titulo}</span>
                  <span className="sm:hidden">Próximo</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <Link to={`/trilhas/${trilha.slug}`} className="btn-primary text-sm">
                  Concluir Trilha
                  <CheckCircle2 className="h-4 w-4" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
