import React, { createContext, useContext, useState, useCallback } from 'react';

export interface User {
  id: string;
  fullName: string;
  email: string;
  username: string;
  age: number;
  plan: 'free' | 'popular' | 'premium';
  xp: number;
  streak: number;
  completedLessons: string[];
  avatar?: string;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (emailOrUsername: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  completeLesson: (lessonId: string) => void;
  addXp: (amount: number) => void;
}

interface RegisterData {
  fullName: string;
  email: string;
  username: string;
  password: string;
  age: number;
}

const AuthContext = createContext<AuthContextType | null>(null);

const USERS_KEY = 'educare_users';
const CURRENT_USER_KEY = 'educare_current_user';

function getStoredUsers(): Array<User & { password: string }> {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  } catch { return []; }
}

function storeUsers(users: Array<User & { password: string }>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(CURRENT_USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });
  const [isLoading] = useState(false);

  const login = useCallback(async (emailOrUsername: string, password: string) => {
    const users = getStoredUsers();
    const found = users.find(u => (u.email === emailOrUsername || u.username === emailOrUsername) && u.password === password);
    if (!found) return { success: false, error: 'Sai mật khẩu hoặc tài khoản không tồn tại. Vui lòng thử lại.' };
    const { password: _, ...userData } = found;
    setUser(userData);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
    return { success: true };
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    const users = getStoredUsers();
    if (users.find(u => u.email === data.email)) return { success: false, error: 'Email đã được sử dụng.' };
    if (users.find(u => u.username === data.username)) return { success: false, error: 'Username đã tồn tại.' };
    const newUser = {
      id: crypto.randomUUID(),
      ...data,
      plan: 'free' as const,
      xp: 0,
      streak: 0,
      completedLessons: [],
      isAdmin: data.email === 'admin@educare.vn',
    };
    users.push({ ...newUser, password: data.password });
    storeUsers(users);
    const { password: _, ...userData } = { ...newUser, password: data.password };
    setUser(userData);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  }, []);

  const completeLesson = useCallback((lessonId: string) => {
    setUser(prev => {
      if (!prev || prev.completedLessons.includes(lessonId)) return prev;
      const updated = { ...prev, completedLessons: [...prev.completedLessons, lessonId], xp: prev.xp + 50 };
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updated));
      // Update in users store too
      const users = getStoredUsers();
      const idx = users.findIndex(u => u.id === prev.id);
      if (idx >= 0) { users[idx] = { ...users[idx], ...updated }; storeUsers(users); }
      return updated;
    });
  }, []);

  const addXp = useCallback((amount: number) => {
    setUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, xp: prev.xp + amount };
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, completeLesson, addXp }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
