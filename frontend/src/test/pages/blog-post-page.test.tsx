import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import BlogPostPage from "@/pages/BlogPostPage";

const mockApiRequest = vi.fn();

vi.mock("@/lib/api/client", () => ({
  ApiError: class ApiError extends Error {},
  apiRequest: (...args: unknown[]) => mockApiRequest(...args),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: () => ({ id: "suc-khoe-sinh-san" }),
    useNavigate: () => vi.fn(),
  };
});

const mockPost = {
  id: 1,
  slug: "suc-khoe-sinh-san",
  title: "Sức khỏe sinh sản là gì?",
  excerpt: "Tổng quan về sức khỏe sinh sản cho tuổi teen.",
  content: "Nội dung bài viết đầy đủ về sức khỏe sinh sản.\nDòng thứ hai.",
  category: "Sức khỏe",
  date: "15/01/2026",
  readTime: "5 phút đọc",
  emoji: "💚",
};

describe("BlogPostPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state initially", () => {
    mockApiRequest.mockReturnValue(new Promise(() => {}));
    render(
      <BrowserRouter>
        <BlogPostPage />
      </BrowserRouter>
    );
    expect(screen.getByText(/đang tải/i)).toBeInTheDocument();
  });

  it("renders blog post title and content", async () => {
    mockApiRequest.mockImplementation((url: string) => {
      if (url.includes("/blog-posts/suc-khoe-sinh-san")) return Promise.resolve(mockPost);
      if (url === "/blog-posts") return Promise.resolve([mockPost]);
      return Promise.resolve(null);
    });

    render(
      <BrowserRouter>
        <BlogPostPage />
      </BrowserRouter>
    );

    expect(await screen.findByText("Sức khỏe sinh sản là gì?")).toBeInTheDocument();
    expect(await screen.findByText(/tổng quan về sức khỏe sinh sản/i)).toBeInTheDocument();
  });

  it("renders category, date and read time", async () => {
    mockApiRequest.mockImplementation((url: string) => {
      if (url.includes("/blog-posts/suc-khoe-sinh-san")) return Promise.resolve(mockPost);
      if (url === "/blog-posts") return Promise.resolve([mockPost]);
      return Promise.resolve(null);
    });

    render(
      <BrowserRouter>
        <BlogPostPage />
      </BrowserRouter>
    );

    const readTimeEls = await screen.findAllByText("5 phút đọc");
    expect(readTimeEls.length).toBeGreaterThan(0);
    expect((await screen.findAllByText("Sức khỏe")).length).toBeGreaterThan(0);
  });

  it("renders multi-line content as separate paragraphs", async () => {
    mockApiRequest.mockImplementation((url: string) => {
      if (url.includes("/blog-posts/suc-khoe-sinh-san")) return Promise.resolve(mockPost);
      if (url === "/blog-posts") return Promise.resolve([mockPost]);
      return Promise.resolve(null);
    });

    render(
      <BrowserRouter>
        <BlogPostPage />
      </BrowserRouter>
    );

    expect(await screen.findByText(/nội dung bài viết đầy đủ/i)).toBeInTheDocument();
    expect(await screen.findByText(/dòng thứ hai/i)).toBeInTheDocument();
  });

  it("shows error message when fetch fails", async () => {
    mockApiRequest.mockRejectedValue(new Error("Không thể tải bài viết."));

    render(
      <BrowserRouter>
        <BlogPostPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/không thể tải bài viết/i)).toBeInTheDocument();
    });
  });

  it("renders back navigation button", async () => {
    mockApiRequest.mockImplementation((url: string) => {
      if (url.includes("/blog-posts/suc-khoe-sinh-san")) return Promise.resolve(mockPost);
      if (url === "/blog-posts") return Promise.resolve([mockPost]);
      return Promise.resolve(null);
    });

    render(
      <BrowserRouter>
        <BlogPostPage />
      </BrowserRouter>
    );

    await screen.findByText("Sức khỏe sinh sản là gì?");
    expect(screen.getByText(/quay lại/i)).toBeInTheDocument();
  });
});
