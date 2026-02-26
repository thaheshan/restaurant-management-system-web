import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Bell, Search, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { markAllRead } from "../../store/slices/uiSlice";
import { PAGE_TITLES } from "../../constants/navigation";

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const notifications = useAppSelector((s) => s.ui.notifications);
  const unread = notifications.filter((n) => !n.read).length;
  const [showNotif, setShowNotif] = useState(false);

  const title = PAGE_TITLES[location.pathname] ?? "Restaurant Management";

  const typeColor: Record<string, string> = {
    warning: "var(--warning)", error: "var(--danger)",
    success: "var(--success)", info: "var(--info)",
  };

  return (
    <header className="app-header">
      <h1 style={{ fontFamily: "Cormorant Garamond", fontSize: 26, fontWeight: 600 }}>
        {title}
      </h1>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Search */}
        <div style={{ position: "relative" }}>
          <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input placeholder="Search..." className="form-input" style={{ paddingLeft: 36, width: 220, height: 38, fontSize: 13 }} />
        </div>

        {/* Notifications */}
        <div style={{ position: "relative" }}>
          <button className="btn btn-ghost btn-icon" style={{ position: "relative", color: "var(--text-secondary)" }} onClick={() => setShowNotif(!showNotif)}>
            <Bell size={18} />
            {unread > 0 && (
              <span style={{ position: "absolute", top: 4, right: 4, width: 16, height: 16, borderRadius: "50%", background: "var(--danger)", color: "#fff", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {unread}
              </span>
            )}
          </button>

          {showNotif && (
            <div style={{ position: "absolute", top: "100%", right: 0, marginTop: 8, width: 340, background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: "var(--radius)", boxShadow: "var(--shadow-lg)", zIndex: 100, animation: "fadeIn .2s ease" }}>
              <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontSize: 16, fontFamily: "Cormorant Garamond" }}>Notifications</h3>
                <div style={{ display: "flex", gap: 8 }}>
                  {unread > 0 && <button className="btn btn-ghost btn-sm" onClick={() => dispatch(markAllRead())} style={{ fontSize: 12 }}>Mark all read</button>}
                  <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setShowNotif(false)}><X size={14} /></button>
                </div>
              </div>
              <div style={{ maxHeight: 300, overflowY: "auto" }}>
                {notifications.map((n) => (
                  <div key={n.id} style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", background: n.read ? "transparent" : "rgba(201,168,76,0.04)", display: "flex", gap: 12 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: typeColor[n.type], flexShrink: 0, marginTop: 6 }} />
                    <p style={{ fontSize: 13, color: n.read ? "var(--text-muted)" : "var(--text-primary)", lineHeight: 1.5 }}>{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
