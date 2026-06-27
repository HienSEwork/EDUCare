import { render, screen, waitFor, fireEvent } from "@testing-library/react";
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

const mockCategories = [
  { id: 1, name: "Cảm xúc & Tâm lý", slug: "cam-xuc-tam-ly", description: "Desc 1", icon: "Smile", colorTheme: "emerald" },
  { id: 2, name: "Học tập & Định hướng", slug: "hoc-tap-dinh-huong", description: "Desc 2", icon: "BookOpen", colorTheme: "indigo" },
];

const mockPost = {
  id: 1,
  title: "Tiêu đề bài viết",
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
    mockApiRequest.mockImplementation((url: string) => {
      if (url.includes("/community/categories")) {
        return Promise.resolve(mockCategories);
      }
      return Promise.resolve([]);
    });
  });

  it("renders login prompt for guests", async () => {
    render(
      <BrowserRouter>
        <CommunityPage />
      </BrowserRouter>
    );

    const categoryCard = await screen.findByText("Cảm xúc & Tâm lý");
    fireEvent.click(categoryCard);

    await waitFor(() => expect(mockApiRequest).toHaveBeenCalledWith(expect.stringContaining("/community/posts")));
    expect(
      screen.getByText("Đăng nhập để chia sẻ câu chuyện và câu hỏi của bạn trong chuyên mục này.")
    ).toBeInTheDocument();
  });

  it("shows empty state message", async () => {
    render(
      <BrowserRouter>
        <CommunityPage />
      </BrowserRouter>
    );

    const categoryCard = await screen.findByText("Cảm xúc & Tâm lý");
    fireEvent.click(categoryCard);

    await waitFor(() => expect(mockApiRequest).toHaveBeenCalledWith(expect.stringContaining("/community/posts")));
    expect(
      screen.getByText("Chưa có bài viết nào trong chủ đề này. Hãy là người mở đầu thảo luận nhé!")
    ).toBeInTheDocument();
  });

  it("renders heading", async () => {
    render(
      <BrowserRouter>
        <CommunityPage />
      </BrowserRouter>
    );
    await waitFor(() => expect(mockApiRequest).toHaveBeenCalledWith("/community/categories"));
    const headings = screen.getAllByRole("heading");
    expect(headings.length).toBeGreaterThan(0);
  });

  it("calls community/categories api on mount", async () => {
    render(
      <BrowserRouter>
        <CommunityPage />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(mockApiRequest).toHaveBeenCalledWith("/community/categories");
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
    mockApiRequest.mockImplementation((url: string) => {
      if (url.includes("/community/categories")) {
        return Promise.resolve(mockCategories);
      }
      if (url.includes("/community/posts")) {
        return Promise.resolve([mockPost]);
      }
      return Promise.resolve([]);
    });
  });

  it("renders community post content", async () => {
    render(
      <BrowserRouter>
        <CommunityPage />
      </BrowserRouter>
    );

    const categoryCard = await screen.findByText("Cảm xúc & Tâm lý");
    fireEvent.click(categoryCard);

    const items = await screen.findAllByText("Bài viết cộng đồng đầu tiên");
    expect(items.length).toBeGreaterThan(0);
  });

  it("shows post author name", async () => {
    render(
      <BrowserRouter>
        <CommunityPage />
      </BrowserRouter>
    );

    const categoryCard = await screen.findByText("Cảm xúc & Tâm lý");
    fireEvent.click(categoryCard);

    const items = await screen.findAllByText("Minh Anh");
    expect(items.length).toBeGreaterThan(0);
  });

  it("does not show login prompt for logged-in users", async () => {
    render(
      <BrowserRouter>
        <CommunityPage />
      </BrowserRouter>
    );

    const categoryCard = await screen.findByText("Cảm xúc & Tâm lý");
    fireEvent.click(categoryCard);

    await waitFor(() => expect(mockApiRequest).toHaveBeenCalledWith(expect.stringContaining("/community/posts")));
    expect(
      screen.queryByText(/đăng nhập để chia sẻ câu chuyện và câu hỏi/i)
    ).not.toBeInTheDocument();
  });
});
