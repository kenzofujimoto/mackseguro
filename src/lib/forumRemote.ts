import type { SupabaseClient } from "@supabase/supabase-js";
import type { ForumComment } from "./userData.ts";
import { getSupabaseClient, shouldReadFromSupabase } from "./supabaseConfig.ts";

interface ForumCommentRow {
  id: string;
  parent_id: string | null;
  author_id: string;
  author_name: string;
  author_initials: string;
  content: string;
  created_at: string;
  legacy_reply_count: number | null;
}

interface ForumLikeRow {
  comment_id: string;
  user_id: string;
}

interface ForumReportRow {
  comment_id: string;
  user_id: string;
  reason: string;
  created_at: string;
}

interface AddRemoteForumCommentInput {
  slug: string;
  moduloId: number;
  parentId: string | null;
  userId: string;
  authorName: string;
  content: string;
}

interface ToggleRemoteForumLikeInput {
  commentId: string;
  userId: string;
  liked: boolean;
}

interface ReportRemoteForumCommentInput {
  commentId: string;
  userId: string;
  reason: string;
}

export type RemoteForumReportResult = "created" | "already-reported";

function normalizeUserName(name: string): string {
  const value = name.trim().replace(/\s+/g, " ");
  return value.length > 0 ? value : "Aluno";
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

function createCommentId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `comment-${crypto.randomUUID()}`;
  }

  return `comment-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function getRemoteForumClient(): SupabaseClient | null {
  if (import.meta.env.MODE === "test") {
    return null;
  }

  if (!shouldReadFromSupabase()) {
    return null;
  }

  return getSupabaseClient();
}

export function canReadForumFromRemote(): boolean {
  return getRemoteForumClient() !== null;
}

export async function fetchRemoteForumComments(
  slug: string,
  moduloId: number,
): Promise<ForumComment[] | null> {
  const client = getRemoteForumClient();
  if (!client) {
    return null;
  }

  const { data: commentsData, error: commentsError } = await client
    .from("forum_comments")
    .select(
      "id,parent_id,author_id,author_name,author_initials,content,created_at,legacy_reply_count",
    )
    .eq("trail_slug", slug)
    .eq("module_id", moduloId)
    .order("created_at", { ascending: false });

  if (commentsError) {
    throw commentsError;
  }

  const comments = (commentsData ?? []) as ForumCommentRow[];
  if (comments.length === 0) {
    return [];
  }

  const commentIds = comments.map((comment) => comment.id);

  const [{ data: likesData, error: likesError }, { data: reportsData, error: reportsError }] =
    await Promise.all([
      client
        .from("forum_comment_likes")
        .select("comment_id,user_id")
        .in("comment_id", commentIds),
      client
        .from("forum_comment_reports")
        .select("comment_id,user_id,reason,created_at")
        .in("comment_id", commentIds),
    ]);

  if (likesError) {
    throw likesError;
  }

  if (reportsError) {
    throw reportsError;
  }

  const likeRows = (likesData ?? []) as ForumLikeRow[];
  const reportRows = (reportsData ?? []) as ForumReportRow[];

  const likeMap = new Map<string, string[]>();
  likeRows.forEach((row) => {
    const bucket = likeMap.get(row.comment_id) ?? [];
    bucket.push(row.user_id);
    likeMap.set(row.comment_id, bucket);
  });

  const reportMap = new Map<string, ForumComment["reports"]>();
  reportRows.forEach((row) => {
    const bucket = reportMap.get(row.comment_id) ?? [];
    bucket.push({
      id: `report-${row.comment_id}-${row.user_id}`,
      userId: row.user_id,
      reason: row.reason,
      createdAt: row.created_at,
    });
    reportMap.set(row.comment_id, bucket);
  });

  return comments.map((comment) => ({
    id: comment.id,
    parentId: comment.parent_id,
    authorId: comment.author_id,
    authorName: comment.author_name,
    authorInitials: comment.author_initials,
    createdAt: comment.created_at,
    content: comment.content,
    likeUserIds: likeMap.get(comment.id) ?? [],
    reports: reportMap.get(comment.id) ?? [],
    legacyReplyCount: comment.legacy_reply_count ?? 0,
  }));
}

export async function addRemoteForumComment(
  input: AddRemoteForumCommentInput,
): Promise<void> {
  const client = getRemoteForumClient();
  if (!client) {
    throw new Error("Remote forum is not configured");
  }

  const userId = input.userId.trim();
  if (!userId) {
    throw new Error("User id is required");
  }

  const content = input.content.trim();
  if (!content) {
    return;
  }

  const authorName = normalizeUserName(input.authorName);

  const { error } = await client.from("forum_comments").insert({
    id: createCommentId(),
    trail_slug: input.slug,
    module_id: input.moduloId,
    parent_id: input.parentId,
    author_id: userId,
    author_name: authorName,
    author_initials: getInitials(authorName),
    content,
    created_at: new Date().toISOString(),
    legacy_reply_count: 0,
  });

  if (error) {
    throw error;
  }
}

export async function toggleRemoteForumLike(
  input: ToggleRemoteForumLikeInput,
): Promise<void> {
  const client = getRemoteForumClient();
  if (!client) {
    throw new Error("Remote forum is not configured");
  }

  const userId = input.userId.trim();
  if (!userId) {
    throw new Error("User id is required");
  }

  if (input.liked) {
    const { error } = await client.from("forum_comment_likes").upsert(
      {
        comment_id: input.commentId,
        user_id: userId,
      },
      {
        onConflict: "comment_id,user_id",
      },
    );

    if (error) {
      throw error;
    }

    return;
  }

  const { error } = await client
    .from("forum_comment_likes")
    .delete()
    .eq("comment_id", input.commentId)
    .eq("user_id", userId);

  if (error) {
    throw error;
  }
}

export async function reportRemoteForumComment(
  input: ReportRemoteForumCommentInput,
): Promise<RemoteForumReportResult> {
  const client = getRemoteForumClient();
  if (!client) {
    throw new Error("Remote forum is not configured");
  }

  const userId = input.userId.trim();
  if (!userId) {
    throw new Error("User id is required");
  }

  const { error } = await client.from("forum_comment_reports").insert({
    comment_id: input.commentId,
    user_id: userId,
    reason: input.reason,
    created_at: new Date().toISOString(),
  });

  if (error) {
    if (error.code === "23505") {
      return "already-reported";
    }

    throw error;
  }

  return "created";
}
