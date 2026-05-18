import { conteudosModulos } from "../data/mock.ts";
import { supabase, shouldReadFromSupabase } from "./supabaseConfig.ts";

type RemoteModuleContent = {
  id: string;
  module_id: string;
  video_url: string | null;
  texto: string | null;
};

type RemoteQuizQuestion = {
  id: string;
  question: string;
  position: number;
  quiz_options: {
    id: string;
    option_text: string;
    is_correct: boolean;
  }[];
};

function getMockContent(moduleId: string) {
  return conteudosModulos.find((item) => item.moduloId === moduleId) || null;
}

async function loadModuleQuestions(moduleId: string) {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("quiz_questions")
    .select(`
      id,
      question,
      position,
      quiz_options (
        id,
        option_text,
        is_correct
      )
    `)
    .eq("module_id", moduleId)
    .order("position", { ascending: true });

  if (error || !data) {
    return [];
  }

    return (data as RemoteQuizQuestion[]).map((question) => ({
    id: question.id,
    pergunta: question.question,
    opcoes: question.quiz_options.map((option) => option.option_text),
    respostaCorreta: question.quiz_options.findIndex((option) => option.is_correct),
    }));
}

export async function loadModuleContent(moduleId: string) {
  if (!supabase || !shouldReadFromSupabase()) {
    return getMockContent(moduleId);
  }

  const mockFallback = getMockContent(moduleId);

  const { data, error } = await supabase
    .from("module_contents")
    .select("*")
    .eq("module_id", moduleId)
    .maybeSingle();

  const questoes = await loadModuleQuestions(moduleId);

  if (error) {
    if (mockFallback) {
      return {
        ...mockFallback,
        questoes: mockFallback.questoes || [],
      };
    }

    return {
      moduloId: moduleId,
      videoUrl: "",
      texto: "",
      questoes,
    };
  }

  if (!data) {
    if (mockFallback) {
      return {
        ...mockFallback,
        questoes: mockFallback.questoes || questoes,
      };
    }

    return {
      moduloId: moduleId,
      videoUrl: "",
      texto: "",
      questoes,
    };
  }

  const remoteContent = data as RemoteModuleContent;

  return {
    moduloId: remoteContent.module_id,
    videoUrl: remoteContent.video_url || "",
    texto: remoteContent.texto || "",
    questoes,
  };
}