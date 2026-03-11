import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Shield,
  Heart,
  ArrowRight,
  Lightbulb,
  BookOpen,
  Clock,
  Download,
  CalendarDays,
  CheckCircle2,
  Lock,
  Eye,
  Wifi,
} from "lucide-react";
import { trilhas, pilulas, estatisticas } from "../data/mock.ts";

const statIcons: Record<string, React.ElementType> = {
  BookOpen,
  Clock,
  Download,
  Calendar: CalendarDays,
};

/* ===== Shared dark background ===== */
const DARK_BG = "#0c0c14";
const CARD_BG = "#161822";
const CARD_BORDER = "rgba(255,255,255,0.07)";

/* ===== Dot grid overlay (reusable) ===== */
function DotGrid({ opacity = "0.035" }: { opacity?: string }) {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        opacity,
        backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }}
    />
  );
}

export default function Home() {
  const preview = trilhas[0];

  return (
    <div style={{ background: DARK_BG }}>
      {/* ===== Landing Navbar ===== */}
      <nav className="relative z-50 mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <Shield className="h-7 w-7 text-[var(--color-mack)]" strokeWidth={2.2} />
          <span className="text-lg font-bold text-white tracking-tight">
            Mack<span className="text-[var(--color-mack)]">Seguro</span>
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/sobre" className="hidden text-sm text-white/50 hover:text-white transition-colors sm:block cursor-pointer">
            Sobre
          </Link>
          <Link
            to="/trilhas"
            className="rounded-lg bg-[var(--color-mack)] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-mack-dark)] cursor-pointer"
          >
            Acessar Plataforma
          </Link>
        </div>
      </nav>

      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden px-4 pb-20 pt-8 sm:pb-24 sm:pt-12 lg:pb-28 lg:pt-16">
        {/* Decorative background layer */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-[var(--color-mack)] blur-[120px] animate-pulse-glow" />
          <div className="absolute -left-20 bottom-0 h-80 w-80 rounded-full bg-[var(--color-mack)] opacity-[0.05] blur-[90px] animate-pulse-glow" style={{ animationDelay: "2s" }} />
          <div className="absolute right-[15%] top-[18%] h-3 w-3 rounded-full bg-[var(--color-mack)]/30 animate-float" />
          <div className="absolute left-[8%] top-[55%] h-2 w-2 rounded-full bg-white/20 animate-float-delayed" />
          <div className="absolute right-[42%] bottom-[22%] h-4 w-4 rotate-45 border border-white/10 animate-float" style={{ animationDelay: "1s" }} />
          <div className="absolute left-[28%] top-[22%] h-2.5 w-2.5 rounded-full border border-[var(--color-mack)]/25 animate-float-delayed" style={{ animationDelay: "3s" }} />
          <div className="absolute right-[8%] bottom-[40%] h-2 w-2 rounded-full bg-white/10 animate-float" style={{ animationDelay: "4s" }} />
          <DotGrid />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-1.5 text-xs font-semibold text-white/70 backdrop-blur-sm">
                <ShieldCheck className="h-3.5 w-3.5 text-[var(--color-mack-light)]" />
                Projeto Extensionista · Mackenzie
              </span>
              <h1 className="mt-6 text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-[3.25rem] lg:leading-[1.15]">
                Aprenda segurança{" "}
                <br className="hidden sm:block" />
                digital de forma{" "}
                <br className="hidden sm:block" />
                <span className="text-[var(--color-mack-light)]">prática</span>
              </h1>
              <p className="mt-5 max-w-lg text-lg leading-relaxed text-white/55">
                Trilhas interativas com vídeos, questionários e fórum de discussão.
                Proteja você e sua família no mundo digital — 100% gratuito.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/trilhas" className="btn-primary px-6 py-3 text-base">
                  Começar Gratuitamente
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/sobre"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/[0.05] px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-white/10 cursor-pointer"
                >
                  Sobre o Projeto
                </Link>
              </div>
            </div>

            {/* Course preview card — floating */}
            <div className="hidden lg:flex lg:justify-end">
              <div className="relative animate-float" style={{ animationDuration: "8s" }}>
                <div className="pointer-events-none absolute -inset-12 rounded-[2rem] bg-[var(--color-mack)] opacity-[0.15] blur-[60px]" />
                <div className="relative w-80 overflow-hidden rounded-2xl shadow-2xl shadow-black/40" style={{ border: `1px solid ${CARD_BORDER}` }}>
                  <div className="bg-[var(--color-mack)] px-6 py-8">
                    <ShieldCheck className="h-10 w-10 text-white/90" strokeWidth={1.5} />
                    <h3 className="mt-3 text-lg font-bold text-white">{preview.titulo}</h3>
                    <p className="mt-1 text-sm text-white/70">
                      {preview.modulos.length} módulos · {preview.totalXp} XP
                    </p>
                  </div>
                  <div style={{ background: CARD_BG }} className="p-5">
                    <div className="flex items-center gap-2 text-sm text-white/50">
                      <Clock className="h-4 w-4 text-white/30" />
                      ~15 min por módulo
                    </div>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full w-1/3 rounded-full bg-[var(--color-mack)]" />
                    </div>
                    <p className="mt-2 text-xs text-white/30">33% concluído</p>
                  </div>
                </div>
                <div className="absolute -right-4 -top-3 rounded-xl bg-white px-4 py-2 text-xs font-bold text-[#111827] shadow-lg">
                  100% Gratuito
                </div>
                <div className="absolute -bottom-5 -left-6 flex items-center gap-2.5 rounded-xl p-3 shadow-lg" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
                  <CheckCircle2 className="h-5 w-5 text-[var(--color-mack)]" />
                  <span className="text-sm font-medium text-white">9 módulos disponíveis</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Stats — red band ===== */}
      <section className="bg-[var(--color-mack)] px-4 py-10">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-6 sm:grid-cols-4">
          {estatisticas.map((stat) => {
            const Icon = statIcons[stat.icone] ?? BookOpen;
            return (
              <div key={stat.label} className="flex flex-col items-center text-center">
                <Icon className="mb-2 h-5 w-5 text-white/80" />
                <p className="text-2xl font-extrabold text-white">{stat.valor}</p>
                <p className="text-xs text-white/60">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== Como funciona ===== */}
      <section className="relative overflow-hidden px-4 py-16 sm:py-20">
        <DotGrid opacity="0.025" />
        <div className="relative mx-auto max-w-7xl">
          <p className="mb-2 text-center text-xs font-semibold uppercase tracking-widest text-[var(--color-mack-light)]">
            Passo a passo
          </p>
          <h2 className="mb-12 text-center text-2xl font-bold text-white sm:text-3xl">
            Como funciona
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { step: "1", title: "Escolha uma trilha", desc: "Navegue pelas trilhas de aprendizado e escolha o tema que mais interessa.", icon: BookOpen },
              { step: "2", title: "Estude no seu ritmo", desc: "Cada módulo tem conteúdo, vídeos e questionários para fixar o conhecimento.", icon: Clock },
              { step: "3", title: "Pratique e compartilhe", desc: "Participe do fórum, troque experiências e aplique o que aprendeu no dia a dia.", icon: Heart },
            ].map((item) => (
              <div
                key={item.step}
                className="group rounded-2xl p-6 transition-colors"
                style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-mack)] text-sm font-bold text-white shadow-md shadow-[var(--color-mack)]/20 transition-transform group-hover:scale-110">
                  {item.step}
                </div>
                <h3 className="mb-1 font-bold text-white">{item.title}</h3>
                <p className="text-sm leading-relaxed text-white/50">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Trilhas ===== */}
      <section className="relative overflow-hidden px-4 py-16">
        {/* Accent glow */}
        <div className="pointer-events-none absolute -left-40 top-1/2 h-[24rem] w-[24rem] -translate-y-1/2 rounded-full bg-[var(--color-mack)] opacity-[0.04] blur-[100px]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-[var(--color-mack-light)]">
                Conteúdo principal
              </p>
              <h2 className="text-2xl font-bold text-white">
                Trilhas de Aprendizado
              </h2>
              <p className="mt-2 text-sm text-white/45">
                Escolha uma trilha e avance no seu conhecimento
              </p>
            </div>
            <Link
              to="/trilhas"
              className="hidden text-sm font-medium text-[var(--color-mack-light)] hover:text-white transition-colors sm:inline cursor-pointer"
            >
              Ver todas →
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {trilhas.map((trilha) => {
              const Icon = trilha.icone === "ShieldCheck" ? ShieldCheck : Heart;
              return (
                <Link
                  key={trilha.id}
                  to={`/trilhas/${trilha.slug}`}
                  className="group flex gap-4 rounded-2xl p-5 transition-all hover:bg-white/[0.03]"
                  style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
                >
                  <div className="mt-0.5 rounded-xl bg-[var(--color-mack)]/15 p-2.5">
                    <Icon className="h-6 w-6 text-[var(--color-mack-light)]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white group-hover:text-[var(--color-mack-light)] transition-colors">
                      {trilha.titulo}
                    </h3>
                    <p className="mt-1 text-sm text-white/45">
                      {trilha.descricaoCurta}
                    </p>
                    <div className="mt-3 flex items-center gap-4 text-xs text-white/30">
                      <span>{trilha.modulos.length} módulos</span>
                      <span>{trilha.totalXp} XP</span>
                    </div>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-[var(--color-mack)]"
                        style={{ width: "0%" }}
                      />
                    </div>
                  </div>
                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-white/20 transition-transform group-hover:translate-x-0.5 group-hover:text-white/50" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== Features / Por que aprender ===== */}
      <section className="relative overflow-hidden px-4 py-16 sm:py-20">
        <div className="pointer-events-none absolute -right-32 top-0 h-[20rem] w-[20rem] rounded-full bg-[var(--color-mack)] opacity-[0.04] blur-[100px]" />
        <DotGrid opacity="0.02" />
        <div className="relative mx-auto max-w-7xl">
          <p className="mb-2 text-center text-xs font-semibold uppercase tracking-widest text-[var(--color-mack-light)]">
            Por que aprender?
          </p>
          <h2 className="mb-12 text-center text-2xl font-bold text-white sm:text-3xl">
            A segurança digital importa
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Lock, title: "Proteja seus dados", desc: "Aprenda a criar senhas fortes, ativar 2FA e manter suas contas seguras." },
              { icon: Eye, title: "Identifique golpes", desc: "Reconheça phishing, engenharia social e links maliciosos antes que seja tarde." },
              { icon: Wifi, title: "Navegue com segurança", desc: "Entenda os riscos de Wi-Fi público, VPN e privacidade online no dia a dia." },
            ].map((feat) => (
              <div
                key={feat.title}
                className="group rounded-2xl p-6 transition-colors hover:bg-white/[0.03]"
                style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-mack)]/15">
                  <feat.icon className="h-5 w-5 text-[var(--color-mack-light)]" />
                </div>
                <h3 className="mb-1 font-bold text-white">{feat.title}</h3>
                <p className="text-sm leading-relaxed text-white/50">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Pílulas ===== */}
      <section className="relative overflow-hidden px-4 py-16">
        <div className="pointer-events-none absolute -left-24 bottom-0 h-[18rem] w-[18rem] rounded-full bg-[var(--color-mack)] opacity-[0.04] blur-[80px]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-[var(--color-mack-light)]">
                Dicas rápidas
              </p>
              <h2 className="text-2xl font-bold text-white">
                Pílulas de Conhecimento
              </h2>
              <p className="mt-2 text-sm text-white/45">
                Dicas rápidas de segurança para o dia a dia
              </p>
            </div>
            <Link
              to="/pilulas"
              className="hidden text-sm font-medium text-[var(--color-mack-light)] hover:text-white transition-colors sm:inline cursor-pointer"
            >
              Ver todas →
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pilulas.map((pilula) => (
              <article
                key={pilula.id}
                className="flex flex-col rounded-2xl p-5 transition-colors hover:bg-white/[0.03]"
                style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
              >
                <span className="mb-3 inline-flex w-fit items-center gap-1 rounded-md bg-[var(--color-mack)]/15 px-2 py-0.5 text-xs font-medium text-[var(--color-mack-light)]">
                  <Lightbulb className="h-3 w-3" />
                  {pilula.categoria}
                </span>
                <h3 className="mb-1.5 font-semibold text-white">
                  {pilula.titulo}
                </h3>
                <p className="flex-1 text-sm leading-relaxed text-white/50">
                  {pilula.conteudo}
                </p>
              </article>
            ))}
          </div>

          <Link
            to="/pilulas"
            className="mt-6 block text-center text-sm font-medium text-[var(--color-mack-light)] hover:text-white sm:hidden cursor-pointer"
          >
            Ver todas →
          </Link>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="relative overflow-hidden bg-[var(--color-mack)] px-4 py-16 sm:py-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-white opacity-[0.06] blur-[80px]" />
          <div className="absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-white opacity-[0.04] blur-[60px]" />
        </div>
        <div className="relative mx-auto max-w-2xl text-center">
          <h2 className="mb-3 text-2xl font-bold text-white sm:text-3xl">
            Pronto para se proteger?
          </h2>
          <p className="mb-6 text-lg text-white/80">
            Comece agora — é gratuito, rápido e feito para todos.
          </p>
          <Link
            to="/trilhas"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-7 py-3 text-base font-semibold text-[var(--color-mack)] transition-colors hover:bg-white/90 cursor-pointer"
          >
            Acessar a Plataforma
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ===== Landing Footer ===== */}
      <footer className="border-t border-white/[0.06] px-4 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <Link to="/" className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-[var(--color-mack)]" strokeWidth={2.2} />
            <span className="text-sm font-bold text-white/70">
              Mack<span className="text-[var(--color-mack)]">Seguro</span>
            </span>
          </Link>
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} MackSeguro — Projeto Extensionista · Instituto Presbiteriano Mackenzie
          </p>
        </div>
      </footer>
    </div>
  );
}
