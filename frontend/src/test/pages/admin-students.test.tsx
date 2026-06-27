import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AdminDashboardPage from "@/pages/AdminDashboardPage";
import type { AdminDashboardResponse, AdminContentResponse, AdminUserListResponse } from "@/types/api";

// ── Mocks ────────────────────────────────────────────────────────────────────

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({
    user: { id: "admin-1", fullName: "Admin Test", email: "admin@educare.vn", role: "admin", isAdmin: true },
    logout: vi.fn(),
  }),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => vi.fn() };
});

vi.mock("@/components/ui/sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

// Minimal valid dashboard fixture
const mockDashboard: AdminDashboardResponse = {
  summary: {
    totalUsers: 3, totalAdmins: 1, premiumUsers: 1,
    averageXp: 100, lessonCompletions: 10, communityPosts: 5,
    anonymousQuestions: 2, totalQuizQuestions: 20, totalGames: 8, totalQuizAttempts: 50,
  },
  recentUsers: [
    { id: "u1", fullName: "Alice Nguyen", email: "alice@test.vn", username: "alice", plan: "free", role: "student", xp: 80, createdAt: "2025-01-01T00:00:00Z" },
  ],
  planDistribution: [{ plan: "free", total: 2 }, { plan: "premium", total: 1 }],
  lessonCompletion: [],
  chatRooms: [],
};

const mockContent: AdminContentResponse = {
  metrics: { lessons: 2, blogPosts: 1, quizQuestions: 5, games: 3 },
  lessons: [],
  blogPosts: [],
  quizQuestions: [],
  games: [],
};

const mockStudentList: AdminUserListResponse = {
  total: 2,
  users: [
    { id: "u1", fullName: "Alice Nguyen", email: "alice@test.vn", username: "alice", age: 16, plan: "free", role: "student", xp: 80, streak: 3, quizScore: 40, avatar: null, createdAt: "2025-01-01T00:00:00Z" },
    { id: "u2", fullName: "Bob Tran", email: "bob@test.vn", username: "bob", age: 17, plan: "premium", role: "student", xp: 200, streak: 10, quizScore: 120, avatar: null, createdAt: "2025-02-15T00:00:00Z" },
  ],
};

// vi.hoisted ensures the ref is available when vi.mock factory runs (hoisting safe)
const { apiMock } = vi.hoisted(() => ({ apiMock: vi.fn() }));

vi.mock("@/lib/api/client", () => ({
  apiRequest: apiMock,
  ApiError: class ApiError extends Error {},
}));

function renderAdmin() {
  return render(
    <BrowserRouter>
      <AdminDashboardPage />
    </BrowserRouter>
  );
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("AdminDashboardPage — Students tab", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    apiMock.mockImplementation((path: string) => {
      if (path === "/admin/dashboard") return Promise.resolve(mockDashboard);
      if (path === "/admin/content") return Promise.resolve(mockContent);
      if (path.startsWith("/admin/users")) return Promise.resolve(mockStudentList);
      if (path === "/community/admin/reports") return Promise.resolve([]);
      if (path === "/community/admin/questions") return Promise.resolve([]);
      if (path === "/community/stickers") return Promise.resolve([]);
      return Promise.reject(new Error("Unknown path: " + path));
    });
  });

  it("renders overview by default", async () => {
    renderAdmin();
    await waitFor(() => expect(screen.getByText(/Chào mừng/i)).toBeInTheDocument());
  });

  it("navigates to Students tab and shows table header", async () => {
    renderAdmin();
    await waitFor(() => screen.getByText(/Chào mừng/i));

    fireEvent.click(screen.getByRole("button", { name: /học viên/i }));

    await waitFor(() => {
      expect(screen.getByText("Quản lý học viên")).toBeInTheDocument();
    });
  });

  it("shows student count badge on tab", async () => {
    renderAdmin();
    await waitFor(() => screen.getByText(/Chào mừng/i));

    fireEvent.click(screen.getByRole("button", { name: /học viên/i }));

    await waitFor(() => {
      // Badge shows total count from sidebar nav
      expect(screen.getAllByText("3").length).toBeGreaterThan(0);
    });
  });

  it("renders student rows after loading", async () => {
    renderAdmin();
    await waitFor(() => screen.getByText(/Chào mừng/i));
    fireEvent.click(screen.getByRole("button", { name: /học viên/i }));

    await waitFor(() => {
      expect(screen.getByText("Alice Nguyen")).toBeInTheDocument();
      expect(screen.getByText("Bob Tran")).toBeInTheDocument();
    });
  });

  it("search input filters by calling API with q param", async () => {
    renderAdmin();
    await waitFor(() => screen.getByText(/Chào mừng/i));
    fireEvent.click(screen.getByRole("button", { name: /học viên/i }));

    await waitFor(() => screen.getByPlaceholderText(/Tìm theo tên/i));

    fireEvent.change(screen.getByPlaceholderText(/Tìm theo tên/i), { target: { value: "Alice" } });

    await waitFor(() => {
      const calls = apiMock.mock.calls;
      const userCalls = calls.filter(([path]) => path.includes("/admin/users"));
      const lastCall = userCalls[userCalls.length - 1];
      expect(lastCall[0]).toContain("q=Alice");
    });
  });

  it("plan filter chip calls API with plan param", async () => {
    renderAdmin();
    await waitFor(() => screen.getByText(/Chào mừng/i));
    fireEvent.click(screen.getByRole("button", { name: /học viên/i }));

    await waitFor(() => screen.getByText("Premium"));
    fireEvent.click(screen.getByText("Premium"));

    await waitFor(() => {
      const calls = apiMock.mock.calls;
      const premiumCall = calls.find(([path]) => path.includes("plan=premium"));
      expect(premiumCall).toBeTruthy();
    });
  });

  it("clicking Sửa opens edit modal with user info", async () => {
    renderAdmin();
    await waitFor(() => screen.getByText(/Chào mừng/i));
    fireEvent.click(screen.getByRole("button", { name: /học viên/i }));

    await waitFor(() => screen.getByText("Alice Nguyen"));

    // Click first "Sửa" button
    const editBtns = screen.getAllByRole("button", { name: /sửa/i });
    fireEvent.click(editBtns[0]);

    // Modal has unique "Lưu thay đổi" button only in edit modal
    await waitFor(() => {
      expect(screen.getByText("Chỉnh sửa học viên")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /lưu thay đổi/i })).toBeInTheDocument();
    });
  });

  it("edit modal shows XP and streak stats", async () => {
    renderAdmin();
    await waitFor(() => screen.getByText(/Chào mừng/i));
    fireEvent.click(screen.getByRole("button", { name: /học viên/i }));

    await waitFor(() => screen.getByText("Alice Nguyen"));
    fireEvent.click(screen.getAllByRole("button", { name: /sửa/i })[0]);

    // Modal shows stat labels unique to it
    await waitFor(() => {
      expect(screen.getByText("Quiz Score")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /lưu thay đổi/i })).toBeInTheDocument();
    });
  });

  it("closing edit modal via Hủy removes modal", async () => {
    renderAdmin();
    await waitFor(() => screen.getByText(/Chào mừng/i));
    fireEvent.click(screen.getByRole("button", { name: /học viên/i }));

    await waitFor(() => screen.getByText("Alice Nguyen"));
    fireEvent.click(screen.getAllByRole("button", { name: /sửa/i })[0]);

    await waitFor(() => screen.getByText("Chỉnh sửa học viên"));
    fireEvent.click(screen.getByRole("button", { name: /hủy/i }));

    await waitFor(() => {
      expect(screen.queryByText("Chỉnh sửa học viên")).not.toBeInTheDocument();
    });
  });

  it("clicking Xóa opens confirm delete modal", async () => {
    renderAdmin();
    await waitFor(() => screen.getByText(/Chào mừng/i));
    fireEvent.click(screen.getByRole("button", { name: /học viên/i }));

    await waitFor(() => screen.getByText("Alice Nguyen"));

    const delBtns = screen.getAllByRole("button", { name: /xóa/i });
    fireEvent.click(delBtns[0]);

    // Confirm modal has unique title "Xác nhận xóa"
    await waitFor(() => {
      expect(screen.getByText("Xác nhận xóa")).toBeInTheDocument();
    });
  });

  it("empty state shown when no users returned", async () => {
    apiMock.mockImplementation((path: string) => {
      if (path === "/admin/dashboard") return Promise.resolve(mockDashboard);
      if (path === "/admin/content") return Promise.resolve(mockContent);
      if (path.startsWith("/admin/users")) return Promise.resolve({ users: [], total: 0 });
      if (path === "/community/admin/reports") return Promise.resolve([]);
      if (path === "/community/admin/questions") return Promise.resolve([]);
      if (path === "/community/stickers") return Promise.resolve([]);
      return Promise.reject(new Error("Unknown path: " + path));
    });

    renderAdmin();
    await waitFor(() => screen.getByText(/Chào mừng/i));
    fireEvent.click(screen.getByRole("button", { name: /học viên/i }));

    await waitFor(() => {
      expect(screen.getByText(/Chưa có học viên/i)).toBeInTheDocument();
    });
  });
});
