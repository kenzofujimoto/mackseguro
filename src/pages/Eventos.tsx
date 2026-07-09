import { ArrowUpRight, Clock, MapPin, Mic, Ticket, Users, Wrench, type LucideIcon } from "lucide-react";
import { eventos } from "../data/mock.ts";
import type { Evento } from "../data/mock.ts";
import Seo from "../components/seo/Seo.tsx";

/* ===== Date helpers (locale-safe, no timezone drift) ===== */

const MESES_CURTOS = [
  "JAN", "FEV", "MAR", "ABR", "MAI", "JUN",
  "JUL", "AGO", "SET", "OUT", "NOV", "DEZ",
];

const DIAS_SEMANA = [
  "domingo", "segunda-feira", "terça-feira", "quarta-feira",
  "quinta-feira", "sexta-feira", "sábado",
];

/** Parse "2026-04-15" as a local date — avoids the UTC-midnight off-by-one. */
function parseLocalDate(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function dateParts(iso: string) {
  const d = parseLocalDate(iso);
  return {
    day: String(d.getDate()).padStart(2, "0"),
    monthShort: MESES_CURTOS[d.getMonth()],
    weekday: DIAS_SEMANA[d.getDay()],
    year: String(d.getFullYear()),
  };
}

/** Uppercase only the first character — keeps "quarta-feira" as "Quarta-feira". */
function capitalizeFirst(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/* ===== Event type config — monochrome brand red; distinction via icon + label ===== */

const tipoConfig: Record<Evento["tipo"], { label: string; Icon: LucideIcon }> = {
  palestra: { label: "Palestra", Icon: Mic },
  workshop: { label: "Workshop", Icon: Wrench },
  "mesa-redonda": { label: "Mesa-redonda", Icon: Users },
};

/** Events ordered chronologically. */
const eventosOrdenados = [...eventos].sort((a, b) => a.data.localeCompare(b.data));

export default function Eventos() {
  const [destaque, ...resto] = eventosOrdenados;

  return (
    <>
      <Seo
        title="Eventos e Workshops"
        description="Confira a agenda de palestras, workshops e mesas-redondas do MackSeguro sobre segurança digital e saúde online."
        canonicalPath="/eventos"
      />

      <EventosHero />

      <section className="bg-[var(--color-bg)] px-4 py-16 sm:px-6 lg:py-20">
        <div className="event-ticket-list mx-auto max-w-4xl space-y-5">
          {destaque ? <FeaturedTicket evento={destaque} /> : null}
          {resto.map((evento) => (
            <SmallTicket key={evento.id} evento={evento} />
          ))}
        </div>
      </section>
    </>
  );
}

/* ===== Page header — built from the Sobre design language ===== */

function EventosHero() {
  return (
    <section className="relative overflow-hidden border-b border-[var(--color-border)] bg-[var(--color-bg-surface)] px-4 sm:px-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-[-8rem] hidden w-[34rem] -skew-x-6 bg-[var(--color-mack)]/5 lg:block"
      />

      <div className="relative mx-auto max-w-6xl py-16 lg:py-24">
        <div aria-hidden className="h-1 w-20 bg-[var(--color-mack)]" />

        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
          Agenda MackSeguro
        </p>

        <h1 className="mt-6 max-w-4xl text-balance text-4xl font-bold leading-[1.02] tracking-tight text-[var(--color-text)] sm:text-5xl lg:text-6xl">
          Eventos e workshops para{" "}
          <span className="text-[var(--color-mack)]">aprender em comunidade.</span>
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-[var(--color-text-secondary)]">
          Palestras, oficinas práticas e mesas-redondas sobre segurança digital e
          saúde online — abertas a toda a comunidade, dentro e fora da universidade.
        </p>
      </div>
    </section>
  );
}

/* ===== Reusable ticket pieces ===== */

function Perforation() {
  return (
    <div className="relative w-px shrink-0 self-stretch bg-[var(--color-border)]">
      <span
        aria-hidden
        className="absolute -top-2.5 left-1/2 h-5 w-5 -translate-x-1/2 rounded-full bg-[var(--color-bg)]"
      />
      <span
        aria-hidden
        className="absolute -bottom-2.5 left-1/2 h-5 w-5 -translate-x-1/2 rounded-full bg-[var(--color-bg)]"
      />
      <span
        aria-hidden
        className="absolute inset-y-3 left-1/2 -translate-x-1/2 border-l border-dashed border-[var(--color-border-strong)]"
      />
    </div>
  );
}

/* ===== Featured (large) ticket ===== */

function FeaturedTicket({ evento }: { evento: Evento }) {
  const { day, monthShort, year, weekday } = dateParts(evento.data);
  const { label, Icon } = tipoConfig[evento.tipo];

  return (
    <article className="event-ticket reveal-up flex overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-surface)] transition-shadow duration-[180ms] hover:shadow-[0_18px_50px_-22px_rgba(0,0,0,0.3)]">
      {/* Date stub */}
      <div className="event-ticket-date-stub relative flex w-24 shrink-0 flex-col items-center justify-center bg-[var(--color-mack)] px-3 py-7 text-center text-white sm:w-36">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
          {monthShort}
        </span>
        <span className="font-mono text-5xl font-bold leading-none sm:text-7xl">
          {day}
        </span>
        <span className="mt-1.5 text-[0.7rem] uppercase tracking-[0.16em] text-white/70">
          {year}
        </span>
      </div>

      <Perforation />

      {/* Body */}
      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-mack)]">
          Em destaque
        </p>
        <span className="mt-3 inline-flex w-fit items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
          <Icon className="h-3.5 w-3.5 text-[var(--color-mack)]" />
          {label}
        </span>
        <h2 className="mt-2 text-balance text-2xl font-bold leading-[1.1] tracking-tight text-[var(--color-text)] sm:text-3xl">
          {evento.titulo}
        </h2>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-[var(--color-text-secondary)]">
          {evento.descricao}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-2 pt-6 text-sm text-[var(--color-text-secondary)]">
          <span>{capitalizeFirst(weekday)}</span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-[var(--color-mack)]" />
            {evento.horario}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-[var(--color-mack)]" />
            {evento.local}
          </span>
        </div>

        <div className="mt-5 flex items-center gap-2 border-t border-dashed border-[var(--color-border)] pt-4 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
          <Ticket className="h-4 w-4 text-[var(--color-mack)]" />
          Entrada gratuita
        </div>
      </div>
    </article>
  );
}

/* ===== Smaller ticket ===== */

function SmallTicket({ evento }: { evento: Evento }) {
  const { day, monthShort, weekday } = dateParts(evento.data);
  const { label, Icon } = tipoConfig[evento.tipo];

  return (
    <article className="event-ticket reveal-up group mx-auto flex w-full max-w-[44rem] overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-surface)] transition-shadow duration-[180ms] hover:shadow-[0_12px_36px_-20px_rgba(0,0,0,0.25)]">
      {/* Date stub */}
      <div className="event-ticket-date-stub relative flex w-20 shrink-0 flex-col items-center justify-center bg-[var(--color-mack)] px-2 py-7 text-center text-white sm:w-24">
        <span className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-white/80">
          {monthShort}
        </span>
        <span className="font-mono text-3xl font-bold leading-none sm:text-4xl">
          {day}
        </span>
      </div>

      <Perforation />

      {/* Body */}
      <div className="flex flex-1 items-center justify-between gap-4 px-5 py-7 sm:px-6 sm:py-8">
        <div className="min-w-0">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-mack)]">
            <Icon className="h-3.5 w-3.5" />
            {label}
          </span>
          <h3 className="mt-1.5 text-lg font-semibold leading-snug tracking-tight text-[var(--color-text)] sm:text-xl">
            {evento.titulo}
          </h3>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[var(--color-text-muted)]">
            <span>{capitalizeFirst(weekday)}</span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-[var(--color-mack)]" />
              {evento.horario}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-[var(--color-mack)]" />
              {evento.local}
            </span>
          </div>
        </div>

        <ArrowUpRight className="hidden h-5 w-5 shrink-0 text-[var(--color-border-strong)] transition-all duration-[180ms] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--color-mack)] sm:block" />
      </div>
    </article>
  );
}
