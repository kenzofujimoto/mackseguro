import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, ShieldCheck, Target, Users } from "lucide-react";
import Seo from "../components/seo/Seo.tsx";

export default function Sobre() {
  return (
    <>
      <Seo
        title="Sobre o Projeto"
        description="Conheça a missão, atuação e equipe do MackSeguro, projeto extensionista do Instituto Presbiteriano Mackenzie."
        canonicalPath="/sobre"
      />

      <section className="relative overflow-hidden bg-[var(--color-bg-surface)] px-4 py-14 sm:px-6 lg:py-16">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-[var(--color-mack)]/8 blur-3xl" />
          <div className="absolute -right-20 bottom-[-4rem] h-72 w-72 rounded-full bg-[var(--color-mack-dark)]/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl">
          <article className="card-mk reveal-up surface-stripe p-6 sm:p-8">
            <p className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-mack)]">
              <ShieldCheck className="h-3.5 w-3.5" />
              Projeto Extensionista
            </p>

            <h1 className="mt-4 max-w-3xl text-3xl font-bold leading-tight text-[var(--color-text)] sm:text-4xl">
              Educação digital prática para proteger pessoas na vida real.
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[var(--color-text-secondary)] sm:text-base">
              O MackSeguro conecta universidade e comunidade para transformar informação em proteção.
              Nosso foco é tornar segurança digital e saúde online acessíveis para quem mais precisa,
              com trilhas objetivas, materiais gratuitos e aprendizado colaborativo.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/trilhas" className="btn-primary btn-sm sm:min-h-[44px] sm:px-6 sm:text-base">
                Conhecer trilhas
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/materiais" className="btn-outline btn-sm sm:min-h-[44px] sm:px-6 sm:text-base">
                Ver materiais
              </Link>
            </div>
          </article>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <article className="card-mk reveal-up p-5">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-mack-bg)] text-[var(--color-mack)]">
                <Target className="h-5 w-5" />
              </div>
              <h2 className="text-base font-bold text-[var(--color-text)]">Missão clara</h2>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                Reduzir riscos digitais por meio de educação simples, atualizada e aplicável.
              </p>
            </article>

            <article className="card-mk reveal-up p-5">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-mack-bg)] text-[var(--color-mack)]">
                <BookOpen className="h-5 w-5" />
              </div>
              <h2 className="text-base font-bold text-[var(--color-text)]">Aprendizado ativo</h2>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                Conteúdo com vídeos, quiz e fórum para reforçar retenção e prática.
              </p>
            </article>

            <article className="card-mk reveal-up p-5">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-mack-bg)] text-[var(--color-mack)]">
                <Users className="h-5 w-5" />
              </div>
              <h2 className="text-base font-bold text-[var(--color-text)]">Impacto comunitário</h2>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                Ações para jovens, idosos, educadores e trabalhadores dentro e fora da universidade.
              </p>
            </article>
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            <article className="card-mk reveal-up p-6">
              <h2 className="mb-3 text-lg font-bold text-[var(--color-text)]">O que fazemos</h2>
              <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                Oferecemos trilhas de segurança digital e saúde online com abordagem objetiva.
                Cada módulo combina explicação, exemplos e validação de aprendizado para facilitar
                o uso no dia a dia, desde proteção de contas até prevenção de golpes e equilíbrio digital.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                Além da plataforma, disponibilizamos materiais gratuitos e promovemos atividades educativas
                presenciais e online para ampliar o alcance social do projeto.
              </p>
            </article>

            <article className="card-mk reveal-up p-6">
              <h2 className="mb-3 text-lg font-bold text-[var(--color-text)]">Quem constrói</h2>
              <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                O MackSeguro é desenvolvido por estudantes e docentes do Instituto Presbiteriano Mackenzie
                no contexto das Atividades de Extensão curricular.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-[var(--color-text-secondary)]">
                <li className="inline-flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[var(--color-mack)]" />
                  Produção de conteúdo pedagógico com base em riscos atuais.
                </li>
                <li className="inline-flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[var(--color-mack)]" />
                  Evolução contínua da experiência digital e acessibilidade.
                </li>
                <li className="inline-flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[var(--color-mack)]" />
                  Conexão entre conhecimento acadêmico e necessidades reais da comunidade.
                </li>
              </ul>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
