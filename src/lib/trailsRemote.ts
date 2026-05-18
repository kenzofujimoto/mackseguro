import { trilhas as mockTrilhas } from "../data/mock.ts";
import { supabase, shouldReadFromSupabase } from "./supabaseConfig.ts";

type RemoteTrail = {
  id: string;
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
  id: string;
  trail_id: string;
  title: string;
  description: string | null;
  xp: number;
  duration_minutes: number;
  position: number;
};

export async function loadTrails() {
  if (!supabase || !shouldReadFromSupabase()) {
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

  const modulesByTrail = new Map<string, RemoteModule[]>();

  for (const module of modules || []) {
    const current = modulesByTrail.get(module.trail_id) || [];
    current.push(module);
    modulesByTrail.set(module.trail_id, current);
  }

  return trails.map((trail: RemoteTrail) => {
    const trailModules = modulesByTrail.get(trail.id) || [];

    return {
      id: trail.id,
      slug: trail.slug,
      titulo: trail.title,
      descricaoCurta: trail.short_description || "",
      descricaoLonga: trail.description || trail.short_description || "",
      icone: trail.icon || "📚",
      cor: "red",
      totalXp: trailModules.reduce((total, module) => total + (module.xp || 0), 0),
      modulos: trailModules.map((module) => ({
        id: module.id,
        titulo: module.title,
        descricao: module.description || "",
        duracaoMin: module.duration_minutes || 0,
        xp: module.xp || 0,
        conteudo: {
          videoUrl: "",
          texto: "",
        },
        quiz: [],
      })),
    };
  });
}

export async function loadTrailBySlug(slug: string) {
  const trails = await loadTrails();
  return trails.find((trail) => trail.slug === slug) || null;
}