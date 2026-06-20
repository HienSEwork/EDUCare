import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CommunityPage from "@/pages/CommunityPage";

const mockUseAuth = vi.fn();
const mockApiRequest = vi.fn();

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock("@/lib/api/client", () => ({
  ApiError: class ApiError extends Error {},
  apiRequest: (...args: unknown[]) => mockApiRequest(...args),
}));

const mockPost = {
  id: 1,
  author: "Minh Anh",
  authorId: "user-1",
  content: "Bài viết cộng đồng đầu tiên",
  anonymous: false,
  likes: 5,
  liked: false,
  createdAt: "2026-01-01T00:00:00Z",
  replies: [],
};

describe("CommunityPage (guest)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({ user: null });
    mockApiRequest.mockResolvedValue([]);
  });

  it("renders login prompt for guests", async () => {
    render(
      <BrowserRouter>
        <CommunityPage />
      </BrowserRouter>
    );
    await waitFor(() => expect(mockApiRequest).toHaveBeenCalledWith("/community/posts"));
    expect(
      screen.getByText("Đăng nhập để bắt đầu thảo luận, gửi phản hồi và tham gia sâu hơn vào cộng đồng EDUcare.")
    ).toBeInTheDocument();
  });

  it("shows empty state message", async () => {
    render(
      <BrowserRouter>
        <CommunityPage />
      </BrowserRouter>
    );
    await waitFor(() => expect(mockApiRequest).toHaveBeenCalled());
    expect(
      screen.getByText("Chưa có chủ đề nào. Bạn có thể là người mở đầu cuộc trò chuyện hôm nay.")
    ).toBeInTheDocument();
  });

  it("renders heading", async () => {
    render(
      <BrowserRouter>
        <CommunityPage />
      </BrowserRouter>
    );
    await waitFor(() => expect(mockApiRequest).toHaveBeenCalled());
    const headings = screen.getAllByRole("heading");
    expect(headings.length).toBeGreaterThan(0);
  });

  it("calls community/posts api on mount", async () => {
    render(
      <BrowserRouter>
        <CommunityPage />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(mockApiRequest).toHaveBeenCalledWith("/community/posts");
    });
  });
});

describe("CommunityPage (logged-in)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({
      user: {
        id: "user-1",
        fullName: "Minh Anh",
        username: "minhanh",
        plan: "free",
        role: "student",
        isAdmin: false,
        completedLessons: [],
      },
    });
    mockApiRequest.mockResolvedValue([mockPost]);
  });

  it("renders community post content", async () => {
    render(
      <BrowserRouter>
        <CommunityPage />
      </BrowserRouter>
    );
    const items = await screen.findAllByText("Bài viết cộng đồng đầu tiên");
    expect(items.length).toBeGreaterThan(0);
  });

  it("shows post author name", async () => {
    render(
      <BrowserRouter>
        <CommunityPage />
      </BrowserRouter>
    );
    const items = await screen.findAllByText("Minh Anh");
    expect(items.length).toBeGreaterThan(0);
  });

  it("does not show login prompt for logged-in users", async () => {
    render(
      <BrowserRouter>
        <CommunityPage />
      </BrowserRouter>
    );
    await waitFor(() => expect(mockApiRequest).toHaveBeenCalled());
    expect(
      screen.queryByText(/đăng nhập để bắt đầu thảo luận/i)
    ).not.toBeInTheDocument();
  });
});
