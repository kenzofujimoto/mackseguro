import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CourseAccessGate from "./CourseAccessGate.tsx";

const mockUseUser = vi.fn();
const mockIsCourseAuthRequired = vi.fn();

vi.mock("@clerk/react", () => ({
  useUser: () => mockUseUser(),
}));

vi.mock("../../lib/clerkConfig.ts", async () => {
  const actual = await vi.importActual<typeof import("../../lib/clerkConfig.ts")>(
    "../../lib/clerkConfig.ts",
  );

  return {
    ...actual,
    isCourseAuthRequired: () => mockIsCourseAuthRequired(),
  };
});

function renderGate() {
  return render(
    <MemoryRouter initialEntries={["/curso"]}>
      <Routes>
        <Route
          path="/curso"
          element={
            <CourseAccessGate>
              <h1>Conteúdo protegido</h1>
            </CourseAccessGate>
          }
        />
        <Route path="/auth/sign-in" element={<h1>Tela de login</h1>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("CourseAccessGate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders children when auth is not required", () => {
    mockIsCourseAuthRequired.mockReturnValue(false);
    mockUseUser.mockReturnValue({ isLoaded: false, isSignedIn: false });

    renderGate();

    expect(screen.getByRole("heading", { name: "Conteúdo protegido" })).toBeInTheDocument();
  });

  it("shows loading state when auth is required and clerk is loading", () => {
    mockIsCourseAuthRequired.mockReturnValue(true);
    mockUseUser.mockReturnValue({ isLoaded: false, isSignedIn: false });

    renderGate();

    expect(screen.getByText(/carregando acesso do curso/i)).toBeInTheDocument();
  });

  it("redirects to sign-in when auth is required and user is signed out", () => {
    mockIsCourseAuthRequired.mockReturnValue(true);
    mockUseUser.mockReturnValue({ isLoaded: true, isSignedIn: false });

    renderGate();

    expect(screen.getByRole("heading", { name: /tela de login/i })).toBeInTheDocument();
  });

  it("renders children when auth is required and user is signed in", () => {
    mockIsCourseAuthRequired.mockReturnValue(true);
    mockUseUser.mockReturnValue({ isLoaded: true, isSignedIn: true });

    renderGate();

    expect(screen.getByRole("heading", { name: "Conteúdo protegido" })).toBeInTheDocument();
  });
});
