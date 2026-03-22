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
  signup: (phone: string, name: string, email?: string) => Promise<void>;
  login: (phone: string) => Promise<void>;
  verifyOtp: (phone: string, otp: string) => Promise<void>;
  logout: () => void;
  otpSent: boolean;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export const CustomerAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<CustomerUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const signup = useCallback(async (phone: string, name: string, email?: string) => {
    try {
      console.log("Signing up with:", API_BASE, phone);
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          mobile: phone,
          email: email || "",
          password: phone,
          role: "customer",
        }),
      });
      const data = await res.json();
      console.log("Signup response:", data);
      if (data.success && data.token) {
        setToken(data.token);
        setUser({
          id: data.user?.id || "user-1",
          phone,
          name: data.user?.name || name,
          email: data.user?.email || email || "",
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

  const login = useCallback(async (phone: string) => {
    try {
      console.log("Sending OTP to:", phone);
      const res = await fetch(`${API_BASE}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobileNumber: phone }),
      });
      const data = await res.json();
      console.log("Send OTP response:", data);
      if (data.success || data.otp) {
        setOtpSent(true);
        console.log("OTP:", data.otp);
      } else {
        throw new Error(data.error || "Failed to send OTP");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      throw new Error(err.message || "Failed to send OTP");
    }
  }, []);

  const verifyOtp = useCallback(async (phone: string, otp: string) => {
    try {
      const res = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobileNumber: phone, otp }),
      });
      const data = await res.json();
      console.log("Verify OTP response:", data);
      if (data.success && data.token) {
        setToken(data.token);
        setUser({
          id: data.user?.id || "user-1",
          phone,
          name: data.user?.name || "Customer",
          email: data.user?.email || "",
        });
        setIsLoggedIn(true);
        setOtpSent(false);
      } else {
        throw new Error(data.error || "Invalid OTP");
      }
    } catch (err: any) {
      console.error("Verify OTP error:", err);
      throw new Error(err.message || "OTP verification failed");
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setIsLoggedIn(false);
    setOtpSent(false);
  }, []);

  return (
    <CustomerAuthContext.Provider value={{
      user, token, isLoggedIn,
      signup, login, verifyOtp,
      logout, otpSent,
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