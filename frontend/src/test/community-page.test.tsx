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
];

describe("CommunityPage", () => {
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

  it("renders login prompt and empty state for guests", async () => {
    render(
      <BrowserRouter>
        <CommunityPage />
      </BrowserRouter>,
    );

    const categoryCard = await screen.findByText("Cảm xúc & Tâm lý");
    fireEvent.click(categoryCard);

    await waitFor(() => expect(mockApiRequest).toHaveBeenCalledWith(expect.stringContaining("/community/posts")));
    expect(screen.getByText("Đăng nhập để chia sẻ câu chuyện và câu hỏi của bạn trong chuyên mục này.")).toBeInTheDocument();
    expect(screen.getByText("Chưa có bài viết nào trong chủ đề này. Hãy là người mở đầu thảo luận nhé!")).toBeInTheDocument();
  });
});
