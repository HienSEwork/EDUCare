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

describe("CoursesPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({
      user: {
        completedLessons: ["tuoi-day-thi-la-gi"],
        plan: "premium",
      },
    });
    mockApiRequest.mockResolvedValue([
      {
        id: 1,
        slug: "tuoi-day-thi-la-gi",
        title: "Tuổi dậy thì là gì?",
        summary: "Tổng quan về tuổi dậy thì.",
        content: "Nội dung",
        order: 1,
        isFree: true,
      },
    ]);
  });

  it("loads lesson cards from backend api", async () => {
    render(
      <BrowserRouter>
        <CoursesPage />
      </BrowserRouter>,
    );

    await waitFor(() => expect(mockApiRequest).toHaveBeenCalledWith("/lessons"));
    expect(screen.getByText("Chọn chủ đề phù hợp,")).toBeInTheDocument();
    expect(screen.getByText("học từng bước dễ theo hơn.")).toBeInTheDocument();
    expect((await screen.findAllByText("Tuổi dậy thì là gì?")).length).toBeGreaterThan(0);
    expect(await screen.findByText("Đã học")).toBeInTheDocument();
  });
});
