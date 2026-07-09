import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Eventos from "./Eventos.tsx";

describe("Eventos", () => {
  it("renders ticket cards without inline styles", () => {
    const { container } = render(<Eventos />);

    expect(
      screen.getByRole("heading", {
        name: /eventos e workshops para aprender em comunidade/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/entrada gratuita/i)).toBeInTheDocument();
    expect(container.querySelector("[style]")).toBeNull();
  });
});
