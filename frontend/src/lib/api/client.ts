const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:8081/api").replace(/\/$/, "");
const TOKEN_KEY = "educare_access_token";

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function apiRequest<T>(path: string, init: RequestInit = {}) {
  const token = getStoredToken();
  const headers = new Headers(init.headers);

  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
  });

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const data = isJson ? ((await response.json()) as unknown) : null;

  if (!response.ok) {
    const message =
      typeof data === "object" && data !== null && "message" in data
        ? String((data as { message: string }).message)
        : "Request failed";

    throw new ApiError(message, response.status, data);
  }

  return data as T;
}
