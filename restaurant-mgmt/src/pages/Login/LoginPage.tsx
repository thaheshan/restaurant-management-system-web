import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Loader } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { login, clearError } from "../../store/slices/authSlice";

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useAppSelector((s) => s.auth);
  const [email,    setEmail]    = useState("admin@restaurant.com");
  const [password, setPassword] = useState("admin123");
  const [show,     setShow]     = useState(false);

  useEffect(() => { if (isAuthenticated) navigate("/dashboard"); }, [isAuthenticated, navigate]);
  useEffect(() => () => { dispatch(clearError()); }, [dispatch]);

  return (
    <div style={{ width: "100%", maxWidth: 420, animation: "fadeIn .6s ease" }}>
      {/* Heading */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div style={{ width: 64, height: 64, borderRadius: 16, background: "linear-gradient(135deg,var(--accent),var(--accent-dark))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 20px", boxShadow: "0 8px 32px rgba(201,168,76,0.3)" }}>🍽</div>
        <h1 style={{ fontFamily: "Cormorant Garamond", fontSize: 42, fontWeight: 300, color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: 8 }}>
          Welcome to Restaurant
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: 15 }}>Sign in to your management dashboard</p>
      </div>

      {/* Card */}
      <div className="card" style={{ padding: 32 }}>
        <form onSubmit={(e) => { e.preventDefault(); dispatch(login({ email, password })); }} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {error && (
            <div style={{ padding: "12px 16px", borderRadius: "var(--radius-sm)", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "var(--danger)", fontSize: 13 }}>
              {error}
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" className="form-input" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@restaurant.com" required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: "relative" }}>
              <input type={show ? "text" : "password"} className="form-input" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required style={{ paddingRight: 44 }} />
              <button type="button" onClick={() => setShow(!show)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", display: "flex" }}>
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: "100%", justifyContent: "center", height: 44, marginTop: 4 }}>
            {loading && <Loader size={16} className="animate-spin" />}
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Demo accounts */}
        <div style={{ marginTop: 20, padding: 16, borderRadius: "var(--radius-sm)", background: "var(--bg-hover)", border: "1px solid var(--border)" }}>
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: ".05em" }}>Demo Accounts</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <button type="button" className="btn btn-ghost btn-sm" style={{ justifyContent: "flex-start", fontSize: 12 }} onClick={() => { setEmail("admin@restaurant.com"); setPassword("admin123"); }}>
              👑 Super Admin — admin@restaurant.com / admin123
            </button>
            <button type="button" className="btn btn-ghost btn-sm" style={{ justifyContent: "flex-start", fontSize: 12 }} onClick={() => { setEmail("manager@restaurant.com"); setPassword("manager123"); }}>
              🎯 Manager — manager@restaurant.com / manager123
            </button>
          </div>
        </div>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "var(--text-muted)" }}>
          Need an account? <Link to="/register" style={{ color: "var(--accent)", textDecoration: "none" }}>Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
