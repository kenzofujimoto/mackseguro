import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import AuthSignIn from "./AuthSignIn.tsx";
import AuthSignUp from "./AuthSignUp.tsx";

vi.mock("@clerk/react", () => ({
  SignIn: () => <div data-testid="clerk-signin" />,
  SignUp: () => <div data-testid="clerk-signup" />,
}));

describe("Auth pages", () => {
  it("renders sign-in page with clerk component", () => {
    render(<AuthSignIn />);

    expect(screen.getByRole("heading", { name: /entrar na plataforma/i })).toBeInTheDocument();
    expect(screen.getByTestId("clerk-signin")).toBeInTheDocument();
  });

  it("renders sign-up page with clerk component", () => {
    render(<AuthSignUp />);

    expect(screen.getByRole("heading", { name: /criar conta/i })).toBeInTheDocument();
    expect(screen.getByTestId("clerk-signup")).toBeInTheDocument();
  });
});
