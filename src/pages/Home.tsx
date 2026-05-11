import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { trilhas } from "../data/mock.ts";
import Seo from "../components/seo/Seo.tsx";
import { useUserDataRefresh } from "../hooks/useUserDataRefresh.ts";
import { getTrailProgress } from "../lib/userData.ts";

const journeySteps = [
  {
    id: "01",
    title: "Escolha sua trilha",
    description: "Escolha o tema e comece pelos módulos mais importantes para o seu momento.",
  },
  {
    id: "02",
    title: "Aprenda com prática",
    description: "Estude com conteúdo guiado, vídeo-aulas e exercícios para fixar.",
  },
  {
    id: "03",
    title: "Participe da comunidade",
    description: "Comente nas aulas, troque experiências com outros alunos e aprenda em conjunto.",
  },
] as const;

function formatTotalMinutes(totalMinutes: number) {
  if (totalMinutes < 60) {
    return `${totalMinutes} min`;
  }

  const hours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;
  const hoursLabel = hours === 1 ? "1 hora" : `${hours} horas`;

  if (remainingMinutes === 0) {
    return hoursLabel;
  }

  return `${hoursLabel} e ${remainingMinutes} min`;
}

export default function Home() {
  useUserDataRefresh();

  const trilhaDestaque = trilhas[0];
  const progressoDestaque = getTrailProgress(trilhaDestaque.slug, trilhaDestaque.modulos.length);
  const minutosTotaisDestaque = trilhaDestaque.modulos.reduce(
    (total, modulo) => total + parseInt(modulo.duracao, 10),
    0,
  );

  return (
    <>
      <Seo
        title="MackSeguro"
        description="Plataforma educacional gratuita com trilhas interativas sobre segurança digital e saúde online."
        canonicalPath="/"
      />

      <section
        className="relative border-b border-[var(--color-border)] bg-[var(--color-bg)] px-4 sm:px-6"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(204,20,29,0.06) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          backgroundPosition: "0 0",
        }}
      >
        <div className="relative mx-auto max-w-6xl py-14 lg:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
            Universidade Presbiteriana Mackenzie · FCI
          </p>

          <h1 className="mt-8 max-w-5xl text-balance text-5xl font-bold leading-[0.98] tracking-tight text-[var(--color-text)] sm:text-6xl lg:text-[6.5rem]">
            Educação em segurança digital,{" "}
            <span className="text-[var(--color-mack)]">feita para a comunidade.</span>
          </h1>

          <div className="mt-14 grid gap-x-12 gap-y-7 lg:grid-cols-12 lg:items-end">
            <p className="max-w-xl text-base leading-relaxed text-[var(--color-text-secondary)] sm:text-lg lg:col-span-7">
              Aulas curtas em português, com fórum por aula. Para qualquer pessoa
              entender como se proteger online: reconhecer golpes, criar senhas
              fortes, cuidar da privacidade da família inteira.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row lg:col-span-5 lg:justify-end">
              <Link to="/trilhas" className="btn-primary btn-lg justify-center">
                Iniciar agora
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/sobre" className="btn-outline btn-lg justify-center">
                Conhecer o projeto
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-bg-surface)] px-4 py-12 sm:px-6 lg:py-14">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-mack)]">
            Trilha em destaque
          </p>

          <div className="mt-4 grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-8">
              <h2 className="text-3xl font-semibold leading-tight text-[var(--color-text)] sm:text-4xl">
                {trilhaDestaque.titulo}
              </h2>
              <p className="mt-6 max-w-prose text-base leading-relaxed text-[var(--color-text-secondary)] sm:text-lg">
                {trilhaDestaque.descricaoLonga}
              </p>
              <dl className="mt-8 grid max-w-md grid-cols-3 gap-x-8 border-t border-[var(--color-border)] pt-5">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                    Módulos
                  </dt>
                  <dd className="mt-1.5 text-base font-semibold text-[var(--color-text)]">
                    {trilhaDestaque.modulos.length}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                    Por aula
                  </dt>
                  <dd className="mt-1.5 text-base font-semibold text-[var(--color-text)]">
                    15 min
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                    No total
                  </dt>
                  <dd className="mt-1.5 text-base font-semibold text-[var(--color-text)]">
                    {formatTotalMinutes(minutosTotaisDestaque)}
                  </dd>
                </div>
              </dl>
              <div className="mt-10">
                <Link to={`/trilhas/${trilhaDestaque.slug}`} className="btn-primary btn-lg">
                  {progressoDestaque.percentage > 0 ? "Continuar trilha" : "Iniciar trilha"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <aside className="lg:col-span-4 lg:border-l lg:border-[var(--color-border)] lg:pl-10">
              {progressoDestaque.percentage > 0 ? (
                <div className="mb-7 border-b border-[var(--color-border)] pb-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                    Seu progresso
                  </p>
                  <p className="mt-3 text-4xl font-semibold text-[var(--color-text)]">
                    {progressoDestaque.percentage}%
                  </p>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--color-bg-muted)]">
                    <div
                      className="h-full rounded-full bg-[var(--color-mack)]"
                      style={{ width: `${progressoDestaque.percentage}%` }}
                    />
                  </div>
                  <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
                    {progressoDestaque.completedModules} de {trilhaDestaque.modulos.length} módulos concluídos
                  </p>
                </div>
              ) : null}

              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                O que você vai aprender
              </p>
              <ol className="mt-4 space-y-3">
                {trilhaDestaque.modulos.slice(0, 3).map((modulo, index) => (
                  <li
                    key={modulo.id}
                    className="flex gap-3 text-sm leading-relaxed text-[var(--color-text-secondary)]"
                  >
                    <span className="font-mono text-xs font-semibold tracking-[0.12em] text-[var(--color-text-muted)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>{modulo.titulo}</span>
                  </li>
                ))}
              </ol>
              {trilhaDestaque.modulos.length > 3 ? (
                <Link
                  to={`/trilhas/${trilhaDestaque.slug}`}
                  className="mt-5 inline-flex items-center gap-1.5 rounded-sm text-sm font-semibold text-[var(--color-mack)] transition-colors hover:text-[var(--color-mack-dark)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-mack)]"
                >
                  Ver os {trilhaDestaque.modulos.length} módulos
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              ) : null}
            </aside>
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--color-border)] px-4 py-12 sm:px-6 lg:py-14">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-text-secondary)]">Método</p>
          <h2 className="mt-2 text-3xl font-semibold text-[var(--color-text)] sm:text-4xl">
            Como o MackSeguro funciona
          </h2>

          <ol className="mt-10 space-y-8">
            {journeySteps.map((step) => (
              <li
                key={step.id}
                className="grid gap-5 border-t border-[var(--color-border)] pt-8 sm:grid-cols-[5rem_1fr] sm:gap-10"
              >
                <span className="font-mono text-3xl font-semibold leading-none text-[var(--color-text-secondary)] sm:text-4xl">
                  {step.id}
                </span>
                <div>
                  <h3 className="text-xl font-semibold text-[var(--color-text)] sm:text-2xl">{step.title}</h3>
                  <p className="mt-3 max-w-prose text-base leading-relaxed text-[var(--color-text-secondary)]">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-[var(--color-border)] bg-[var(--color-bg-surface)] px-4 py-12 sm:px-6 lg:py-14">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-text-secondary)]">Trilhas</p>
              <h2 className="mt-2 text-3xl font-semibold text-[var(--color-text)] sm:text-4xl">
                Percursos de aprendizagem
              </h2>
            </div>
            <Link
              to="/trilhas"
              className="-my-1 rounded-sm py-1 text-sm font-semibold text-[var(--color-mack)] hover:text-[var(--color-mack-dark)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-mack)]"
            >
              Ver todas
            </Link>
          </div>

          <ol className="mt-10">
            {trilhas.map((trilha, index) => {
              const progress = getTrailProgress(trilha.slug, trilha.modulos.length);
              const indexLabel = String(index + 1).padStart(2, "0");

              return (
                <li key={trilha.id} className="border-t border-[var(--color-border)] last:border-b">
                  <Link
                    to={`/trilhas/${trilha.slug}`}
                    className="group grid gap-4 py-6 transition-colors hover:bg-[var(--color-bg)] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--color-mack)] sm:grid-cols-[4rem_1fr_auto] sm:items-center sm:gap-8 sm:px-2 sm:-mx-2"
                  >
                    <span className="font-mono text-sm font-semibold tracking-[0.16em] text-[var(--color-text-muted)]">
                      {indexLabel}
                    </span>

                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold text-[var(--color-text)] transition-colors group-hover:text-[var(--color-mack)] sm:text-xl">
                        {trilha.titulo}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                        {trilha.descricaoCurta}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[var(--color-text-muted)]">
                        <span>{trilha.modulos.length} módulos</span>
                        {progress.percentage > 0 ? (
                          <>
                            <span aria-hidden>·</span>
                            <span>{progress.percentage}% concluído</span>
                          </>
                        ) : null}
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-text-secondary)] transition-colors group-hover:text-[var(--color-mack)] sm:justify-self-end">
                      Acessar
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
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
