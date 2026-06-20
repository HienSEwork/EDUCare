import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import HomePage from "@/pages/HomePage";

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({ user: null }),
}));

vi.mock("@/lib/api/client", () => ({
  ApiError: class ApiError extends Error {},
  apiRequest: vi.fn().mockResolvedValue([]),
}));

vi.mock("@/assets/hero-illustration.png", () => ({ default: "hero.png" }));

vi.mock("@/components/MoodTracker", () => ({
  default: () => <div data-testid="mood-tracker" />,
}));

vi.mock("@/components/AnonymousQuestionBox", () => ({
  default: () => <div data-testid="anonymous-question-box" />,
}));

vi.mock("@/components/RandomAdvice", () => ({
  default: () => <div data-testid="random-advice" />,
}));

function renderHomePage() {
  return render(
    <BrowserRouter>
      <HomePage />
    </BrowserRouter>
  );
}

describe("HomePage (guest)", () => {
  it("renders hero heading", () => {
    renderHomePage();
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
  });

  it("renders primary CTA button for guests", () => {
    renderHomePage();
    // Button text comes from HOME_COPY.primaryActionGuest = "Bắt đầu miễn phí"
    const links = screen.getAllByRole("link");
    expect(links.length).toBeGreaterThan(0);
    const hrefs = links.map((l) => l.getAttribute("href"));
    expect(hrefs.some((h) => h?.includes("register") || h?.includes("dashboard"))).toBe(true);
  });

  it("renders courses link", () => {
    renderHomePage();
    const coursesLinks = screen.getAllByRole("link");
    const hrefs = coursesLinks.map((l) => l.getAttribute("href"));
    expect(hrefs).toContain("/courses");
  });

  it("renders mood tracker component", () => {
    renderHomePage();
    expect(screen.getByTestId("mood-tracker")).toBeInTheDocument();
  });

  it("renders anonymous question box", () => {
    renderHomePage();
    expect(screen.getByTestId("anonymous-question-box")).toBeInTheDocument();
  });

  it("renders random advice component", () => {
    renderHomePage();
    expect(screen.getByTestId("random-advice")).toBeInTheDocument();
  });
});

describe("HomePage (logged-in user)", () => {
  beforeEach(() => {
    vi.mock("@/contexts/AuthContext", () => ({
      useAuth: () => ({
        user: {
          id: "1",
          fullName: "Minh Anh",
          email: "minhanh@educare.vn",
          username: "minhanh",
          age: 16,
          plan: "free",
          xp: 100,
          streak: 2,
          quizScore: 70,
          avatar: null,
          role: "student",
          isAdmin: false,
          completedLessons: [],
          createdAt: "2026-01-01T00:00:00Z",
        },
      }),
    }));
  });

  it("renders page without crashing when user is logged in", () => {
    renderHomePage();
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });
});
