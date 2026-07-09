import type { SupabaseClient } from "@supabase/supabase-js";
import { conteudosModulos } from "../data/mock.ts";
import type { ConteudoModulo, Questao } from "../data/mock.ts";
import { getSupabaseClient, shouldReadFromSupabase } from "./supabaseConfig.ts";

type RemoteModuleContent = {
  id: number;
  module_id: number;
  video_url: string | null;
  texto: string | null;
};

type RemoteQuizQuestion = {
  id: number;
  question: string;
  position: number;
  quiz_options: {
    id: number;
    option_text: string;
    is_correct: boolean;
    position: number | null;
  }[];
};

function getMockContent(moduleId: number, trailSlug?: string): ConteudoModulo | null {
  return (
    conteudosModulos.find((item) =>
      item.moduloId === moduleId && (!trailSlug || item.trilhaSlug === trailSlug),
    ) ?? null
  );
}

function splitTextIntoParagraphs(text: string | null): string[] {
  return (text ?? "")
    .split("\n")
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

async function loadModuleQuestions(
  supabase: SupabaseClient,
  moduleId: number,
): Promise<Questao[]> {
  const { data, error } = await supabase
    .from("quiz_questions")
    .select(`
      id,
      question,
      position,
      quiz_options (
        id,
        option_text,
        is_correct,
        position
      )
    `)
    .eq("module_id", moduleId)
    .order("position", { ascending: true });

  if (error || !data) {
    return [];
  }

  return (data as RemoteQuizQuestion[]).map((question) => {
    const options = [...question.quiz_options].sort(
      (a, b) => (a.position ?? 0) - (b.position ?? 0),
    );

    return {
      id: question.id,
      pergunta: question.question,
      opcoes: options.map((option) => option.option_text),
      respostaCorreta: Math.max(
        0,
        options.findIndex((option) => option.is_correct),
      ),
    };
  });
}

export async function loadModuleContent(
  moduleId: number | string,
  trailSlug?: string,
): Promise<ConteudoModulo | null> {
  const normalizedModuleId = Number(moduleId);

  if (!Number.isFinite(normalizedModuleId)) {
    return null;
  }

  const mockFallback = getMockContent(normalizedModuleId, trailSlug);

  if (!shouldReadFromSupabase()) {
    return mockFallback;
  }

  const supabase = await getSupabaseClient();

  if (!supabase) {
    return mockFallback;
  }

  const { data, error } = await supabase
    .from("module_contents")
    .select("*")
    .eq("module_id", normalizedModuleId)
    .maybeSingle();

  const questions = await loadModuleQuestions(supabase, normalizedModuleId);

  if (error || !data) {
    if (mockFallback) {
      return {
        ...mockFallback,
        questoes: questions.length > 0 ? questions : mockFallback.questoes,
      };
    }

    return {
      trilhaSlug: trailSlug ?? "",
      moduloId: normalizedModuleId,
      videoTitulo: "Vídeo do módulo",
      videoDuracao: "",
      videoUrl: "",
      conteudo: [],
      questoes: questions,
      forum: [],
    };
  }

  const remoteContent = data as RemoteModuleContent;

  return {
    trilhaSlug: mockFallback?.trilhaSlug ?? trailSlug ?? "",
    moduloId: remoteContent.module_id,
    videoTitulo: mockFallback?.videoTitulo ?? "Vídeo do módulo",
    videoDuracao: mockFallback?.videoDuracao ?? "",
    videoUrl: remoteContent.video_url ?? "",
    conteudo: splitTextIntoParagraphs(remoteContent.texto),
    questoes: questions.length > 0 ? questions : mockFallback?.questoes ?? [],
    forum: mockFallback?.forum ?? [],
  };
}
