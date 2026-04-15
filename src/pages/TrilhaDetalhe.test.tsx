import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import TrilhaDetalhe from "./TrilhaDetalhe.tsx";

function renderTrilhaDetalhe() {
  return render(
    <MemoryRouter initialEntries={["/trilhas/seguranca-digital"]}>
      <Routes>
        <Route path="/trilhas/:slug" element={<TrilhaDetalhe />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("TrilhaDetalhe", () => {
  it("renderiza progresso real da trilha com base nos modulos concluídos", () => {
    localStorage.setItem(
      "mackseguro:user-data",
      JSON.stringify({
        moduleProgress: {
          "seguranca-digital:1": {
            completed: true,
            completedAt: "2026-04-14T12:00:00.000Z",
            quizScore: 3,
            quizTotal: 4,
          },
        },
        forumPosts: {},
      }),
    );

    renderTrilhaDetalhe();

    expect(screen.getByText(/20% concluído/i)).toBeInTheDocument();
  });
});
