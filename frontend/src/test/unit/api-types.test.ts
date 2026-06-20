import { describe, it, expect } from "vitest";
import type { User, Lesson, Course, BlogPost, MicroLessonBlock, MicroLesson } from "@/types/api";

// Type-shape validation: construct objects and assert field presence/types at runtime

describe("User type shape", () => {
  const user: User = {
    id: "uuid-123",
    fullName: "Minh Anh",
    email: "minhanh@educare.vn",
    username: "minhanh",
    age: 16,
    plan: "free",
    xp: 120,
    streak: 3,
    quizScore: 80,
    avatar: null,
    role: "student",
    isAdmin: false,
    completedLessons: ["lesson-slug-1"],
    createdAt: "2026-01-01T00:00:00Z",
  };

  it("has required string fields", () => {
    expect(typeof user.id).toBe("string");
    expect(typeof user.email).toBe("string");
    expect(typeof user.username).toBe("string");
  });

  it("plan is one of allowed values", () => {
    const allowed = ["free", "popular", "premium"];
    expect(allowed).toContain(user.plan);
  });

  it("role is one of allowed values", () => {
    const allowed = ["student", "admin"];
    expect(allowed).toContain(user.role);
  });

  it("completedLessons is an array", () => {
    expect(Array.isArray(user.completedLessons)).toBe(true);
  });

  it("xp and streak are numbers", () => {
    expect(typeof user.xp).toBe("number");
    expect(typeof user.streak).toBe("number");
  });
});

describe("Lesson type shape", () => {
  const block: MicroLessonBlock = {
    id: 1,
    blockType: "hook",
    contentJson: '{"title":"Hook title"}',
    orderIndex: 0,
  };

  const microLesson: MicroLesson = {
    id: 1,
    title: "Phần 1",
    order: 1,
    completed: false,
    blocks: [block],
  };

  const lesson: Lesson = {
    id: 1,
    slug: "tuoi-day-thi-la-gi",
    title: "Tuổi dậy thì là gì?",
    summary: "Tổng quan về tuổi dậy thì.",
    content: "Nội dung chi tiết",
    order: 1,
    isFree: true,
    courseId: 1,
    xpReward: 50,
    estimatedMinutes: 10,
    microLessons: [microLesson],
  };

  it("has slug and title", () => {
    expect(lesson.slug).toBeTruthy();
    expect(lesson.title).toBeTruthy();
  });

  it("isFree is boolean", () => {
    expect(typeof lesson.isFree).toBe("boolean");
  });

  it("microLessons contains blocks", () => {
    expect(lesson.microLessons[0].blocks[0].blockType).toBe("hook");
  });

  it("block blockType is valid", () => {
    const validTypes = [
      "hook", "explanation", "scenario", "interaction",
      "reflection", "takeaway", "sorting", "flashcard",
      "scenario-choice", "matching", "fill-blank",
    ];
    expect(validTypes).toContain(block.blockType);
  });
});

describe("BlogPost type shape", () => {
  const post: BlogPost = {
    id: 1,
    slug: "suc-khoe-sinh-san",
    title: "Sức khỏe sinh sản là gì?",
    excerpt: "Tóm tắt ngắn về sức khỏe sinh sản.",
    content: "Nội dung đầy đủ...",
    category: "Sức khỏe",
    date: "2026-01-15",
    readTime: "5 phút đọc",
    emoji: "💚",
  };

  it("has required string fields", () => {
    expect(typeof post.slug).toBe("string");
    expect(typeof post.title).toBe("string");
    expect(typeof post.emoji).toBe("string");
  });
});
