import { Link } from "react-router-dom";
import { ShieldCheck, Heart, ArrowRight } from "lucide-react";
import { trilhas, corMap } from "../data/mock.ts";
import type { CorKey } from "../data/mock.ts";

export default function Trilhas() {
  return (
    <section className="bg-[var(--color-bg-surface)] px-4 py-14">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-2xl font-bold text-[var(--color-text)] sm:text-3xl">
          Trilhas de Aprendizado
        </h1>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          Percursos didáticos para dominar segurança digital
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {trilhas.map((trilha) => {
            const Icon = trilha.icone === "ShieldCheck" ? ShieldCheck : Heart;
            const cores = corMap[trilha.cor as CorKey];
            return (
              <Link
                key={trilha.id}
                to={`/trilhas/${trilha.slug}`}
                className="card-mk group flex flex-col p-6"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className={`rounded-lg p-2.5 ${cores.bg}`}>
                    <Icon className={`h-6 w-6 ${cores.text}`} />
                  </div>
                  <span
                    className={`rounded-md px-2 py-0.5 text-xs font-medium ${cores.bg} ${cores.text}`}
                  >
                    {trilha.totalXp} XP
                  </span>
                </div>

                <h2 className="mb-2 text-xl font-bold text-[var(--color-text)] transition-colors group-hover:text-[var(--color-mack)]">
                  {trilha.titulo}
                </h2>

                <p className="mb-5 flex-1 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                  {trilha.descricaoLonga}
                </p>

                <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-[var(--color-bg-muted)]">
                  <div
                    className={`h-full rounded-full ${cores.fill}`}
                    style={{ width: "0%" }}
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--color-text-muted)]">
                    {trilha.modulos.length} módulos
                  </span>
                  <span className="flex items-center gap-1 font-medium text-[var(--color-mack)]">
                    Acessar trilha
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
