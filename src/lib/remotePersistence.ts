import { getSupabaseClient, shouldSyncToSupabase } from "./supabaseConfig.ts";

interface RemoteModuleProgressInput {
  userId: string;
  slug: string;
  moduloId: number;
  completed: boolean;
  completedAt: string;
  quizScore: number;
  quizTotal: number;
}

interface RemoteForumCommentInput {
  id: string;
  slug: string;
  moduloId: number;
  parentId: string | null;
  authorId: string;
  authorName: string;
  authorInitials: string;
  content: string;
  createdAt: string;
  legacyReplyCount: number;
}

interface RemoteForumBackfillReport {
  userId: string;
  reason: string;
  createdAt: string;
}

interface RemoteForumBackfillComment {
  id: string;
  parentId: string | null;
  authorId: string;
  authorName: string;
  authorInitials: string;
  content: string;
  createdAt: string;
  legacyReplyCount: number;
  likeUserIds: string[];
  reports: RemoteForumBackfillReport[];
}

function runRemoteWrite(
  operation: string,
  writer: () => Promise<void>,
): void {
  if (import.meta.env.MODE === "test") {
    return;
  }

  if (!shouldSyncToSupabase()) {
    return;
  }

  const client = getSupabaseClient();
  if (!client) {
    return;
  }

  void writer().catch((error) => {
    console.error(`[remotePersistence] ${operation} failed`, error);
  });
}

export function queueRemoteModuleProgressSync(
  input: RemoteModuleProgressInput,
): void {
  const normalizedUserId = input.userId.trim();
  if (!normalizedUserId) {
    return;
  }

  runRemoteWrite("module_progress_upsert", async () => {
    const client = getSupabaseClient();
    if (!client) {
      return;
    }

    const { error } = await client.from("module_progress").upsert(
      {
        user_id: normalizedUserId,
        trail_slug: input.slug,
        module_id: input.moduloId,
        completed: input.completed,
        completed_at: input.completedAt,
        quiz_score: input.quizScore,
        quiz_total: input.quizTotal,
      },
      {
        onConflict: "user_id,trail_slug,module_id",
      },
    );

    if (error) {
      throw error;
    }
  });
}

export function queueRemoteForumCommentSync(
  input: RemoteForumCommentInput,
): void {
  runRemoteWrite("forum_comment_insert", async () => {
    const client = getSupabaseClient();
    if (!client) {
      return;
    }

    const { error } = await client.from("forum_comments").upsert(
      {
        id: input.id,
        trail_slug: input.slug,
        module_id: input.moduloId,
        parent_id: input.parentId,
        author_id: input.authorId,
        author_name: input.authorName,
        author_initials: input.authorInitials,
        content: input.content,
        created_at: input.createdAt,
        legacy_reply_count: input.legacyReplyCount,
      },
      {
        onConflict: "id",
      },
    );

    if (error) {
      throw error;
    }
  });
}

export function queueRemoteForumLikeSync(input: {
  commentId: string;
  userId: string;
  liked: boolean;
}): void {
  const normalizedUserId = input.userId.trim();
  if (!normalizedUserId) {
    return;
  }

  runRemoteWrite("forum_like_sync", async () => {
    const client = getSupabaseClient();
    if (!client) {
      return;
    }

    if (input.liked) {
      const { error } = await client.from("forum_comment_likes").upsert(
        {
          comment_id: input.commentId,
          user_id: normalizedUserId,
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
      .eq("user_id", normalizedUserId);

    if (error) {
      throw error;
    }
  });
}

export function queueRemoteForumReportSync(input: {
  commentId: string;
  userId: string;
  reason: string;
}): void {
  const normalizedUserId = input.userId.trim();
  if (!normalizedUserId) {
    return;
  }

  runRemoteWrite("forum_report_insert", async () => {
    const client = getSupabaseClient();
    if (!client) {
      return;
    }

    const { error } = await client.from("forum_comment_reports").upsert(
      {
        comment_id: input.commentId,
        user_id: normalizedUserId,
        reason: input.reason,
      },
      {
        onConflict: "comment_id,user_id",
      },
    );

    if (error) {
      throw error;
    }
  });
}

export function queueRemoteForumModuleBackfillSync(input: {
  slug: string;
  moduloId: number;
  comments: RemoteForumBackfillComment[];
}): void {
  if (input.comments.length === 0) {
    return;
  }

  runRemoteWrite("forum_module_backfill", async () => {
    const client = getSupabaseClient();
    if (!client) {
      return;
    }

    const forumRows = input.comments.map((comment) => ({
      id: comment.id,
      trail_slug: input.slug,
      module_id: input.moduloId,
      parent_id: comment.parentId,
      author_id: comment.authorId,
      author_name: comment.authorName,
      author_initials: comment.authorInitials,
      content: comment.content,
      created_at: comment.createdAt,
      legacy_reply_count: comment.legacyReplyCount,
    }));

    const { error: forumError } = await client.from("forum_comments").upsert(
      forumRows,
      {
        onConflict: "id",
      },
    );

    if (forumError) {
      throw forumError;
    }

    const likeRows = input.comments.flatMap((comment) =>
      comment.likeUserIds.map((userId) => ({
        comment_id: comment.id,
        user_id: userId,
      })),
    );

    if (likeRows.length > 0) {
      const { error: likesError } = await client.from("forum_comment_likes").upsert(
        likeRows,
        {
          onConflict: "comment_id,user_id",
        },
      );

      if (likesError) {
        throw likesError;
      }
    }

    const reportRows = input.comments.flatMap((comment) =>
      comment.reports.map((report) => ({
        comment_id: comment.id,
        user_id: report.userId,
        reason: report.reason,
        created_at: report.createdAt,
      })),
    );

    if (reportRows.length > 0) {
      const { error: reportsError } = await client.from("forum_comment_reports").upsert(
        reportRows,
        {
          onConflict: "comment_id,user_id",
        },
      );

      if (reportsError) {
        throw reportsError;
      }
    }
  });
}
