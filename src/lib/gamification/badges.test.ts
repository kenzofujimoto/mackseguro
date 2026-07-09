import { describe, expect, it, vi } from "vitest";
import { fetchRemoteModuleProgress } from "../remotePersistence";
import { fetchUserGamification } from "./badges";

vi.mock("../../data/mock", () => ({
  trilhas: [
    {
      id: 1,
      slug: "seguranca-digital",
      titulo: "Seguranca Digital",
      descricaoCurta: "",
      descricaoLonga: "",
      icone: "ShieldCheck",
      cor: "blue",
      totalXp: 150,
      modulos: [
        { id: 1, titulo: "Modulo 1", descricao: "", duracao: "", xp: 120 },
        { id: 2, titulo: "Modulo 2", descricao: "", duracao: "", xp: 30 },
      ],
    },
  ],
}));

vi.mock("../remotePersistence", () => ({
  fetchRemoteModuleProgress: vi.fn(),
}));

describe("fetchUserGamification", () => {
  it("calculates XP using each module configured weight", async () => {
    vi.mocked(fetchRemoteModuleProgress).mockResolvedValue([
      {
        user_id: "user_test",
        trail_slug: "seguranca-digital",
        module_id: 1,
        completed: true,
        completed_at: "2026-04-14T12:00:00.000Z",
        quiz_score: 1,
        quiz_total: 2,
      },
      {
        user_id: "user_test",
        trail_slug: "seguranca-digital",
        module_id: 2,
        completed: true,
        completed_at: "2026-04-14T12:00:00.000Z",
        quiz_score: 2,
        quiz_total: 3,
      },
    ]);

    const gamification = await fetchUserGamification("user_test");

    expect(gamification.totalXp).toBe(80);
  });
});
