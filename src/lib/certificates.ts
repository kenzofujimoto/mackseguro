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
  userName: string;
  courseName: string;
  completionDate: string;
  totalHours: string;
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

export async function issueCertificate(input: IssueCertificateInput): Promise<void> {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error("Erro de infraestrutura: Banco de dados indisponível.");
  }

  const { error } = await client.rpc("issue_certificate", {
    certificate_code: input.code,
    certificate_trail_slug: input.trailSlug,
    certificate_user_name: input.userName,
    certificate_course_name: input.courseName,
    certificate_completion_date: input.completionDate,
    certificate_total_hours: input.totalHours,
  });

  if (error) {
    throw new Error("Erro ao registrar certificado: " + error.message);
  }
}

export async function fetchCertificateByCode(
  code: string,
): Promise<CertificateRecord | null> {
  const client = getSupabaseClient();
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
