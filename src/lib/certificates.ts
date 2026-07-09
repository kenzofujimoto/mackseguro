import { getSupabaseClient } from "./supabaseConfig.ts";

export interface CertificateRecord {
  code: string;
  trailSlug: string;
  userName: string;
  courseName: string;
  completionDate: string;
  totalHours: string;
  issuedAt: string;
}

interface CertificateRow {
  code: string;
  trail_slug: string;
  user_name: string;
  course_name: string;
  completion_date: string;
  total_hours: string;
  issued_at: string;
}

interface IssueCertificateInput {
  code: string;
  trailSlug: string;
}

function mapCertificateRow(row: CertificateRow): CertificateRecord {
  return {
    code: row.code,
    trailSlug: row.trail_slug,
    userName: row.user_name,
    courseName: row.course_name,
    completionDate: row.completion_date,
    totalHours: row.total_hours,
    issuedAt: row.issued_at,
  };
}

export async function issueCertificate(
  input: IssueCertificateInput,
): Promise<CertificateRecord> {
  const client = await getSupabaseClient();
  if (!client) {
    throw new Error("Erro de infraestrutura: Banco de dados indisponível.");
  }

  const { data, error } = await client.rpc("issue_certificate", {
    certificate_code: input.code,
    certificate_trail_slug: input.trailSlug,
  });

  if (error) {
    throw new Error("Erro ao registrar certificado: " + error.message);
  }

  const [row] = (data ?? []) as CertificateRow[];
  if (!row) {
    throw new Error("Erro ao registrar certificado: resposta inválida.");
  }

  return mapCertificateRow(row);
}

export async function fetchCertificateByCode(
  code: string,
): Promise<CertificateRecord | null> {
  const client = await getSupabaseClient();
  if (!client) {
    throw new Error("Erro de infraestrutura: Banco de dados indisponível.");
  }

  const { data, error } = await client.rpc("validate_certificate", {
    certificate_code: code,
  });

  if (error) {
    throw new Error("Erro ao consultar certificado: " + error.message);
  }

  const [row] = (data ?? []) as CertificateRow[];
  return row ? mapCertificateRow(row) : null;
}
