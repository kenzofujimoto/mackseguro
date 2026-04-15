import { Lightbulb } from "lucide-react";
import { pilulas, corMap } from "../data/mock.ts";
import type { CorKey } from "../data/mock.ts";
import Seo from "../components/seo/Seo.tsx";

export default function Pilulas() {
  return (
    <>
      <Seo
        title="Pílulas de Conhecimento"
        description="Consuma dicas rápidas de segurança digital com as pílulas de conhecimento do MackSeguro."
        canonicalPath="/pilulas"
      />

      <section className="bg-[var(--color-bg-surface)] px-4 py-14">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl font-bold text-[var(--color-text)] sm:text-3xl">
            Pílulas de Conhecimento
          </h1>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            Dicas rápidas e práticas para o seu dia a dia
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {pilulas.map((pilula) => {
              const cores = corMap[pilula.cor as CorKey];
              return (
                <article key={pilula.id} className="card-mk p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <span
                      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${cores.bg} ${cores.text}`}
                    >
                      <Lightbulb className="h-3 w-3" />
                      {pilula.categoria}
                    </span>
                    <time className="text-xs text-[var(--color-text-muted)]">
                      {new Date(pilula.data).toLocaleDateString("pt-BR")}
                    </time>
                  </div>

                  <h2 className="mb-1.5 text-base font-semibold text-[var(--color-text)]">
                    {pilula.titulo}
                  </h2>
                  <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                    {pilula.conteudo}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
