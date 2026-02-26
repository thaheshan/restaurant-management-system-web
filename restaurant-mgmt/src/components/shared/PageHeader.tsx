import React from "react";
interface Props { title: string; subtitle?: string; actions?: React.ReactNode; }
const PageHeader: React.FC<Props> = ({ title, subtitle, actions }) => (
  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
    <div>
      <h2 style={{ fontFamily: "Cormorant Garamond", fontSize: 30, color: "var(--text-primary)", marginBottom: subtitle ? 4 : 0 }}>{title}</h2>
      {subtitle && <p style={{ color: "var(--text-muted)", fontSize: 14 }}>{subtitle}</p>}
    </div>
    {actions && <div style={{ display: "flex", gap: 10, alignItems: "center" }}>{actions}</div>}
  </div>
);
export default PageHeader;
