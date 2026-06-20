import { describe, it, expect } from "vitest";

// Pure utility functions extracted / tested in isolation

function safeJsonParse(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function hexToRgb(hex: string) {
  const cleaned = hex.replace("#", "").trim();
  const full =
    cleaned.length === 3
      ? cleaned
          .split("")
          .map((c) => c + c)
          .join("")
      : cleaned;
  const num = parseInt(full, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function rgbToHex(r: number, g: number, b: number) {
  const toHex = (n: number) => n.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function mix(hex: string, target: string, amount: number) {
  const a = Math.max(0, Math.min(1, amount));
  const c1 = hexToRgb(hex);
  const c2 = hexToRgb(target);
  const r = Math.round(c1.r * (1 - a) + c2.r * a);
  const g = Math.round(c1.g * (1 - a) + c2.g * a);
  const b = Math.round(c1.b * (1 - a) + c2.b * a);
  return rgbToHex(r, g, b);
}

describe("safeJsonParse", () => {
  it("parses valid JSON", () => {
    expect(safeJsonParse('{"key":"value"}')).toEqual({ key: "value" });
  });

  it("returns null for invalid JSON", () => {
    expect(safeJsonParse("not json")).toBeNull();
  });

  it("returns null for empty string", () => {
    expect(safeJsonParse("")).toBeNull();
  });

  it("parses arrays", () => {
    expect(safeJsonParse("[1,2,3]")).toEqual([1, 2, 3]);
  });

  it("parses nested objects", () => {
    expect(safeJsonParse('{"a":{"b":1}}')).toEqual({ a: { b: 1 } });
  });
});

describe("hexToRgb", () => {
  it("converts 6-char hex to RGB", () => {
    expect(hexToRgb("#ffffff")).toEqual({ r: 255, g: 255, b: 255 });
    expect(hexToRgb("#000000")).toEqual({ r: 0, g: 0, b: 0 });
    expect(hexToRgb("#7C3AED")).toEqual({ r: 124, g: 58, b: 237 });
  });

  it("converts 3-char hex shorthand", () => {
    expect(hexToRgb("#fff")).toEqual({ r: 255, g: 255, b: 255 });
    expect(hexToRgb("#000")).toEqual({ r: 0, g: 0, b: 0 });
  });

  it("handles hex without # prefix", () => {
    expect(hexToRgb("ffffff")).toEqual({ r: 255, g: 255, b: 255 });
  });
});

describe("rgbToHex", () => {
  it("converts RGB to hex string", () => {
    expect(rgbToHex(255, 255, 255)).toBe("#ffffff");
    expect(rgbToHex(0, 0, 0)).toBe("#000000");
    expect(rgbToHex(124, 58, 237)).toBe("#7c3aed");
  });

  it("pads single-digit hex values", () => {
    expect(rgbToHex(1, 2, 3)).toBe("#010203");
  });
});

describe("mix", () => {
  it("returns first color at amount 0", () => {
    expect(mix("#ff0000", "#0000ff", 0)).toBe("#ff0000");
  });

  it("returns second color at amount 1", () => {
    expect(mix("#ff0000", "#0000ff", 1)).toBe("#0000ff");
  });

  it("blends at 50%", () => {
    expect(mix("#000000", "#ffffff", 0.5)).toBe("#808080");
  });

  it("clamps amount below 0 to 0", () => {
    expect(mix("#ff0000", "#0000ff", -1)).toBe("#ff0000");
  });

  it("clamps amount above 1 to 1", () => {
    expect(mix("#ff0000", "#0000ff", 2)).toBe("#0000ff");
  });
});
