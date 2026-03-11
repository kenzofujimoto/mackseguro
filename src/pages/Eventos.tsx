import { Calendar, Clock, MapPin } from "lucide-react";
import { eventos } from "../data/mock.ts";

const tipoBadge: Record<string, string> = {
  palestra: "bg-[var(--color-mack-bg)] text-[var(--color-mack)]",
  workshop: "bg-[var(--color-mack-bg)] text-[var(--color-mack)]",
  "mesa-redonda": "bg-[var(--color-mack-bg)] text-[var(--color-mack)]",
};

export default function Eventos() {
  return (
    <section className="bg-[var(--color-bg-surface)] px-4 py-14">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-2xl font-bold text-[var(--color-text)] sm:text-3xl">
          Eventos e Workshops
        </h1>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          Palestras, oficinas e mesas-redondas sobre segurança digital
        </p>

        <div className="mt-8 space-y-4">
          {eventos.map((evento) => (
            <article key={evento.id} className="card-mk p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <span
                    className={`mb-2 inline-block rounded-md px-2 py-0.5 text-xs font-medium capitalize ${tipoBadge[evento.tipo]}`}
                  >
                    {evento.tipo.replace("-", " ")}
                  </span>
                  <h2 className="mb-1.5 text-lg font-semibold text-[var(--color-text)]">
                    {evento.titulo}
                  </h2>
                  <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                    {evento.descricao}
                  </p>
                </div>

                <div className="flex flex-col gap-2 text-sm sm:items-end sm:text-right">
                  <span className="inline-flex items-center gap-1.5 text-[var(--color-text-secondary)]">
                    <Calendar className="h-4 w-4 text-[var(--color-mack)]" />
                    {new Date(evento.data).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[var(--color-text-secondary)]">
                    <Clock className="h-4 w-4 text-[var(--color-mack)]" />
                    {evento.horario}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[var(--color-text-secondary)]">
                    <MapPin className="h-4 w-4 text-[var(--color-mack)]" />
                    {evento.local}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
