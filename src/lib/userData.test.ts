import { describe, expect, it } from "vitest";
import {
  getForumComments,
  getTrailEarnedXp,
  isForumCommentHidden,
  migrateAnonymousPosts,
  type ForumComment,
} from "./userData.ts";
import { fetchUserGamification } from "./gamification/badges.ts";

function createComment(overrides: Partial<ForumComment>): ForumComment {
  return {
    id: "comment-1",
    parentId: null,
    authorId: "local-anonymous",
    authorName: "Aluno Teste",
    authorInitials: "AT",
    createdAt: "2026-04-14T10:00:00.000Z",
    content: "Comentario antigo local.",
    likeUserIds: [],
    reports: [],
    legacyReplyCount: 0,
    ...overrides,
  };
}

describe("migrateAnonymousPosts", () => {
  it("claims anonymous comments by matching author name", () => {
    localStorage.setItem(
      "mackseguro:user-data",
      JSON.stringify({
        moduleProgress: {},
        forumPosts: {},
        forumComments: {
          "seguranca-digital:1": [
            createComment({ id: "anon-1", authorId: "local-anonymous", authorName: "Aluno Teste" }),
            createComment({ id: "anon-2", authorId: "local-anonymous", authorName: "Outro Aluno" }),
            createComment({ id: "signed-1", authorId: "user_existing", authorName: "Aluno Teste" }),
          ],
        },
      }),
    );

    const migratedCount = migrateAnonymousPosts("user_test", "  Aluno   Teste ");

    expect(migratedCount).toBe(1);

    const comments = getForumComments("seguranca-digital", 1);
    const claimed = comments.find((comment) => comment.id === "anon-1");
    const untouchedAnonymous = comments.find((comment) => comment.id === "anon-2");
    const signedInComment = comments.find((comment) => comment.id === "signed-1");

    expect(claimed?.authorId).toBe("user_test");
    expect(claimed?.authorName).toBe("Aluno Teste");
    expect(claimed?.authorInitials).toBe("AT");
    expect(untouchedAnonymous?.authorId).toBe("local-anonymous");
    expect(signedInComment?.authorId).toBe("user_existing");
  });

  it("returns zero when there is no matching anonymous comment", () => {
    localStorage.setItem(
      "mackseguro:user-data",
      JSON.stringify({
        moduleProgress: {},
        forumPosts: {},
        forumComments: {
          "seguranca-digital:1": [
            createComment({ id: "anon-1", authorId: "local-anonymous", authorName: "Pessoa Diferente" }),
          ],
        },
      }),
    );

    const migratedCount = migrateAnonymousPosts("user_test", "Aluno Teste");

    expect(migratedCount).toBe(0);
    expect(getForumComments("seguranca-digital", 1)[0]?.authorId).toBe("local-anonymous");
  });
});

describe("isForumCommentHidden", () => {
  it("returns true when comment reaches moderation report threshold", () => {
    const hiddenComment = createComment({
      reports: [
        { id: "r-1", userId: "u-1", reason: "spam", createdAt: "2026-04-14T10:00:00.000Z" },
        { id: "r-2", userId: "u-2", reason: "spam", createdAt: "2026-04-14T10:01:00.000Z" },
        { id: "r-3", userId: "u-3", reason: "spam", createdAt: "2026-04-14T10:02:00.000Z" },
      ],
    });

    expect(isForumCommentHidden(hiddenComment)).toBe(true);
  });

  it("returns false when comment is below report threshold", () => {
    const visibleComment = createComment({
      reports: [
        { id: "r-1", userId: "u-1", reason: "spam", createdAt: "2026-04-14T10:00:00.000Z" },
        { id: "r-2", userId: "u-2", reason: "spam", createdAt: "2026-04-14T10:01:00.000Z" },
      ],
    });

    expect(isForumCommentHidden(visibleComment)).toBe(false);
  });
});

describe("total earned XP calculation", () => {
  it("calculates XP correctly", () => {
    const trilha = {
      slug: "seguranca-digital",
      totalXp: 300,
      modulos: [
        { id: 1, xp: 100 },
        { id: 2, xp: 100 },
        { id: 3, xp: 100 },
      ],
    } as any;

    const remoteProgressRows = [
      {
        user_id: "user_test",
        trail_slug: "seguranca-digital",
        module_id: 1,
        completed: true,
        completed_at: "2026-04-14T12:00:00.000Z",
        quiz_score: 8,
        quiz_total: 10,
      },
      {
        user_id: "user_test",
        trail_slug: "seguranca-digital",
        module_id: 2,
        completed: true,
        completed_at: "2026-04-14T12:00:00.000Z",
        quiz_score: 10,
        quiz_total: 10,
      },
      {
        user_id: "user_test",
        trail_slug: "seguranca-digital",
        module_id: 3,
        completed: false,
        completed_at: "null",
        quiz_score: 0,
        quiz_total: 10,
      },
    ];

    const result = getTrailEarnedXp(trilha, remoteProgressRows);

    expect(result).toBe(180);
  });
});