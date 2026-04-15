import { SignIn } from "@clerk/react";
import Seo from "../components/seo/Seo.tsx";

export default function AuthSignIn() {
  return (
    <>
      <Seo
        title="Entrar"
        description="Acesse sua conta MackSeguro para comentar aulas e acompanhar progresso."
        canonicalPath="/auth/sign-in"
      />

      <section className="min-h-screen bg-[var(--color-bg-surface)] px-4 py-14">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-8">
          <header className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-mack)]">
              MackSeguro
            </p>
            <h1 className="mt-2 text-3xl font-bold text-[var(--color-text)] sm:text-4xl">
              Entrar na plataforma
            </h1>
            <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
              Faça login para participar do fórum e acompanhar seu progresso.
            </p>
          </header>

          <div className="card-mk p-4 sm:p-6">
            <SignIn routing="path" path="/auth/sign-in" signUpUrl="/auth/sign-up" />
          </div>
        </div>
      </section>
    </>
  );
}
