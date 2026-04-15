import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { ShieldCheck, Heart, Clock, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { trilhas, corMap } from "../data/mock.ts";
import type { CorKey } from "../data/mock.ts";
import Seo from "../components/seo/Seo.tsx";
import { useUserDataRefresh } from "../hooks/useUserDataRefresh.ts";
import {
  getTrailEarnedXp,
  getTrailProgress,
  isModuleCompleted,
} from "../lib/userData.ts";

export default function TrilhaDetalhe() {
  const { slug } = useParams<{ slug: string }>();
  const trilha = trilhas.find((t) => t.slug === slug);
  const dataVersion = useUserDataRefresh();

  if (!trilha) {
    return (
      <>
        <Seo
          title="Trilha não encontrada"
          description="A trilha solicitada não foi encontrada no MackSeguro."
          canonicalPath="/trilhas"
        />

        <section className="bg-white px-4 py-20 text-center">
          <h1 className="mb-4 text-2xl font-bold text-[var(--color-text)]">
            Trilha não encontrada
          </h1>
          <Link
            to="/trilhas"
            className="font-medium text-[var(--color-mack)] hover:underline cursor-pointer"
          >
            ← Voltar para trilhas
          </Link>
        </section>
      </>
    );
  }

  const Icon = trilha.icone === "ShieldCheck" ? ShieldCheck : Heart;
  const cores = corMap[trilha.cor as CorKey];
  const progresso = getTrailProgress(trilha.slug, trilha.modulos.length);
  const xpConquistado = getTrailEarnedXp(trilha);

  const modulosConcluidos = useMemo(() => {
    return new Set(
      trilha.modulos
        .filter((modulo) => isModuleCompleted(trilha.slug, modulo.id))
        .map((modulo) => modulo.id),
    );
  }, [dataVersion, trilha]);

  return (
    <>
      <Seo
        title={trilha.titulo}
        description={trilha.descricaoCurta}
        canonicalPath={`/trilhas/${trilha.slug}`}
        type="article"
      />

      <section className="bg-[var(--color-bg-surface)] px-4 py-14">
        <div className="mx-auto max-w-4xl">
          <Link
            to="/trilhas"
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-mack)] cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Todas as trilhas
          </Link>

          {/* Header card */}
          <div className="card-mk mb-8 p-6">
            <div className="flex items-start gap-4">
              <div className={`rounded-lg p-3 ${cores.bg}`}>
                <Icon className={`h-7 w-7 ${cores.text}`} />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-[var(--color-text)] sm:text-3xl">
                  {trilha.titulo}
                </h1>
                <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                  {trilha.descricaoLonga}
                </p>
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-[var(--color-text-muted)]">
                  <span
                    className={`rounded-md px-2 py-0.5 font-medium ${cores.bg} ${cores.text}`}
                  >
                    {xpConquistado}/{trilha.totalXp} XP
                  </span>
                  <span>{trilha.modulos.length} módulos</span>
                  <span>{progresso.completedModules} concluídos</span>
                </div>
              </div>
            </div>

            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-[var(--color-bg-muted)]">
              <div
                className={`h-full rounded-full ${cores.fill}`}
                style={{ width: `${progresso.percentage}%` }}
              />
            </div>
            <p className="mt-1.5 text-right text-xs text-[var(--color-text-muted)]">
              {progresso.percentage}% concluído
            </p>
          </div>

          {/* Modules */}
          <h2 className="mb-4 text-lg font-bold text-[var(--color-text)]">
            Módulos ({trilha.modulos.length})
          </h2>

          <ol className="space-y-3">
            {trilha.modulos.map((modulo, idx) => {
              const concluido = modulosConcluidos.has(modulo.id);
              return (
                <li key={modulo.id}>
                  <Link
                    to={`/trilhas/${slug}/modulo/${modulo.id}`}
                    className="card-mk group block p-5 cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${cores.bg} ${cores.text}`}
                      >
                        {idx + 1}
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-[var(--color-text)] group-hover:text-[var(--color-mack)] transition-colors">
                            {modulo.titulo}
                          </h3>
                          {concluido && (
                            <span className="inline-flex items-center gap-1 rounded-md bg-[var(--color-emerald-light)] px-2 py-0.5 text-xs font-medium text-[var(--color-emerald)]">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Concluído
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                          {modulo.descricao}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-[var(--color-text-muted)]">
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {modulo.duracao}
                          </span>
                          <span className={`${cores.text} font-medium`}>
                            +{modulo.xp} XP
                          </span>
                        </div>
                      </div>

                      {concluido ? (
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-[var(--color-emerald)]" />
                      ) : (
                        <ArrowRight className="h-5 w-5 shrink-0 text-[var(--color-text-muted)] transition-transform group-hover:translate-x-0.5" />
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
      </section>
    </>
  );
}
