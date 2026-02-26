import React from "react";
import { HealthStatus } from "../../types";
import { getHealthStatusColor, getHealthStatusLabel } from "../../utils/helpers";
const HealthBadge: React.FC<{ status: HealthStatus }> = ({ status }) => {
  const c = getHealthStatusColor(status);
  return (
    <span className="badge" style={{ background: `${c}18`, color: c, border: `1px solid ${c}40` }}>
      <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: c, marginRight: 5 }} />
      {getHealthStatusLabel(status)}
    </span>
  );
};
export default HealthBadge;
