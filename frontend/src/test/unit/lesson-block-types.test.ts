import { describe, it, expect } from "vitest";
import type { MicroLessonBlock } from "@/types/api";

// Test block label mapping logic (mirrors LessonPage.blockLabel)
function blockLabel(blockType: MicroLessonBlock["blockType"]): string {
  switch (blockType) {
    case "hook": return "Hook";
    case "explanation": return "Hiểu nhanh";
    case "scenario": return "Tình huống thực tế";
    case "interaction": return "Thử thách trắc nghiệm";
    case "sorting": return "Phân loại hành vi";
    case "flashcard": return "Thẻ nhớ lật 3D";
    case "scenario-choice": return "Chọn cuộc phiêu lưu";
    case "matching": return "Ghép cặp từ khóa";
    case "fill-blank": return "Xếp chữ điền từ";
    case "reflection": return "Suy ngẫm";
    case "takeaway": return "Điều cần nhớ";
    default: return blockType;
  }
}

// Mirror of isAssessmentMicro from LessonPage
function isAssessmentMicro(ml: { order?: number; title?: string; blocks?: Array<{ blockType: string }> }): boolean {
  if (!ml) return false;
  if (ml.order === 99) return true;
  const titleLower = (ml.title ?? "").toLowerCase();
  if (titleLower.includes("kiểm tra") || titleLower.includes("assessment") || titleLower.includes("test")) return true;
  return (ml.blocks ?? []).some((b) => ["scenario-choice", "matching", "fill-blank"].includes(b.blockType));
}

describe("blockLabel", () => {
  it("returns correct label for hook", () => {
    expect(blockLabel("hook")).toBe("Hook");
  });

  it("returns correct label for explanation", () => {
    expect(blockLabel("explanation")).toBe("Hiểu nhanh");
  });

  it("returns correct label for interaction", () => {
    expect(blockLabel("interaction")).toBe("Thử thách trắc nghiệm");
  });

  it("returns correct label for flashcard", () => {
    expect(blockLabel("flashcard")).toBe("Thẻ nhớ lật 3D");
  });

  it("returns correct label for fill-blank", () => {
    expect(blockLabel("fill-blank")).toBe("Xếp chữ điền từ");
  });

  it("returns correct label for takeaway", () => {
    expect(blockLabel("takeaway")).toBe("Điều cần nhớ");
  });

  it("returns the blockType itself for unknown types", () => {
    // @ts-expect-error testing unknown type
    expect(blockLabel("unknown-type")).toBe("unknown-type");
  });
});

describe("isAssessmentMicro", () => {
  it("returns true when order is 99", () => {
    expect(isAssessmentMicro({ order: 99, title: "Phần 1", blocks: [] })).toBe(true);
  });

  it("returns true when title contains 'kiểm tra'", () => {
    expect(isAssessmentMicro({ order: 1, title: "Kiểm tra cuối bài", blocks: [] })).toBe(true);
  });

  it("returns true when title contains 'assessment'", () => {
    expect(isAssessmentMicro({ order: 1, title: "Final Assessment", blocks: [] })).toBe(true);
  });

  it("returns true when blocks contain scenario-choice", () => {
    expect(isAssessmentMicro({
      order: 2,
      title: "Bài học",
      blocks: [{ blockType: "scenario-choice" }],
    })).toBe(true);
  });

  it("returns true when blocks contain matching", () => {
    expect(isAssessmentMicro({
      order: 2,
      title: "Bài học",
      blocks: [{ blockType: "matching" }],
    })).toBe(true);
  });

  it("returns false for regular content micro", () => {
    expect(isAssessmentMicro({
      order: 1,
      title: "Khái niệm cơ bản",
      blocks: [{ blockType: "hook" }, { blockType: "explanation" }],
    })).toBe(false);
  });

  it("returns false for falsy input", () => {
    // @ts-expect-error testing null input
    expect(isAssessmentMicro(null)).toBe(false);
  });
});
