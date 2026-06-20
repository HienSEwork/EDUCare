import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import BlogPage from "@/pages/BlogPage";

const mockApiRequest = vi.fn();

vi.mock("@/lib/api/client", () => ({
  ApiError: class ApiError extends Error {},
  apiRequest: (...args: unknown[]) => mockApiRequest(...args),
}));

const mockPosts = [
  {
    id: 1,
    slug: "suc-khoe-sinh-san",
    title: "Sức khỏe sinh sản là gì?",
    excerpt: "Tóm tắt bài viết đầu tiên.",
    content: "Nội dung đầy đủ...",
    category: "Sức khỏe",
    date: "15/01/2026",
    readTime: "5 phút đọc",
    emoji: "💚",
  },
  {
    id: 2,
    slug: "tam-ly-tuoi-teen",
    title: "Tâm lý tuổi teen",
    excerpt: "Tóm tắt bài viết thứ hai.",
    content: "Nội dung thứ hai...",
    category: "Tâm lý",
    date: "20/01/2026",
    readTime: "7 phút đọc",
    emoji: "🧠",
  },
];

describe("BlogPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders page heading", () => {
    mockApiRequest.mockResolvedValue(mockPosts);
    render(
      <BrowserRouter>
        <BlogPage />
      </BrowserRouter>
    );
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("renders blog post cards when api returns data", async () => {
    mockApiRequest.mockResolvedValue(mockPosts);
    render(
      <BrowserRouter>
        <BlogPage />
      </BrowserRouter>
    );
    expect(await screen.findByText("Sức khỏe sinh sản là gì?")).toBeInTheDocument();
    expect(await screen.findByText("Tâm lý tuổi teen")).toBeInTheDocument();
  });

  it("renders excerpts for each post", async () => {
    mockApiRequest.mockResolvedValue(mockPosts);
    render(
      <BrowserRouter>
        <BlogPage />
      </BrowserRouter>
    );
    expect(await screen.findByText("Tóm tắt bài viết đầu tiên.")).toBeInTheDocument();
  });

  it("renders links to individual post pages", async () => {
    mockApiRequest.mockResolvedValue(mockPosts);
    render(
      <BrowserRouter>
        <BlogPage />
      </BrowserRouter>
    );
    await screen.findByText("Sức khỏe sinh sản là gì?");
    const links = screen.getAllByRole("link");
    const hrefs = links.map((l) => l.getAttribute("href"));
    expect(hrefs.some((h) => h?.includes("suc-khoe-sinh-san"))).toBe(true);
  });

  it("calls /blog-posts api on mount", async () => {
    mockApiRequest.mockResolvedValue(mockPosts);
    render(
      <BrowserRouter>
        <BlogPage />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(mockApiRequest).toHaveBeenCalledWith("/blog-posts");
    });
  });

  it("shows empty state when no posts returned", async () => {
    mockApiRequest.mockResolvedValue([]);
    render(
      <BrowserRouter>
        <BlogPage />
      </BrowserRouter>
    );
    await waitFor(() => expect(mockApiRequest).toHaveBeenCalled());
    // heading still renders
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });
});
