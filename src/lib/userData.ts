import type { PostForum, Trilha } from "../data/mock.ts";
import {
  queueRemoteForumCommentSync,
  queueRemoteForumLikeSync,
  queueRemoteForumModuleBackfillSync,
  queueRemoteForumReportSync,
  queueRemoteModuleProgressSync,
  fetchRemoteModuleProgress,
} from "./remotePersistence.ts";

export interface PersistedModuleProgress {
  completed: boolean;
  completedAt: string;
  quizScore: number;
  quizTotal: number;
}

export interface ForumCommentReport {
  id: string;
  userId: string;
  reason: string;
  createdAt: string;
}

export interface ForumComment {
  id: string;
  parentId: string | null;
  authorId: string;
  authorName: string;
  authorInitials: string;
  createdAt: string;
  content: string;
  likeUserIds: string[];
  reports: ForumCommentReport[];
  legacyReplyCount: number;
}

interface UserDataState {
  moduleProgress: Record<string, PersistedModuleProgress>;
  forumPosts: Record<string, PostForum[]>;
  forumComments: Record<string, ForumComment[]>;
}

export const FORUM_REPORT_HIDE_THRESHOLD = 3;

const USER_DATA_KEY = "mackseguro:user-data";
const USER_DATA_EVENT = "mackseguro:user-data-updated";
const REMOTE_FORUM_BACKFILL_MODULES = new Set<string>();

function defaultState(): UserDataState {
  return {
    moduleProgress: {},
    forumPosts: {},
    forumComments: {},
  };
}

function moduleKey(slug: string, moduloId: number): string {
  return `${slug}:${moduloId}`;
}

function queueForumBackfillOnce(
  slug: string,
  moduloId: number,
  comments: ForumComment[],
): void {
  const key = moduleKey(slug, moduloId);

  if (comments.length === 0 || REMOTE_FORUM_BACKFILL_MODULES.has(key)) {
    return;
  }

  REMOTE_FORUM_BACKFILL_MODULES.add(key);

  queueRemoteForumModuleBackfillSync({
    slug,
    moduloId,
    comments,
  });
}

function createId(prefix = "id"): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function getInitials(name: string): string {
  const tokens = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (tokens.length === 0) {
    return "VC";
  }

  return tokens.map((token) => token[0]!.toUpperCase()).join("");
}

function normalizeUserNameForMatch(name: string): string {
  return name.trim().replace(/\s+/g, " ").toLocaleLowerCase("pt-BR");
}

function isClaimableAnonymousAuthor(authorId: string): boolean {
  return authorId === "local-anonymous" || authorId.startsWith("legacy-");
}

export function sanitizeUserName(name: string): string {
  const normalizedName = name.trim().replace(/\s+/g, " ");
  return normalizedName.length > 0 ? normalizedName : "Aluno";
}

export function isForumCommentHidden(comment: ForumComment): boolean {
  return comment.reports.length >= FORUM_REPORT_HIDE_THRESHOLD;
}

function migrateLegacyForumPosts(
  legacyForumPosts: Record<string, PostForum[]>,
): Record<string, ForumComment[]> {
  const migrated: Record<string, ForumComment[]> = {};

  Object.entries(legacyForumPosts).forEach(([key, posts]) => {
    migrated[key] = posts.map((post) => ({
      id: `legacy-${post.id}`,
      parentId: null,
      authorId: `legacy-${post.id}`,
      authorName: post.autor,
      authorInitials: post.iniciais,
      createdAt: post.data,
      content: post.conteudo,
      likeUserIds: [],
      reports: [],
      legacyReplyCount: post.respostas,
    }));
  });

  return migrated;
}

function readState(): UserDataState {
  if (typeof window === "undefined") {
    return defaultState();
  }

  const raw = localStorage.getItem(USER_DATA_KEY);
  if (!raw) {
    return defaultState();
  }

  try {
    const parsed = JSON.parse(raw) as Partial<UserDataState>;
    const forumPosts = parsed.forumPosts ?? {};
    const forumComments =
      parsed.forumComments ?? migrateLegacyForumPosts(forumPosts);

    return {
      moduleProgress: parsed.moduleProgress ?? {},
      forumPosts,
      forumComments,
    };
  } catch {
    return defaultState();
  }
}

function writeState(state: UserDataState): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(USER_DATA_KEY, JSON.stringify(state));
  window.dispatchEvent(new Event(USER_DATA_EVENT));
}

export function subscribeToUserDataChanges(onChange: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handler = () => onChange();
  window.addEventListener("storage", handler);
  window.addEventListener(USER_DATA_EVENT, handler);

  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(USER_DATA_EVENT, handler);
  };
}

export function getModuleProgress(slug: string, moduloId: number): PersistedModuleProgress | null {
  const state = readState();
  return state.moduleProgress[moduleKey(slug, moduloId)] ?? null;
}

export function isModuleCompleted(slug: string, moduloId: number): boolean {
  return Boolean(getModuleProgress(slug, moduloId)?.completed);
}

export function markModuleCompleted(
  slug: string,
  moduloId: number,
  quizScore: number,
  quizTotal: number,
  userId?: string,
): void {
  const state = readState();
  const progress = {
    completed: true,
    completedAt: new Date().toISOString(),
    quizScore,
    quizTotal,
  };

  state.moduleProgress[moduleKey(slug, moduloId)] = progress;
  writeState(state);

  queueRemoteModuleProgressSync({
    userId: userId ?? "",
    slug,
    moduloId,
    completed: progress.completed,
    completedAt: progress.completedAt,
    quizScore: progress.quizScore,
    quizTotal: progress.quizTotal,
  });
}

export async function syncRemoteProgressToLocal(userId: string): Promise<void> {
  const normalizedUserId = userId.trim();
  if (!normalizedUserId) return;

  const rows = await fetchRemoteModuleProgress(normalizedUserId);
  if (!rows) return; // Se rows for falsy (por ex. sem config de DB), abortamos

  const state = readState();
  let updatedLocal = false;

  const remoteKeys = new Set<string>();

  for (const row of rows) {
    if (!row.trail_slug || typeof row.module_id !== "number") continue;
    const key = moduleKey(row.trail_slug, row.module_id);
    remoteKeys.add(key);
    
    if (row.completed) {
      const local = state.moduleProgress[key];
      // Atualiza o progresso local se estiver ausente ou desatualizado
      if (!local || !local.completed || local.quizScore !== row.quiz_score) {
        state.moduleProgress[key] = {
          completed: row.completed,
          completedAt: row.completed_at || new Date().toISOString(),
          quizScore: row.quiz_score || 0,
          quizTotal: row.quiz_total || 0,
        };
        updatedLocal = true;
      }
    }
  }

  if (updatedLocal) {
    writeState(state);
  }

  // AGORA a segunda etapa: enviar qualquer progresso local antigo/preso p/ o servidor:
  for (const [key, progress] of Object.entries(state.moduleProgress)) {
    if (progress.completed && !remoteKeys.has(key)) {
      const [slug, moduloIdStr] = key.split(":");
      const moduloId = Number(moduloIdStr);
      if (slug && !isNaN(moduloId)) {
        queueRemoteModuleProgressSync({
          userId: normalizedUserId,
          slug,
          moduloId,
          completed: progress.completed,
          completedAt: progress.completedAt,
          quizScore: progress.quizScore,
          quizTotal: progress.quizTotal,
        });
      }
    }
  }
}

export function getTrailProgress(slug: string, totalModules: number): {
  completedModules: number;
  totalModules: number;
  percentage: number;
} {
  const state = readState();
  const completedModules = Object.entries(state.moduleProgress).reduce((total, [key, value]) => {
    if (key.startsWith(`${slug}:`) && value.completed) {
      return total + 1;
    }

    return total;
  }, 0);

  if (totalModules === 0) {
    return { completedModules, totalModules, percentage: 0 };
  }

  return {
    completedModules,
    totalModules,
    percentage: Math.round((completedModules / totalModules) * 100),
  };
}

export function getTrailEarnedXp(trilha: Trilha): number {
  return trilha.modulos.reduce((xp, modulo) => {
    if (isModuleCompleted(trilha.slug, modulo.id)) {
      return xp + modulo.xp;
    }

    return xp;
  }, 0);
}

export function getForumComments(
  slug: string,
  moduloId: number,
  seedPosts: PostForum[] = [],
): ForumComment[] {
  const state = readState();
  const key = moduleKey(slug, moduloId);
  const storedComments = state.forumComments[key] ?? [];

  if (storedComments.length > 0 || seedPosts.length === 0) {
    queueForumBackfillOnce(slug, moduloId, storedComments);
    return storedComments;
  }

  const seededComments: ForumComment[] = seedPosts.map((post) => ({
    id: `seed-${post.id}`,
    parentId: null,
    authorId: `seed-${post.id}`,
    authorName: post.autor,
    authorInitials: post.iniciais,
    createdAt: post.data,
    content: post.conteudo,
    likeUserIds: [],
    reports: [],
    legacyReplyCount: post.respostas,
  }));

  state.forumComments[key] = seededComments;
  writeState(state);

  queueForumBackfillOnce(slug, moduloId, seededComments);

  return seededComments;
}

export function addForumComment(input: {
  slug: string;
  moduloId: number;
  parentId?: string | null;
  userId: string;
  authorName: string;
  content: string;
}): ForumComment {
  const state = readState();
  const key = moduleKey(input.slug, input.moduloId);
  const trimmedAuthor = sanitizeUserName(input.authorName);
  const trimmedContent = input.content.trim();

  const comment: ForumComment = {
    id: createId("comment"),
    parentId: input.parentId ?? null,
    authorId: input.userId,
    authorName: trimmedAuthor,
    authorInitials: getInitials(trimmedAuthor),
    createdAt: new Date().toISOString(),
    content: trimmedContent,
    likeUserIds: [],
    reports: [],
    legacyReplyCount: 0,
  };

  const previousComments = state.forumComments[key] ?? [];
  state.forumComments[key] = [comment, ...previousComments];
  writeState(state);

  queueRemoteForumCommentSync({
    id: comment.id,
    slug: input.slug,
    moduloId: input.moduloId,
    parentId: comment.parentId,
    authorId: comment.authorId,
    authorName: comment.authorName,
    authorInitials: comment.authorInitials,
    content: comment.content,
    createdAt: comment.createdAt,
    legacyReplyCount: comment.legacyReplyCount,
  });

  return comment;
}

export function migrateAnonymousPosts(userId: string, userName: string): number {
  const normalizedUserId = userId.trim();
  if (!normalizedUserId) {
    return 0;
  }

  const sanitizedUserName = sanitizeUserName(userName);
  const normalizedUserName = normalizeUserNameForMatch(sanitizedUserName);
  const state = readState();
  let migratedCount = 0;

  const nextForumComments: Record<string, ForumComment[]> = {};

  Object.entries(state.forumComments).forEach(([key, comments]) => {
    nextForumComments[key] = comments.map((comment) => {
      if (!isClaimableAnonymousAuthor(comment.authorId)) {
        return comment;
      }

      if (normalizeUserNameForMatch(comment.authorName) !== normalizedUserName) {
        return comment;
      }

      migratedCount += 1;

      return {
        ...comment,
        authorId: normalizedUserId,
        authorName: sanitizedUserName,
        authorInitials: getInitials(sanitizedUserName),
      };
    });
  });

  if (migratedCount === 0) {
    return 0;
  }

  state.forumComments = nextForumComments;
  writeState(state);

  return migratedCount;
}

export function toggleForumCommentLike(
  slug: string,
  moduloId: number,
  commentId: string,
  userId: string,
): ForumComment | null {
  const state = readState();
  const key = moduleKey(slug, moduloId);
  const comments = state.forumComments[key] ?? [];
  const index = comments.findIndex((comment) => comment.id === commentId);

  if (index < 0) {
    return null;
  }

  const target = comments[index];
  const alreadyLiked = target.likeUserIds.includes(userId);
  const nextLikeUserIds = alreadyLiked
    ? target.likeUserIds.filter((id) => id !== userId)
    : [...target.likeUserIds, userId];

  const updatedComment: ForumComment = {
    ...target,
    likeUserIds: nextLikeUserIds,
  };

  comments[index] = updatedComment;
  state.forumComments[key] = comments;
  writeState(state);

  queueRemoteForumLikeSync({
    commentId: updatedComment.id,
    userId,
    liked: updatedComment.likeUserIds.includes(userId),
  });

  return updatedComment;
}

export function reportForumComment(
  slug: string,
  moduloId: number,
  commentId: string,
  userId: string,
  reason: string,
): boolean {
  const state = readState();
  const key = moduleKey(slug, moduloId);
  const comments = state.forumComments[key] ?? [];
  const index = comments.findIndex((comment) => comment.id === commentId);

  if (index < 0) {
    return false;
  }

  const target = comments[index];
  const alreadyReported = target.reports.some((report) => report.userId === userId);

  if (alreadyReported) {
    return false;
  }

  const updatedComment: ForumComment = {
    ...target,
    reports: [
      {
        id: createId("report"),
        userId,
        reason,
        createdAt: new Date().toISOString(),
      },
      ...target.reports,
    ],
  };

  comments[index] = updatedComment;
  state.forumComments[key] = comments;
  writeState(state);

  queueRemoteForumReportSync({
    commentId,
    userId,
    reason,
  });

  return true;
}

export function getForumPosts(slug: string, moduloId: number): PostForum[] {
  return getForumComments(slug, moduloId)
    .filter((comment) => comment.parentId === null)
    .map((comment) => ({
      id: Number(comment.id.replace(/\D/g, "").slice(-8)) || Date.now(),
      autor: comment.authorName,
      iniciais: comment.authorInitials,
      data: comment.createdAt,
      conteudo: comment.content,
      respostas: comment.legacyReplyCount,
    }));
}

export function addForumPost(slug: string, moduloId: number, author: string, content: string): PostForum {
  const comment = addForumComment({
    slug,
    moduloId,
    userId: "local-anonymous",
    authorName: author,
    content,
  });

  return {
    id: Number(comment.id.replace(/\D/g, "").slice(-8)) || Date.now(),
    autor: comment.authorName,
    iniciais: comment.authorInitials,
    data: comment.createdAt,
    conteudo: comment.content,
    respostas: 0,
  };
}
