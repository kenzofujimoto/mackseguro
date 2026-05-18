import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ShieldCheck,
  Heart,
  Clock,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

import { corMap } from "../data/mock.ts";
import type { CorKey } from "../data/mock.ts";

import Seo from "../components/seo/Seo.tsx";

import { useUserDataRefresh } from "../hooks/useUserDataRefresh.ts";

import {
  getTrailEarnedXp,
  getTrailProgress,
  isModuleCompleted,
} from "../lib/userData.ts";

import { loadTrails } from "../lib/trailsRemote.ts";

export default function TrilhaDetalhe() {
  const { slug } = useParams<{ slug: string }>();

  const [trilha, setTrilha] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useUserDataRefresh();

  useEffect(() => {
    async function carregar() {
      const trails = await loadTrails();

      const encontrada =
        trails.find((t: any) => t.slug === slug) ?? null;

      setTrilha(encontrada);
      setLoading(false);
    }

    carregar();
  }, [slug]);

  if (loading) {
    return (
      <section className="bg-white px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">
          Carregando trilha...
        </h1>
      </section>
    );
  }

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

  const Icon =
    trilha.icone === "ShieldCheck"
      ? ShieldCheck
      : Heart;

  const cores =
    corMap[trilha.cor as CorKey] ??
    corMap.red;

  const progresso = getTrailProgress(
    trilha.slug,
    trilha.modulos.length,
  );

  const xpConquistado =
    getTrailEarnedXp(trilha);

  const modulosConcluidos = new Set(
    trilha.modulos
      .filter((modulo: any) => isModuleCompleted(trilha.slug, modulo.id))
      .map((modulo: any) => modulo.id),
  );

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

                  <span>
                    {trilha.modulos.length} módulos
                  </span>

                  <span>
                    {progresso.completedModules} concluídos
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-[var(--color-bg-muted)]">
              <div
                className={`h-full rounded-full ${cores.fill}`}
                style={{
                  width: `${progresso.percentage}%`,
                }}
              />
            </div>

            <p className="mt-1.5 text-right text-xs text-[var(--color-text-muted)]">
              {progresso.percentage}% concluído
            </p>
          </div>

          <div className="space-y-4">
            {trilha.modulos.map(
              (modulo: any, index: number) => {
                const concluido =
                  modulosConcluidos.has(modulo.id);

                return (
                  <div
                    key={modulo.id}
                    className="card-mk p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="mb-2 flex items-center gap-2">
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${cores.bg} ${cores.text}`}
                          >
                            Módulo {index + 1}
                          </span>

                          {concluido && (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600">
                              <CheckCircle2 className="h-4 w-4" />
                              Concluído
                            </span>
                          )}
                        </div>

                        <h2 className="text-lg font-bold text-[var(--color-text)]">
                          {modulo.titulo}
                        </h2>

                        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                          {modulo.descricao}
                        </p>

                        <div className="mt-3 flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {modulo.duracao}
                          </span>

                          <span>
                            {modulo.xp} XP
                          </span>
                        </div>
                      </div>

                      <Link
                        to={`/trilhas/${trilha.slug}/modulo/${modulo.id}`}
                        className="inline-flex items-center gap-1 rounded-lg bg-[var(--color-mack)] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
                      >
                        Abrir
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </div>
      </section>
    </>
  );
}