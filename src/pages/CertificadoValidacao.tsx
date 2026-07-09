import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import Seo from "../components/seo/Seo.tsx";
import {
  fetchCertificateByCode,
  type CertificateRecord,
} from "../lib/certificates.ts";

const CERTIFICATE_CODE_PATTERN = /^CERT-[A-F0-9]{8,32}$/;
type ValidationStatus = "checking" | "valid" | "invalid" | "error";

export default function CertificadoValidacao() {
  const { certificateCode } = useParams();
  const normalizedCode = (certificateCode ?? "").trim().toUpperCase();
  const hasValidFormat = CERTIFICATE_CODE_PATTERN.test(normalizedCode);
  const [status, setStatus] = useState<ValidationStatus>("checking");
  const [certificate, setCertificate] = useState<CertificateRecord | null>(null);

  useEffect(() => {
    let isCurrent = true;
    setCertificate(null);

    if (!hasValidFormat) {
      setStatus("invalid");
      return;
    }

    setStatus("checking");
    fetchCertificateByCode(normalizedCode)
      .then((record) => {
        if (!isCurrent) return;
        setCertificate(record);
        setStatus(record ? "valid" : "invalid");
      })
      .catch((error) => {
        console.error("Erro ao validar certificado", error);
        if (isCurrent) {
          setStatus("error");
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [hasValidFormat, normalizedCode]);

  const statusMessage = {
    checking: "Consultando os registros oficiais do MackSeguro.",
    valid: "Certificado encontrado nos registros oficiais do MackSeguro.",
    invalid: "Certificado não encontrado nos registros oficiais do MackSeguro.",
    error: "Não foi possível consultar os registros de certificados no momento.",
  }[status];

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
              {statusMessage}
            </p>

            <dl className="mt-6 rounded-lg border border-[var(--color-border)] bg-white p-4">
              <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                Código de validação
              </dt>
              <dd className="mt-2 break-all font-mono text-lg font-semibold text-[var(--color-text)]">
                {normalizedCode || "Não informado"}
              </dd>
            </dl>

            {certificate && (
              <dl className="mt-4 grid gap-4 rounded-lg border border-[var(--color-border)] bg-white p-4 sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                    Nome
                  </dt>
                  <dd className="mt-1 font-semibold text-[var(--color-text)]">
                    {certificate.userName}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                    Trilha
                  </dt>
                  <dd className="mt-1 font-semibold text-[var(--color-text)]">
                    {certificate.courseName}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                    Conclusão
                  </dt>
                  <dd className="mt-1 font-semibold text-[var(--color-text)]">
                    {certificate.completionDate}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                    Carga horária
                  </dt>
                  <dd className="mt-1 font-semibold text-[var(--color-text)]">
                    {certificate.totalHours}
                  </dd>
                </div>
              </dl>
            )}
          </article>
        </div>
      </section>
    </>
  );
}
