import { beforeEach, describe, expect, it, vi } from "vitest";
import { fetchCertificateByCode, issueCertificate } from "./certificates.ts";
import { getSupabaseClient } from "./supabaseConfig.ts";

vi.mock("./supabaseConfig.ts", () => ({
  getSupabaseClient: vi.fn(),
}));

const certificateRow = {
  code: "CERT-1234ABCD",
  trail_slug: "seguranca-digital",
  user_name: "Aluno Teste",
  course_name: "Segurança Digital para Todos",
  completion_date: "21/05/2026",
  total_hours: "10 horas",
  issued_at: "2026-05-21T00:00:00.000Z",
};

describe("certificates", () => {
  const rpc = vi.fn();

  beforeEach(() => {
    rpc.mockReset();
    vi.mocked(getSupabaseClient).mockReturnValue({ rpc } as never);
  });

  it("issues certificates without sending client-controlled metadata", async () => {
    rpc.mockResolvedValue({ data: [certificateRow], error: null });

    const result = await issueCertificate({
      code: "CERT-1234ABCD",
      trailSlug: "seguranca-digital",
    });

    expect(rpc).toHaveBeenCalledWith("issue_certificate", {
      certificate_code: "CERT-1234ABCD",
      certificate_trail_slug: "seguranca-digital",
    });
    expect(result).toMatchObject({
      userName: "Aluno Teste",
      courseName: "Segurança Digital para Todos",
    });
  });

  it("fetches persisted certificate records by code", async () => {
    rpc.mockResolvedValue({ data: [certificateRow], error: null });

    const result = await fetchCertificateByCode("CERT-1234ABCD");

    expect(rpc).toHaveBeenCalledWith("validate_certificate", {
      certificate_code: "CERT-1234ABCD",
    });
    expect(result?.completionDate).toBe("21/05/2026");
  });
});
