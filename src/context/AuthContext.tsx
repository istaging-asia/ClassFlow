import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { authApi, type LoginParams } from '../api/auth';
import type { User, UserRole } from '../types/api';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isLoading: boolean;
  login: (params: LoginParams) => Promise<User>;
  logout: () => Promise<void>;
  updateUser: (updated: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('classflow_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 초기 마운트 시 토큰으로 최신 유저 정보 동기화
  useEffect(() => {
    const token = localStorage.getItem('classflow_access_token');
    if (token) {
      authApi
        .getMe()
        .then((userData) => {
          setUser(userData);
          localStorage.setItem('classflow_user', JSON.stringify(userData));
        })
        .catch(() => {
          setUser(null);
          localStorage.removeItem('classflow_access_token');
          localStorage.removeItem('classflow_user');
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (params: LoginParams): Promise<User> => {
    const tokenRes = await authApi.login(params);
    localStorage.setItem('classflow_access_token', tokenRes.access_token);
    const userData = await authApi.getMe();
    setUser(userData);
    localStorage.setItem('classflow_user', JSON.stringify(userData));
    return userData;
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };

  const updateUser = (updated: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const next = { ...prev, ...updated };
      localStorage.setItem('classflow_user', JSON.stringify(next));
      return next;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role ?? null,
        isLoading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
