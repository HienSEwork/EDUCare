import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { ApiError, apiRequest, clearStoredToken, getStoredToken, setStoredToken } from "@/lib/api/client";
import type { AuthResponse, MeResponse, ProgressResponse, User } from "@/types/api";

interface RegisterData {
  fullName: string;
  email: string;
  username: string;
  password: string;
  age: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (login: string, password: string) => Promise<{ success: boolean; error?: string; user?: User }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string; user?: User }>;
  logout: () => void;
  completeLesson: (lessonId: string) => Promise<void>;
  addXp: (amount: number) => Promise<void>;
  refreshUser: () => Promise<void>;
  syncUser: (nextUser: User | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function getErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    return error.message;
  }

  return "Co loi xay ra. Vui long thu lai.";
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const syncUser = useCallback((nextUser: User | null) => {
    setUser(nextUser);
  }, []);

  const logout = useCallback(() => {
    clearStoredToken();
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const token = getStoredToken();

    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const response = await apiRequest<MeResponse>("/auth/me");
      setUser(response.user);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        clearStoredToken();
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  const login = useCallback(async (loginValue: string, password: string) => {
    try {
      const response = await apiRequest<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          login: loginValue,
          password,
        }),
      });

      setStoredToken(response.token);
      setUser(response.user);
      return { success: true, user: response.user };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    try {
      const response = await apiRequest<AuthResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      });

      setStoredToken(response.token);
      setUser(response.user);
      return { success: true, user: response.user };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  }, []);

  const completeLesson = useCallback(
    async (lessonId: string) => {
      if (!user) {
        return;
      }

      try {
        const response = await apiRequest<ProgressResponse>(`/progress/lessons/${lessonId}/complete`, {
          method: "POST",
        });
        setUser(response.user);
      } catch (error) {
        console.error("Failed to complete lesson", error);
      }
    },
    [user],
  );

  const addXp = useCallback(
    async (amount: number) => {
      if (!user) {
        return;
      }

      try {
        const response = await apiRequest<ProgressResponse>("/progress/xp", {
          method: "POST",
          body: JSON.stringify({ amount }),
        });
        setUser(response.user);
      } catch (error) {
        console.error("Failed to add XP", error);
      }
    },
    [user],
  );

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, completeLesson, addXp, refreshUser, syncUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
