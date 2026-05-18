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

describe("CommunityPage", () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({ user: null });
    mockApiRequest.mockResolvedValue([]);
  });

  it("renders login prompt and empty state for guests", async () => {
    render(
      <BrowserRouter>
        <CommunityPage />
      </BrowserRouter>,
    );

    await waitFor(() => expect(mockApiRequest).toHaveBeenCalledWith("/community/posts"));
    expect(screen.getByText("Đăng nhập để bắt đầu thảo luận, gửi phản hồi và tham gia sâu hơn vào cộng đồng EDUcare.")).toBeInTheDocument();
    expect(screen.getByText("Chưa có chủ đề nào. Bạn có thể là người mở đầu cuộc trò chuyện hôm nay.")).toBeInTheDocument();
  });
});
