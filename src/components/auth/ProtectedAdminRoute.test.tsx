import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProtectedAdminRoute from "./ProtectedAdminRoute.tsx";

const mockUseAuth = vi.fn();
const mockUseUser = vi.fn();

vi.mock("@clerk/react", () => ({
  useAuth: () => mockUseAuth(),
  useUser: () => mockUseUser(),
}));

function renderAdminRoute() {
  return render(
    <MemoryRouter initialEntries={["/admin/trilhas"]}>
      <Routes>
        <Route
          path="/admin/trilhas"
          element={
            <ProtectedAdminRoute>
              <h1>Admin MackSeguro</h1>
            </ProtectedAdminRoute>
          }
        />
        <Route path="/auth/sign-in" element={<h1>Tela de login</h1>} />
        <Route path="/" element={<h1>Home pública</h1>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("ProtectedAdminRoute", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({ isLoaded: true, isSignedIn: true });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("allows emails configured through VITE_ADMIN_EMAILS", () => {
    vi.stubEnv("VITE_ADMIN_EMAILS", "admin@example.com, suporte@example.com");
    mockUseUser.mockReturnValue({
      user: {
        primaryEmailAddress: { emailAddress: "admin@example.com" },
      },
    });

    renderAdminRoute();

    expect(screen.getByRole("heading", { name: /admin mackseguro/i })).toBeInTheDocument();
  });

  it("does not grant access from hardcoded fallback emails", () => {
    vi.stubEnv("VITE_ADMIN_EMAILS", "");
    mockUseUser.mockReturnValue({
      user: {
        primaryEmailAddress: { emailAddress: "joaopaulo022005@gmail.com" },
      },
    });

    renderAdminRoute();

    expect(screen.getByRole("heading", { name: /home pública/i })).toBeInTheDocument();
  });
});
