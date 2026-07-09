import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App.tsx";
import { fetchCertificateByCode } from "./lib/certificates.ts";

vi.mock("./lib/certificates.ts", () => ({
  fetchCertificateByCode: vi.fn(),
  issueCertificate: vi.fn(),
}));

vi.mock("@clerk/react", async () => {
  const actual = await vi.importActual<typeof import("@clerk/react")>("@clerk/react");

  return {
    ...actual,
    useAuth: () => ({
      getToken: vi.fn().mockResolvedValue("token-test"),
    }),
    useUser: () => ({
      isLoaded: true,
      isSignedIn: false,
    }),
  };
});

describe("App routing", () => {
  beforeEach(() => {
    vi.mocked(fetchCertificateByCode).mockReset();
  });

  it("renders an issued certificate from the validation route", async () => {
    vi.mocked(fetchCertificateByCode).mockResolvedValue({
      code: "CERT-1234ABCD",
      trailSlug: "seguranca-digital",
      userName: "Aluno Teste",
      courseName: "Segurança Digital",
      completionDate: "21/05/2026",
      totalHours: "10 horas",
      issuedAt: "2026-05-21T00:00:00.000Z",
    });

    render(
      <MemoryRouter initialEntries={["/certificados/CERT-1234ABCD"]}>
        <App />
      </MemoryRouter>,
    );

    expect(await screen.findByRole("heading", { name: /valida/i })).toBeInTheDocument();
    expect(await screen.findByText(/certificado encontrado/i)).toBeInTheDocument();
    expect(screen.getByText("Aluno Teste")).toBeInTheDocument();
    expect(fetchCertificateByCode).toHaveBeenCalledWith("CERT-1234ABCD");
  });

  it("does not validate a certificate code without an issued record", async () => {
    vi.mocked(fetchCertificateByCode).mockResolvedValue(null);

    render(
      <MemoryRouter initialEntries={["/certificados/CERT-1234ABCD"]}>
        <App />
      </MemoryRouter>,
    );

    expect(await screen.findByText(/certificado não encontrado/i)).toBeInTheDocument();
    expect(screen.queryByText(/certificado encontrado/i)).not.toBeInTheDocument();
  });

  it("renders a not found page for unknown routes", () => {
    render(
      <MemoryRouter initialEntries={["/rota-invalida"]}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: /página não encontrada/i })).toBeInTheDocument();
  });
});
