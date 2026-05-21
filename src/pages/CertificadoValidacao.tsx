import { useParams } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import Seo from "../components/seo/Seo.tsx";

const CERTIFICATE_CODE_PATTERN = /^CERT-[A-F0-9]{8}$/;

export default function CertificadoValidacao() {
  const { certificateCode } = useParams();
  const normalizedCode = (certificateCode ?? "").trim().toUpperCase();
  const hasValidFormat = CERTIFICATE_CODE_PATTERN.test(normalizedCode);

  return (
    <>
      <Seo
        title="Validação de Certificado"
        description="Página de validação de certificados digitais emitidos pelo MackSeguro."
        canonicalPath={`/certificados/${normalizedCode}`}
      />

      <section className="bg-[var(--color-bg-surface)] px-4 py-14">
        <div className="mx-auto max-w-3xl">
          <article className="card-mk p-6 sm:p-8">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-mack-bg)] text-[var(--color-mack)]">
              <ShieldCheck className="h-6 w-6" />
            </div>

            <h1 className="text-2xl font-bold text-[var(--color-text)] sm:text-3xl">
              Validação de Certificado
            </h1>

            <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)] sm:text-base">
              {hasValidFormat
                ? "O código informado segue o padrão dos certificados emitidos pelo MackSeguro."
                : "O código informado não segue o padrão dos certificados MackSeguro."}
            </p>

            <dl className="mt-6 rounded-lg border border-[var(--color-border)] bg-white p-4">
              <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                Código de validação
              </dt>
              <dd className="mt-2 break-all font-mono text-lg font-semibold text-[var(--color-text)]">
                {normalizedCode || "Não informado"}
              </dd>
            </dl>
          </article>
        </div>
      </section>
    </>
  );
}
