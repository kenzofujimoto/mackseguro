import { beforeEach, describe, expect, it, vi } from "vitest";
import { loadModuleContent } from "./moduleContentRemote.ts";
import { loadTrails } from "./trailsRemote.ts";

const supabaseConfigMocks = vi.hoisted(() => ({
  getSupabaseClient: vi.fn(),
  shouldReadFromSupabase: vi.fn(),
}));

vi.mock("./supabaseConfig.ts", () => ({
  getSupabaseClient: supabaseConfigMocks.getSupabaseClient,
  shouldReadFromSupabase: supabaseConfigMocks.shouldReadFromSupabase,
  supabase: null,
}));

describe("remote content loaders", () => {
  beforeEach(() => {
    supabaseConfigMocks.getSupabaseClient.mockReset();
    supabaseConfigMocks.shouldReadFromSupabase.mockReset();
    supabaseConfigMocks.shouldReadFromSupabase.mockReturnValue(true);
  });

  it("loads trails through the async Supabase client before falling back", async () => {
    supabaseConfigMocks.getSupabaseClient.mockResolvedValue(null);

    const trails = await loadTrails();

    expect(supabaseConfigMocks.getSupabaseClient).toHaveBeenCalledOnce();
    expect(trails.length).toBeGreaterThan(0);
  });

  it("loads module content through the async Supabase client before falling back", async () => {
    supabaseConfigMocks.getSupabaseClient.mockResolvedValue(null);

    const content = await loadModuleContent("1");

    expect(supabaseConfigMocks.getSupabaseClient).toHaveBeenCalledOnce();
    expect(content).not.toBeNull();
  });
});
