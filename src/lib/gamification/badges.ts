import { trilhas } from "../../data/mock";
import { fetchRemoteModuleProgress } from "../remotePersistence";

export type Badge = {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  isEarned: boolean;
};

export type UserGamification = {
  badges: Badge[];
  totalXp: number;
  completedTrails: typeof trilhas;
};

export async function fetchUserGamification(userId: string): Promise<UserGamification> {
  const remoteProgressRows = await fetchRemoteModuleProgress(userId);
  let totalXp = 0;
  let perfectQuizzes = 0;
  let completedTrailsCount = 0;
  const completedTrails: typeof trilhas = [];
  let hasAnyProgress = false;

  for (const trilha of trilhas) {
    let trailXp = 0;
    let completedModulesInTrail = 0;
    
    for (const mod of trilha.modulos) {
      const moduleState = remoteProgressRows.find(
        (row) => row.trail_slug === trilha.slug && row.module_id === mod.id
      );

      if (moduleState && moduleState.completed) {
        completedModulesInTrail++;
        hasAnyProgress = true;
        trailXp += (moduleState.quiz_score || 0) * 10;
        
        if (moduleState.quiz_score === moduleState.quiz_total && (moduleState.quiz_total || 0) > 0) {
          perfectQuizzes++;
        }
      }
    }
    
    totalXp += trailXp;
    
    if (trilha.modulos.length > 0 && completedModulesInTrail === trilha.modulos.length) {
      completedTrailsCount++;
      completedTrails.push(trilha);
    }
  }

  const badges: Badge[] = [
    {
      id: "first_step",
      title: "Primeiro Passo",
      description: "Iniciou sua jornada completando o primeiro módulo.",
      icon: "🌱",
      rarity: "common",
      isEarned: hasAnyProgress,
    },
    {
      id: "focused",
      title: "Foco Total",
      description: "Completou 100% de uma trilha de conhecimento.",
      icon: "🎯",
      rarity: "rare",
      isEarned: completedTrailsCount >= 1,
    },
    {
      id: "quiz_genius",
      title: "Gabarito",
      description: "Acertou 100% das questões em um quiz.",
      icon: "🧠",
      rarity: "epic",
      isEarned: perfectQuizzes >= 1,
    },
    {
      id: "cyber_expert",
      title: "Especialista Digital",
      description: "Completou todas as trilhas disponíveis na plataforma.",
      icon: "🛡️",
      rarity: "legendary",
      isEarned: completedTrailsCount === trilhas.length && trilhas.length > 0,
    }
  ];

  return {
    badges,
    totalXp,
    completedTrails,
  };
}
