// Legacy test file — kept for backward compatibility
// Full suite is in src/test/pages/courses-page.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CoursesPage from "@/pages/CoursesPage";

const mockUseAuth = vi.fn();
const mockApiRequest = vi.fn();

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock("@/lib/api/client", () => ({
  ApiError: class ApiError extends Error {},
  apiRequest: (...args: unknown[]) => mockApiRequest(...args),
}));

const mockCourse = {
  id: 1,
  title: "Tuổi dậy thì là gì?",
  description: "Tổng quan về tuổi dậy thì.",
  thumbnail: null,
  colorTheme: "#7C3AED",
  order: 1,
  lessons: [],
  enrolled: false,
  category: null,
};

describe("CoursesPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({
      user: {
        completedLessons: [],
        plan: "premium",
        role: "student",
        isAdmin: false,
      },
    });
    mockApiRequest.mockResolvedValue([mockCourse]);
  });

  it("loads courses from backend api", async () => {
    render(
      <BrowserRouter>
        <CoursesPage />
      </BrowserRouter>
    );
    await waitFor(() => expect(mockApiRequest).toHaveBeenCalledWith("/courses"));
    expect(await screen.findByText("Tuổi dậy thì là gì?")).toBeInTheDocument();
  });
});
