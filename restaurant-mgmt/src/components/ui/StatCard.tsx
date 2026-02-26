import React from "react";
interface Props { label: string; value: string | number; icon: React.ReactNode; change?: string; positive?: boolean; color?: string; }
const StatCard: React.FC<Props> = ({ label, value, icon, change, positive, color = "var(--accent)" }) => (
  <div className="card" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span style={{ fontSize: 13, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 500 }}>{label}</span>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}15`, border: `1px solid ${color}30`, display: "flex", alignItems: "center", justifyContent: "center", color }}>{icon}</div>
    </div>
    <div>
      <div style={{ fontFamily: "Cormorant Garamond", fontSize: 36, fontWeight: 600, color: "var(--text-primary)", lineHeight: 1 }}>{value}</div>
      {change && <div style={{ fontSize: 12, color: positive ? "var(--success)" : "var(--danger)", marginTop: 6 }}>{positive ? "↑" : "↓"} {change}</div>}
    </div>
  </div>
);
export default StatCard;
