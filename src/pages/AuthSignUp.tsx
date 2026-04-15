import { SignUp } from "@clerk/react";
import Seo from "../components/seo/Seo.tsx";

export default function AuthSignUp() {
  return (
    <>
      <Seo
        title="Criar Conta"
        description="Crie sua conta no MackSeguro para participar do fórum, registrar progresso e emitir certificado."
        canonicalPath="/auth/sign-up"
      />

      <section className="min-h-screen bg-[var(--color-bg-surface)] px-4 py-14">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-8">
          <header className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-mack)]">
              MackSeguro
            </p>
            <h1 className="mt-2 text-3xl font-bold text-[var(--color-text)] sm:text-4xl">
              Criar conta
            </h1>
            <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
              Cadastre-se para comentar aulas, avançar nas trilhas e gerar certificado.
            </p>
          </header>

          <div className="card-mk p-4 sm:p-6">
            <SignUp routing="path" path="/auth/sign-up" signInUrl="/auth/sign-in" />
          </div>
        </div>
      </section>
    </>
  );
}
