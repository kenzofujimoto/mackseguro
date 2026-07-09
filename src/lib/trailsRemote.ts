import { corMap, trilhas as mockTrilhas } from "../data/mock.ts";
import type { CorKey, Modulo, Trilha } from "../data/mock.ts";
import { getSupabaseClient, shouldReadFromSupabase } from "./supabaseConfig.ts";

const DEFAULT_TRAIL_COLOR: CorKey = "red";

type RemoteTrail = {
  id: number;
  title: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  icon: string | null;
  theme_color: string | null;
  published: boolean;
  created_at: string;
};

type RemoteModule = {
  id: number;
  trail_id: number;
  title: string;
  description: string | null;
  xp: number | null;
  duration_minutes: number | null;
  position: number | null;
};

function normalizeTrailColor(value: string | null): CorKey {
  if (value && value in corMap) {
    return value as CorKey;
  }

  return DEFAULT_TRAIL_COLOR;
}

function toModule(module: RemoteModule): Modulo {
  const durationMinutes = module.duration_minutes ?? 0;

  return {
    id: module.id,
    titulo: module.title,
    descricao: module.description ?? "",
    duracao: durationMinutes > 0 ? `${durationMinutes} min` : "0 min",
    xp: module.xp ?? 0,
  };
}

function toTrail(trail: RemoteTrail, modules: RemoteModule[]): Trilha {
  const trailModules = modules.map(toModule);

  return {
    id: trail.id,
    slug: trail.slug,
    titulo: trail.title,
    descricaoCurta: trail.short_description ?? "",
    descricaoLonga: trail.description ?? trail.short_description ?? "",
    icone: trail.icon ?? "ShieldCheck",
    cor: normalizeTrailColor(trail.theme_color),
    totalXp: trailModules.reduce((total, module) => total + module.xp, 0),
    modulos: trailModules,
  };
}

export async function loadTrails(): Promise<Trilha[]> {
  if (!shouldReadFromSupabase()) {
    return mockTrilhas;
  }

  const supabase = await getSupabaseClient();

  if (!supabase) {
    return mockTrilhas;
  }

  const { data: trails, error: trailsError } = await supabase
    .from("trails")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (trailsError || !trails || trails.length === 0) {
    return mockTrilhas;
  }

  const { data: modules, error: modulesError } = await supabase
    .from("modules")
    .select("*")
    .order("position", { ascending: true });

  if (modulesError) {
    return mockTrilhas;
  }

  const modulesByTrail = new Map<number, RemoteModule[]>();

  for (const module of (modules ?? []) as RemoteModule[]) {
    const current = modulesByTrail.get(module.trail_id) ?? [];
    current.push(module);
    modulesByTrail.set(module.trail_id, current);
  }

  return ((trails ?? []) as RemoteTrail[]).map((trail) =>
    toTrail(trail, modulesByTrail.get(trail.id) ?? []),
  );
}

export async function loadTrailBySlug(slug: string): Promise<Trilha | null> {
  const trails = await loadTrails();
  return trails.find((trail) => trail.slug === slug) ?? null;
}
