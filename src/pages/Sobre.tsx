import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Seo from "../components/seo/Seo.tsx";

const compromissos = [
  {
    titulo: "Missão clara",
    descricao:
      "Reduzir riscos digitais por meio de educação simples, atualizada e aplicável.",
  },
  {
    titulo: "Aprendizado ativo",
    descricao: "Conteúdo com vídeos, quiz e fórum para reforçar retenção e prática.",
  },
  {
    titulo: "Impacto comunitário",
    descricao:
      "Ações para jovens, idosos, educadores e trabalhadores dentro e fora da universidade.",
  },
] as const;

const praticas = [
  "Produção de conteúdo pedagógico com base em riscos atuais.",
  "Evolução contínua da experiência digital e acessibilidade.",
  "Conexão entre conhecimento acadêmico e necessidades reais da comunidade.",
] as const;

export default function Sobre() {
  return (
    <>
      <Seo
        title="Sobre o Projeto"
        description="Conheça a missão, atuação e equipe do MackSeguro, projeto extensionista do Instituto Presbiteriano Mackenzie."
        canonicalPath="/sobre"
      />

      <section className="relative overflow-hidden border-b border-[var(--color-border)] bg-[var(--color-bg-surface)] px-4 sm:px-6">
        <div className="pointer-events-none absolute inset-y-0 right-[-8rem] hidden w-[36rem] -skew-x-6 bg-[var(--color-mack)]/5 lg:block" />

        <div className="relative mx-auto max-w-7xl py-20 lg:py-32">
          <div aria-hidden className="h-1 w-20 bg-[var(--color-mack)]" />

          <p className="mt-10 text-sm font-semibold uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
            Sobre o projeto
          </p>

          <h1 className="mt-8 max-w-5xl text-balance text-5xl font-bold leading-[1.0] tracking-tight text-[var(--color-text)] sm:text-6xl lg:text-7xl">
            Educação digital prática para proteger pessoas na vida real.
          </h1>

          <p className="mt-10 max-w-3xl text-lg leading-relaxed text-[var(--color-text-secondary)] sm:text-xl">
            O MackSeguro conecta universidade e comunidade para transformar informação em
            proteção. Nosso foco é tornar segurança digital e saúde online acessíveis para
            quem mais precisa, com trilhas objetivas, materiais gratuitos e aprendizado
            colaborativo.
          </p>

          <div className="mt-12 flex flex-col gap-3 sm:flex-row">
            <Link to="/trilhas" className="btn-primary btn-lg justify-center sm:justify-start">
              Conhecer trilhas
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/materiais" className="btn-outline btn-lg justify-center sm:justify-start">
              Ver materiais
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-16 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl font-semibold leading-tight text-[var(--color-text)] sm:text-4xl lg:text-5xl">
            O que fazemos
          </h2>

          <div className="mt-10 space-y-4">
            <p className="max-w-4xl text-lg leading-relaxed text-[var(--color-text-secondary)] sm:text-xl">
              Oferecemos trilhas de segurança digital e saúde online com abordagem
              objetiva. Cada módulo combina explicação, exemplos e validação de aprendizado
              para facilitar o uso no dia a dia, desde proteção de contas até prevenção de
              golpes e equilíbrio digital.
            </p>
            <p className="max-w-4xl text-base leading-relaxed text-[var(--color-text-secondary)] sm:text-lg">
              Além da plataforma, disponibilizamos materiais gratuitos e promovemos
              atividades educativas presenciais e online para ampliar o alcance social do
              projeto.
            </p>
          </div>

          <ol className="mt-14 space-y-12 lg:mt-16">
            {compromissos.map((c, i) => (
              <li key={c.titulo}>
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-mack)] sm:text-sm">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 text-xl font-semibold leading-tight tracking-tight text-[var(--color-text)] sm:text-2xl lg:text-3xl">
                  {c.titulo}
                </h3>
                <p className="mt-2 max-w-3xl text-base leading-relaxed text-[var(--color-text-secondary)] sm:text-lg">
                  {c.descricao}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-[var(--color-bg-surface)] px-4 py-16 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl font-semibold leading-tight text-[var(--color-text)] sm:text-4xl lg:text-5xl">
            Quem constrói
          </h2>

          <p className="mt-10 max-w-4xl text-lg leading-relaxed text-[var(--color-text-secondary)] sm:text-xl">
            O MackSeguro é desenvolvido por estudantes e docentes do Instituto Presbiteriano
            Mackenzie no contexto das Atividades de Extensão curricular.
          </p>

          <ul className="mt-8 space-y-3">
            {praticas.map((pratica) => (
              <li
                key={pratica}
                className="flex gap-3 text-base leading-relaxed text-[var(--color-text-secondary)] sm:text-lg"
              >
                <span
                  aria-hidden
                  className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-mack)]"
                />
                <span>{pratica}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
