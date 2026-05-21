import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import App from "./App.tsx";

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
  it("renders the certificate validation route", () => {
    render(
      <MemoryRouter initialEntries={["/certificados/CERT-1234ABCD"]}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: /valida/i })).toBeInTheDocument();
    expect(screen.getByText("CERT-1234ABCD")).toBeInTheDocument();
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
