import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  Lock,
  MessageSquare,
  ShieldCheck,
  Wifi,
} from "lucide-react";
import { trilhas, pilulas, estatisticas } from "../data/mock.ts";
import Seo from "../components/seo/Seo.tsx";
import { useUserDataRefresh } from "../hooks/useUserDataRefresh.ts";
import { getTrailProgress } from "../lib/userData.ts";

const statIcons: Record<string, React.ElementType> = {
  BookOpen,
  Clock,
  Download,
  Calendar: CalendarDays,
};

const journeySteps = [
  {
    id: "01",
    title: "Escolha sua trilha",
    description: "Selecione o tema e comece pelos módulos mais importantes para seu momento.",
    icon: BookOpen,
  },
  {
    id: "02",
    title: "Aprenda com prática",
    description: "Estude com conteúdo orientado, vídeo-aulas e questionários de fixação.",
    icon: Clock,
  },
  {
    id: "03",
    title: "Participe da comunidade",
    description: "Comente nas aulas, troque experiências e construa aprendizado coletivo.",
    icon: MessageSquare,
  },
] as const;

const securityPillars = [
  {
    title: "Proteção de Contas",
    description: "Fortaleça senhas, habilite autenticação em dois fatores e reduza invasões.",
    icon: Lock,
  },
  {
    title: "Prevenção de Golpes",
    description: "Reconheça engenharia social, phishing e sinais de fraude no dia a dia.",
    icon: Eye,
  },
  {
    title: "Privacidade e Rede",
    description: "Navegue com mais segurança em Wi-Fi público, dispositivos e aplicativos.",
    icon: Wifi,
  },
] as const;

export default function Home() {
  useUserDataRefresh();

  const trilhaDestaque = trilhas[0];
  const progressoDestaque = getTrailProgress(trilhaDestaque.slug, trilhaDestaque.modulos.length);

  return (
    <>
      <Seo
        title="MackSeguro"
        description="Plataforma educacional gratuita com trilhas interativas sobre segurança digital e saúde online."
        canonicalPath="/"
      />

      <section className="relative overflow-hidden border-b border-[var(--color-border)] bg-[var(--color-bg)]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 -top-28 h-72 w-72 rounded-full bg-[var(--color-mack)]/10 blur-3xl" />
          <div className="absolute -bottom-32 right-[-6rem] h-80 w-80 rounded-full bg-[var(--color-dark)]/10 blur-3xl" />
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-20">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-mack)]">
              <ShieldCheck className="h-3.5 w-3.5" />
              Projeto Extensionista Mackenzie
            </p>

            <h1 className="text-4xl font-semibold leading-tight text-[var(--color-text)] sm:text-5xl">
              Educação em segurança digital
              <span className="mt-2 block text-[var(--color-mack)]">feita para a comunidade</span>
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-relaxed text-[var(--color-text-secondary)]">
              Trilhas com abordagem prática, fórum por aula e materiais gratuitos para apoiar
              famílias, estudantes e profissionais na prevenção de riscos digitais.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/auth/sign-in" className="btn-outline btn-lg justify-center">
                Entrar
              </Link>
              <Link to="/trilhas" className="btn-primary btn-lg justify-center">
                Iniciar agora
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/sobre" className="btn-outline btn-lg justify-center">
                Conhecer o projeto
              </Link>
            </div>

            <div className="mt-8 grid gap-3 text-sm text-[var(--color-text-secondary)] sm:grid-cols-2">
              <p className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--color-emerald)]" />
                Conteúdo gratuito e atualizado
              </p>
              <p className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--color-emerald)]" />
                Trilhas por nível de maturidade
              </p>
            </div>
          </div>

          <article className="card-mk surface-stripe p-6 sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-mack)]">
              Trilha em Destaque
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-[var(--color-text)]">
              {trilhaDestaque.titulo}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
              {trilhaDestaque.descricaoLonga}
            </p>

            <div className="mt-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-4">
              <div className="mb-2 flex items-center justify-between text-sm font-semibold text-[var(--color-text-secondary)]">
                <span>Progresso atual</span>
                <span>{progressoDestaque.percentage}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[var(--color-bg-muted)]">
                <div
                  className="h-full rounded-full bg-[var(--color-mack)]"
                  style={{ width: `${progressoDestaque.percentage}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                {progressoDestaque.completedModules}/{trilhaDestaque.modulos.length} módulos concluídos
              </p>
            </div>

            <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
              <div className="rounded-lg border border-[var(--color-border)] bg-white px-3 py-2">
                <dt className="text-xs text-[var(--color-text-muted)]">Módulos</dt>
                <dd className="font-semibold text-[var(--color-text)]">{trilhaDestaque.modulos.length}</dd>
              </div>
              <div className="rounded-lg border border-[var(--color-border)] bg-white px-3 py-2">
                <dt className="text-xs text-[var(--color-text-muted)]">Carga média</dt>
                <dd className="font-semibold text-[var(--color-text)]">15 min</dd>
              </div>
              <div className="rounded-lg border border-[var(--color-border)] bg-white px-3 py-2">
                <dt className="text-xs text-[var(--color-text-muted)]">XP total</dt>
                <dd className="font-semibold text-[var(--color-text)]">{trilhaDestaque.totalXp}</dd>
              </div>
            </dl>
          </article>
        </div>
      </section>

      <section className="bg-[var(--color-bg-surface)] px-4 py-10 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {estatisticas.map((stat) => {
            const Icon = statIcons[stat.icone] ?? BookOpen;
            return (
              <article key={stat.label} className="card-mk p-4 text-center">
                <Icon className="mx-auto mb-2 h-5 w-5 text-[var(--color-mack)]" />
                <p className="text-2xl font-bold text-[var(--color-text)]">{stat.valor}</p>
                <p className="text-xs uppercase tracking-wider text-[var(--color-text-muted)]">{stat.label}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-mack)]">Método</p>
            <h2 className="mt-2 text-3xl font-semibold text-[var(--color-text)]">Como o MackSeguro funciona</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {journeySteps.map((step) => (
              <article key={step.id} className="card-mk p-5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-mack)]">Etapa {step.id}</p>
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-mack-bg)] text-[var(--color-mack)]">
                  <step.icon className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-semibold text-[var(--color-text)]">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-bg-surface)] px-4 py-14 sm:px-6 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-mack)]">Trilhas</p>
              <h2 className="mt-2 text-3xl font-semibold text-[var(--color-text)]">Percursos de aprendizagem</h2>
            </div>
            <Link to="/trilhas" className="text-sm font-semibold text-[var(--color-mack)] hover:text-[var(--color-mack-dark)] cursor-pointer">
              Ver todas
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {trilhas.map((trilha) => {
              const Icon = trilha.icone === "ShieldCheck" ? ShieldCheck : BookOpen;
              const progress = getTrailProgress(trilha.slug, trilha.modulos.length);

              return (
                <Link key={trilha.id} to={`/trilhas/${trilha.slug}`} className="card-mk interactive-card group block p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-mack-bg)] text-[var(--color-mack)]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="rounded-md border border-[var(--color-border)] px-2 py-0.5 text-xs font-semibold text-[var(--color-text-secondary)]">
                      {trilha.totalXp} XP
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold text-[var(--color-text)] transition-colors group-hover:text-[var(--color-mack)]">
                    {trilha.titulo}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                    {trilha.descricaoCurta}
                  </p>

                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[var(--color-bg-muted)]">
                    <div className="h-full rounded-full bg-[var(--color-mack)]" style={{ width: `${progress.percentage}%` }} />
                  </div>

                  <div className="mt-3 flex items-center justify-between text-sm text-[var(--color-text-secondary)]">
                    <span>{trilha.modulos.length} módulos</span>
                    <span className="inline-flex items-center gap-1 font-semibold text-[var(--color-mack)]">
                      Acessar
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-mack)]">Pílulas</p>
              <h2 className="mt-2 text-3xl font-semibold text-[var(--color-text)]">Dicas rápidas para aplicar hoje</h2>
            </div>
            <Link to="/pilulas" className="text-sm font-semibold text-[var(--color-mack)] hover:text-[var(--color-mack-dark)] cursor-pointer">
              Ver pílulas
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pilulas.slice(0, 4).map((pilula) => (
              <article key={pilula.id} className="card-mk p-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-mack)]">
                  {pilula.categoria}
                </p>
                <h3 className="text-base font-semibold text-[var(--color-text)]">{pilula.titulo}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                  {pilula.conteudo}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-bg-surface)] px-4 py-14 sm:px-6 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-mack)]">Impacto</p>
            <h2 className="mt-2 text-3xl font-semibold text-[var(--color-text)]">Competências desenvolvidas</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {securityPillars.map((pillar) => (
              <article key={pillar.title} className="card-mk p-5 text-center">
                <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-mack-bg)] text-[var(--color-mack)]">
                  <pillar.icon className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-semibold text-[var(--color-text)]">{pillar.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">{pillar.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[var(--color-mack)] px-4 py-16 sm:px-6">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 top-4 h-52 w-52 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -right-10 bottom-0 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold text-white">Pronto para começar?</h2>
          <p className="mt-3 text-base text-white/85">
            Crie sua conta, entre em uma trilha e participe das discussões das aulas para consolidar o aprendizado.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/auth/sign-in" className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/40 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10 cursor-pointer">
              Entrar na conta
            </Link>
            <Link to="/auth/sign-up" className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-[var(--color-mack)] transition-colors hover:bg-white/90 cursor-pointer">
              Criar conta gratuita
            </Link>
            <Link to="/trilhas" className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/40 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10 cursor-pointer">
              Explorar trilhas
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
