import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, UtensilsCrossed, Package,
  Users, Shield, ChevronLeft, ChevronRight, LogOut,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { toggleSidebar } from "../../store/slices/uiSlice";
import { logout } from "../../store/slices/authSlice";
import { getRoleColor, getRoleDisplayName } from "../../utils/helpers";

const NAV_ITEMS = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard"      },
  { to: "/food",      icon: UtensilsCrossed, label: "Food Menu"       },
  { to: "/inventory", icon: Package,         label: "Inventory"       },
  { to: "/roles",     icon: Shield,          label: "Roles & Access"  },
  { to: "/staff",     icon: Users,           label: "Staff"           },
];

const Sidebar: React.FC = () => {
  const dispatch   = useAppDispatch();
  const navigate   = useNavigate();
  const { sidebarOpen } = useAppSelector((s) => s.ui);
  const { user }        = useAppSelector((s) => s.auth);

  return (
    <aside
      style={{
        position: "fixed", left: 0, top: 0, bottom: 0,
        width: sidebarOpen ? "var(--sidebar-width)" : "var(--sidebar-collapsed)",
        background: "var(--bg-secondary)",
        borderRight: "1px solid var(--border)",
        display: "flex", flexDirection: "column",
        transition: "width .3s ease", zIndex: 50, overflow: "hidden",
      }}
    >
      {/* Logo */}
      <div style={{ padding: "24px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12, minHeight: "var(--header-height)" }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: "linear-gradient(135deg,var(--accent),var(--accent-dark))", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 18 }}>🍽</div>
        {sidebarOpen && (
          <div>
            <div style={{ fontFamily: "Cormorant Garamond", fontSize: 18, fontWeight: 700, color: "var(--text-primary)" }}>Nuvola</div>
            <div style={{ fontSize: 11, color: "var(--accent)", textTransform: "uppercase", letterSpacing: ".1em" }}>Restaurant</div>
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => dispatch(toggleSidebar())}
        style={{ position: "absolute", right: -16, top: 80, width: 32, height: 32, borderRadius: "50%", background: "var(--bg-card)", border: "1px solid var(--border-light)", color: "var(--text-secondary)", zIndex: 10, padding: 0, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
      >
        {sidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
      </button>

      {/* Nav links */}
      <nav style={{ flex: 1, padding: "16px 12px", overflowY: "auto" }}>
        {sidebarOpen && <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 10, paddingLeft: 4 }}>Navigation</div>}
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to} to={to}
            style={({ isActive }) => ({
              display: "flex", alignItems: "center", gap: 12,
              padding: "10px 12px", borderRadius: "var(--radius-sm)",
              textDecoration: "none",
              color: isActive ? "var(--accent)" : "var(--text-secondary)",
              background: isActive ? "var(--accent-glow)" : "transparent",
              border: isActive ? "1px solid rgba(201,168,76,0.2)" : "1px solid transparent",
              marginBottom: 4, transition: "all .2s",
              fontWeight: 500, fontSize: 14,
              whiteSpace: "nowrap", overflow: "hidden",
            })}
          >
            <Icon size={18} style={{ flexShrink: 0 }} />
            {sidebarOpen && label}
          </NavLink>
        ))}
      </nav>

      {/* User + logout */}
      <div style={{ padding: "12px", borderTop: "1px solid var(--border)" }}>
        {user && (
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, borderRadius: "var(--radius-sm)", background: "var(--bg-hover)", marginBottom: 8, overflow: "hidden" }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg,${getRoleColor(user.role)},${getRoleColor(user.role)}88)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
              {user.name.charAt(0)}
            </div>
            {sidebarOpen && (
              <div style={{ overflow: "hidden", flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name}</div>
                <div style={{ fontSize: 11, color: "var(--accent)", textTransform: "uppercase", letterSpacing: ".05em" }}>{getRoleDisplayName(user.role)}</div>
              </div>
            )}
          </div>
        )}
        <button
          onClick={() => { dispatch(logout()); navigate("/login"); }}
          className="btn btn-ghost"
          style={{ width: "100%", justifyContent: sidebarOpen ? "flex-start" : "center", color: "var(--text-muted)", fontSize: 13 }}
        >
          <LogOut size={16} />{sidebarOpen && "Sign Out"}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
