import React, { createContext, useContext, useState, useCallback } from "react";

const API_BASE = "https://unbrothered-gloria-noneruptive.ngrok-free.dev/api";

export interface CustomerUser {
  id: string;
  phone: string;
  email?: string;
  name: string;
}

interface CustomerAuthContextType {
  user: CustomerUser | null;
  token: string | null;
  isLoggedIn: boolean;
  signup: (email: string, name: string, phone: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  verifyOtp: (phone: string, otp: string) => Promise<void>;
  otpSent: boolean;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export const CustomerAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<CustomerUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const signup = useCallback(async (email: string, name: string, phone: string, password: string) => {
    try {
      console.log("Signing up with:", email);
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          mobile: phone,
          password,
          role: "customer",
        }),
      });
      const data = await res.json();
      console.log("Signup response:", data);
      if (data.success && data.token) {
        setToken(data.token);
        setUser({
          id: data.user?.id || "user-1",
          phone: data.user?.mobileNumber || phone,
          name: data.user?.name || name,
          email: data.user?.email || email,
        });
        setIsLoggedIn(true);
      } else {
        throw new Error(data.error || "Signup failed");
      }
    } catch (err: any) {
      console.error("Signup error:", err);
      throw new Error(err.message || "Signup failed");
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      console.log("Logging in with:", email);
      const res = await fetch(`${API_BASE}/auth/customer-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      console.log("Login response:", data);
      if (data.success && data.token) {
        setToken(data.token);
        setUser({
          id: data.user?.id,
          phone: data.user?.mobileNumber || "",
          name: data.user?.name || "Customer",
          email: data.user?.email || email,
        });
        setIsLoggedIn(true);
      } else {
        throw new Error(data.error || "Login failed");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      throw new Error(err.message || "Login failed");
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setIsLoggedIn(false);
  }, []);

  return (
    <CustomerAuthContext.Provider value={{
      user, token, isLoggedIn,
      signup, login,
      logout,
      verifyOtp: async () => {}, // No longer used
      otpSent: false, // No longer used
    }}>
      {children}
    </CustomerAuthContext.Provider>
  );
};

export const useCustomerAuth = () => {
  const context = useContext(CustomerAuthContext);
  if (context === undefined) {
    throw new Error("useCustomerAuth must be used within a CustomerAuthProvider");
  }
  return context;
};