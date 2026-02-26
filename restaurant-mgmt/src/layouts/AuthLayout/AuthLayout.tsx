import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout: React.FC = () => {
  return (
    <div className="auth-shell">
      {/* Background glow */}
      <div className="auth-glow" />

      {/* Top gold line */}
      <div className="auth-topline" />

      {/* Page content (Login or Register) */}
      <Outlet />
    </div>
  );
};

export default AuthLayout;
