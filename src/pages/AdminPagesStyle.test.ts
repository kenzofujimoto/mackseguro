import { describe, expect, it } from "vitest";
import adminTrailsPage from "./admin/AdminTrailsPage.tsx?raw";
import createTrailPage from "./admin/CreateTrailPage.tsx?raw";
import editModulePage from "./admin/EditModulePage.tsx?raw";
import editTrailPage from "./admin/EditTrailPage.tsx?raw";
import moduleContentPage from "./admin/ModuleContentPage.tsx?raw";
import moduleQuizPage from "./admin/ModuleQuizPage.tsx?raw";
import trailModulesPage from "./admin/TrailModulesPage.tsx?raw";

const adminPageSources = [
  ["AdminTrailsPage.tsx", adminTrailsPage],
  ["CreateTrailPage.tsx", createTrailPage],
  ["EditModulePage.tsx", editModulePage],
  ["EditTrailPage.tsx", editTrailPage],
  ["ModuleContentPage.tsx", moduleContentPage],
  ["ModuleQuizPage.tsx", moduleQuizPage],
  ["TrailModulesPage.tsx", trailModulesPage],
] as const;

describe("admin pages style rules", () => {
  it.each(adminPageSources)("%s does not use inline styles", (_, source) => {
    expect(source).not.toMatch(/\bstyle\s*=\s*\{/);
  });
});
