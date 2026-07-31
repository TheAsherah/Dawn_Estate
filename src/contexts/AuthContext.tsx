import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiCall } from '@/lib/api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'client' | 'admin' | 'agent';
  avatarUrl?: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const data = await apiCall('/auth/me');
      setUser(data.user);
    } catch (error) {
      const status = (error as Error & { status?: number }).status;
      if (status !== 401 && status !== 403) {
        console.error('Auth check failed:', error);
      }
      localStorage.removeItem('dawn-estate-token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string) {
    const data = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    localStorage.setItem('dawn-estate-token', data.accessToken);
    setUser(data.user);
  }

  async function loginWithGoogle() {
    const data = await apiCall('/auth/google/url');
    if (data?.url) {
      window.location.href = data.url;
    }
  }

  async function register(registerData: RegisterData) {
    const data = await apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(registerData),
    });

    // Auto-login after registration
    await login(registerData.email, registerData.password);
  }

  async function logout() {
    localStorage.removeItem('dawn-estate-token');
    await apiCall('/auth/logout', { method: 'POST' }).catch(() => undefined);
    setUser(null);
  }

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithGoogle, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
