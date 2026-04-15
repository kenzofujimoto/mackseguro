import { SignIn } from "@clerk/react";
import Seo from "../components/seo/Seo.tsx";

const authAppearance = {
  variables: {
    colorPrimary: "#CC141D",
    colorText: "#555555",
    colorTextSecondary: "#666666",
    colorBackground: "#FFFFFF",
    colorInputBackground: "#FFFFFF",
    colorInputText: "#555555",
    borderRadius: "10px",
    fontFamily: "Roboto, Arial, sans-serif",
  },
  elements: {
    card: "!shadow-none !border !border-[var(--color-border)] !bg-[var(--color-bg-surface)]",
    headerTitle: "!text-[var(--color-text)]",
    headerSubtitle: "!text-[var(--color-text-secondary)]",
    formButtonPrimary: "!h-11 !rounded-[8px] !bg-[var(--color-mack)] !shadow-none hover:!bg-[var(--color-mack-dark)]",
    formFieldLabel: "!text-[var(--color-text-secondary)] !font-medium",
    formFieldInput: "!h-11 !rounded-[10px] !border !border-[var(--color-border)] focus:!border-[var(--color-mack)] focus:!shadow-none",
    socialButtonsBlockButton: "!h-11 !rounded-[10px] !border !border-[var(--color-border)] hover:!bg-[var(--color-bg-muted)]",
    footerActionLink: "!text-[var(--color-mack)] hover:!text-[var(--color-mack-dark)]",
    dividerLine: "!bg-[var(--color-border)]",
  },
} as const;

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
            <SignIn
              routing="path"
              path="/auth/sign-in"
              signUpUrl="/auth/sign-up"
              appearance={authAppearance}
            />
          </div>
        </div>
      </section>
    </>
  );
}
