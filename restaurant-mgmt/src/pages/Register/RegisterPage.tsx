import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAppDispatch } from "../../hooks";
import { loginSuccess } from "../../store/slices/authSlice";
import { addUser } from "../../store/slices/rolesSlice";
import { UserRole } from "../../types";
import { generateId } from "../../utils/helpers";

const ROLES: { value: UserRole; label: string }[] = [
  { value: "manager",        label: "Manager"         },
  { value: "chef",           label: "Head Chef"       },
  { value: "waiter",         label: "Waiter"          },
  { value: "inventory_staff",label: "Inventory Staff" },
];

const RegisterPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [err,  setErr]  = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "manager" as UserRole });
  const ch = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { setErr("All fields are required"); return; }
    const u = { id: generateId(), name: form.name, email: form.email, role: form.role, isActive: true, createdAt: new Date().toISOString() };
    dispatch(addUser({ name: form.name, email: form.email, role: form.role, isActive: true }));
    dispatch(loginSuccess({ user: u, token: `token_${Date.now()}` }));
    navigate("/dashboard");
  };

  return (
    <div style={{ width: "100%", maxWidth: 440, animation: "fadeIn .6s ease" }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>🍽</div>
        <h1 style={{ fontFamily: "Cormorant Garamond", fontSize: 36, color: "var(--text-primary)" }}>Create Account</h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 8 }}>Join the restaurant management team</p>
      </div>
      <div className="card" style={{ padding: 32 }}>
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {err && <div style={{ padding: "12px 16px", borderRadius: 8, background: "rgba(239,68,68,0.1)", color: "var(--danger)", fontSize: 13 }}>{err}</div>}
          <div className="form-group"><label className="form-label">Full Name</label><input name="name"  type="text"  className="form-input" value={form.name}  onChange={ch} placeholder="Alessandro Romano" /></div>
          <div className="form-group"><label className="form-label">Email Address</label><input name="email" type="email" className="form-input" value={form.email} onChange={ch} placeholder="you@restaurant.com" /></div>
          <div className="form-group"><label className="form-label">Role</label>
            <select name="role" className="form-select" value={form.role} onChange={ch}>
              {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </div>
          <div className="form-group"><label className="form-label">Password</label>
            <div style={{ position: "relative" }}>
              <input name="password" type={show ? "text" : "password"} className="form-input" value={form.password} onChange={ch} placeholder="Min. 8 characters" style={{ paddingRight: 44 }} />
              <button type="button" onClick={() => setShow(!show)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", display: "flex" }}>
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center", height: 44, marginTop: 4 }}>Create Account</button>
        </form>
        <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "var(--text-muted)" }}>
          Already have an account? <Link to="/login" style={{ color: "var(--accent)", textDecoration: "none" }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
