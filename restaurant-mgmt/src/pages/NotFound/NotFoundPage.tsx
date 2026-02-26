import React from "react";
import { useNavigate } from "react-router-dom";
const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
      <div style={{ fontSize: 80 }}>🍽</div>
      <h1 style={{ fontFamily: "Cormorant Garamond", fontSize: 64, color: "var(--text-primary)", lineHeight: 1 }}>404</h1>
      <p style={{ color: "var(--text-muted)", fontSize: 16 }}>This page is not on the menu</p>
      <button className="btn btn-primary" onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
    </div>
  );
};
export default NotFoundPage;
