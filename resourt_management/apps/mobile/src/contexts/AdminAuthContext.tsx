import React, { createContext, useContext, useState, useCallback } from 'react';
import { AdminUser } from '@/types';

interface AdminAuthContextType {
  admin: AdminUser | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

// Mock credentials for demo
const DEMO_CREDENTIALS = {
  email: 'admin@dinesmart.com',
  password: 'admin123',
};

const DEMO_ADMIN: AdminUser = {
  id: 'admin-1',
  email: 'admin@dinesmart.com',
  name: 'Chef Michael',
  restaurantId: 'rest-1',
};

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    // Simulate API call
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
          setAdmin(DEMO_ADMIN);
          setIsLoggedIn(true);
          resolve();
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 500);
    });
  }, []);

  const logout = useCallback(() => {
    setAdmin(null);
    setIsLoggedIn(false);
  }, []);

  const value: AdminAuthContextType = {
    admin,
    isLoggedIn,
    login,
    logout,
  };

  return (
    <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
