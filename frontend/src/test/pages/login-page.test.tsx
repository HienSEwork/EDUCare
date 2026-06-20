import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import LoginPage from "@/pages/LoginPage";

const mockLogin = vi.fn();
const mockNavigate = vi.fn();

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({
    user: null,
    login: mockLogin,
  }),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function renderLoginPage() {
  return render(
    <BrowserRouter>
      <LoginPage />
    </BrowserRouter>
  );
}

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders login heading", () => {
    renderLoginPage();
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("renders email and password inputs", () => {
    renderLoginPage();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders submit button", () => {
    renderLoginPage();
    const btn = screen.getByRole("button", { name: /đăng nhập|login/i });
    expect(btn).toBeInTheDocument();
  });

  it("renders register link", () => {
    renderLoginPage();
    const links = screen.getAllByRole("link");
    const hrefs = links.map((l) => l.getAttribute("href"));
    expect(hrefs.some((h) => h?.includes("register"))).toBe(true);
  });

  it("shows validation error when submitting empty form", async () => {
    renderLoginPage();
    const btn = screen.getByRole("button", { name: /đăng nhập|login/i });
    fireEvent.click(btn);
    await waitFor(() => {
      expect(mockLogin).not.toHaveBeenCalled();
    });
  });

  it("calls login with email on valid submit", async () => {
    mockLogin.mockResolvedValueOnce({ success: true, user: { isAdmin: false } });
    renderLoginPage();

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "admin@educare.vn" },
    });
    fireEvent.change(screen.getByPlaceholderText(/mật khẩu|password/i), {
      target: { value: "Admin@123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /đăng nhập|login/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("admin@educare.vn", "Admin@123");
    });
  });

  it("shows error message when login fails", async () => {
    mockLogin.mockResolvedValueOnce({ success: false, error: "Sai thông tin đăng nhập." });
    renderLoginPage();

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "wrong@email.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/mật khẩu|password/i), {
      target: { value: "wrongpass" },
    });
    fireEvent.click(screen.getByRole("button", { name: /đăng nhập|login/i }));

    await waitFor(() => {
      expect(screen.getByText(/sai thông tin/i)).toBeInTheDocument();
    });
  });
});
