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
  title: "Tuổi dậy thì",
  description: "Khóa học về tuổi dậy thì",
  thumbnail: null,
  colorTheme: "#7C3AED",
  order: 1,
  lessons: [],
  enrolled: false,
  category: { id: 1, slug: "suc-khoe", name: "Sức khỏe", icon: "❤️", colorTheme: "#FF6B6B" },
};

describe("CoursesPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({
      user: {
        id: "1",
        fullName: "Minh Anh",
        completedLessons: [],
        plan: "free",
        role: "student",
        isAdmin: false,
      },
    });
    mockApiRequest.mockResolvedValue([mockCourse]);
  });

  it("calls /courses api on mount", async () => {
    render(
      <BrowserRouter>
        <CoursesPage />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(mockApiRequest).toHaveBeenCalledWith("/courses");
    });
  });

  it("renders page heading", async () => {
    render(
      <BrowserRouter>
        <CoursesPage />
      </BrowserRouter>
    );
    await waitFor(() => {
      const headings = screen.getAllByRole("heading");
      expect(headings.length).toBeGreaterThan(0);
    });
  });

  it("renders course card when api returns data", async () => {
    render(
      <BrowserRouter>
        <CoursesPage />
      </BrowserRouter>
    );
    expect(await screen.findByText("Tuổi dậy thì")).toBeInTheDocument();
  });

  it("renders course description", async () => {
    render(
      <BrowserRouter>
        <CoursesPage />
      </BrowserRouter>
    );
    expect(await screen.findByText("Khóa học về tuổi dậy thì")).toBeInTheDocument();
  });

  it("renders course category name", async () => {
    render(
      <BrowserRouter>
        <CoursesPage />
      </BrowserRouter>
    );
    const matches = await screen.findAllByText("Sức khỏe");
    expect(matches.length).toBeGreaterThan(0);
  });

  it("handles guest user (null user)", async () => {
    mockUseAuth.mockReturnValue({ user: null });
    render(
      <BrowserRouter>
        <CoursesPage />
      </BrowserRouter>
    );
    await waitFor(() => expect(mockApiRequest).toHaveBeenCalled());
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });
});
