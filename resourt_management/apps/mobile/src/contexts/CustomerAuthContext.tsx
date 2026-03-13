import React, { createContext, useContext, useState, useCallback } from 'react';

export interface CustomerUser {
  id: string;
  phone: string;
  email?: string;
  name: string;
}

interface CustomerAuthContextType {
  user: CustomerUser | null;
  isLoggedIn: boolean;
  signup: (phone: string, name: string, email?: string) => Promise<void>;
  login: (phone: string) => Promise<void>;
  logout: () => void;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

// Mock registered users
const MOCK_USERS: { [key: string]: CustomerUser } = {
  '9876543210': {
    id: 'user-1',
    phone: '9876543210',
    email: 'customer@example.com',
    name: 'John Doe',
  },
  '9123456789': {
    id: 'user-2',
    phone: '9123456789',
    email: 'customer2@example.com',
    name: 'Jane Smith',
  },
};

export const CustomerAuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<CustomerUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [registeredUsers, setRegisteredUsers] = useState(MOCK_USERS);

  const signup = useCallback(
    async (phone: string, name: string, email?: string) => {
      return new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          // Check if user already exists
          if (registeredUsers[phone]) {
            reject(new Error('Phone number already registered'));
            return;
          }

          // Validate phone number (10 digits)
          if (!/^\d{10}$/.test(phone)) {
            reject(new Error('Phone number must be 10 digits'));
            return;
          }

          // Create new user
          const newUser: CustomerUser = {
            id: `user-${Date.now()}`,
            phone,
            email,
            name,
          };

          setRegisteredUsers((prev) => ({ ...prev, [phone]: newUser }));
          setUser(newUser);
          setIsLoggedIn(true);
          resolve();
        }, 800);
      });
    },
    [registeredUsers]
  );

  const login = useCallback(
    async (phone: string) => {
      return new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          // Validate phone number format
          if (!/^\d{10}$/.test(phone)) {
            reject(new Error('Phone number must be 10 digits'));
            return;
          }

          const foundUser = registeredUsers[phone];
          if (!foundUser) {
            reject(new Error('Phone number not registered. Please sign up first.'));
            return;
          }

          setUser(foundUser);
          setIsLoggedIn(true);
          resolve();
        }, 500);
      });
    },
    [registeredUsers]
  );

  const logout = useCallback(() => {
    setUser(null);
    setIsLoggedIn(false);
  }, []);

  const value: CustomerAuthContextType = {
    user,
    isLoggedIn,
    signup,
    login,
    logout,
  };

  return (
    <CustomerAuthContext.Provider value={value}>{children}</CustomerAuthContext.Provider>
  );
};

export const useCustomerAuth = () => {
  const context = useContext(CustomerAuthContext);
  if (context === undefined) {
    throw new Error('useCustomerAuth must be used within a CustomerAuthProvider');
  }
  return context;
};
