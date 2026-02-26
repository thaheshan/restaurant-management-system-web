import React from "react";
import { TrendingUp, ShoppingBag, Users, AlertTriangle } from "lucide-react";
import { useAppSelector } from "../../hooks";
import { revenueChart } from "../../utils/mockData";
import { formatCurrency } from "../../utils/helpers";
import StatCard from "../../components/ui/StatCard";
import HealthBadge from "../../components/ui/HealthBadge";
import PageHeader from "../../components/shared/PageHeader";

const DashboardPage: React.FC = () => {
  const { user }  = useAppSelector((s) => s.auth);
  const alerts    = useAppSelector((s) => s.inventory.alerts);
  const food      = useAppSelector((s) => s.food.items);
  const users     = useAppSelector((s) => s.roles.users);
  const maxR      = Math.max(...revenueChart.map((d) => d.revenue));
  const topItems  = [{ name: "Burrata Caprese", count: 112 }, { name: "Truffle Risotto", count: 87 }, { name: "Chocolate Fondant", count: 95 }, { name: "Wagyu Tenderloin", count: 64 }];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <PageHeader
        title={`Good evening, ${user?.name.split(" ")[0]} 👋`}
        subtitle="Here's what's happening at your restaurant today"
        actions={<div style={{ padding: "8px 16px", background: "var(--accent-glow)", border: "1px solid rgba(201,168,76,0.3)", borderRadius: 20, fontSize: 13, color: "var(--accent)" }}>{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</div>}
      />

      {/* KPI cards */}
      <div className="grid-4">
        <StatCard label="Total Revenue" value={formatCurrency(48750)} icon={<TrendingUp size={18} />} change="12% this week" positive />
        <StatCard label="Total Orders"  value={342}                   icon={<ShoppingBag size={18} />} change="8% vs last week" positive color="var(--info)" />
        <StatCard label="Active Staff"  value={users.filter(u => u.isActive).length} icon={<Users size={18} />} color="var(--success)" />
        <StatCard label="Stock Alerts"  value={alerts.length}         icon={<AlertTriangle size={18} />} color="var(--warning)" />
      </div>

      {/* Revenue chart + top items */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
        <div className="card">
          <h3 style={{ fontFamily: "Cormorant Garamond", fontSize: 22, marginBottom: 24 }}>Weekly Revenue</h3>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 160 }}>
            {revenueChart.map((d) => (
              <div key={d.date} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <div style={{ width: "100%", height: Math.round((d.revenue / maxR) * 120) + "px", background: "linear-gradient(180deg,var(--accent) 0%,var(--accent-dark) 100%)", borderRadius: "4px 4px 0 0", opacity: .85 }} />
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{d.date}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
            <div><div style={{ fontSize: 12, color: "var(--text-muted)" }}>Total This Week</div><div style={{ fontFamily: "Cormorant Garamond", fontSize: 24, color: "var(--accent)" }}>{formatCurrency(revenueChart.reduce((s, d) => s + d.revenue, 0))}</div></div>
            <div style={{ textAlign: "right" }}><div style={{ fontSize: 12, color: "var(--text-muted)" }}>Best Day</div><div style={{ fontFamily: "Cormorant Garamond", fontSize: 24, color: "var(--text-primary)" }}>{formatCurrency(maxR)}</div></div>
          </div>
        </div>
        <div className="card">
          <h3 style={{ fontFamily: "Cormorant Garamond", fontSize: 22, marginBottom: 20 }}>Top Items</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {topItems.map((item, i) => {
              const max = Math.max(...topItems.map((x) => x.count));
              return (
                <div key={item.name}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}><span style={{ color: "var(--text-secondary)" }}>{item.name}</span><span style={{ color: "var(--accent)", fontWeight: 600 }}>{item.count}</span></div>
                  <div style={{ height: 4, background: "var(--border)", borderRadius: 2 }}><div style={{ height: "100%", width: `${(item.count / max) * 100}%`, background: i === 0 ? "var(--accent)" : "var(--text-muted)", borderRadius: 2 }} /></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Inventory alerts */}
      {alerts.length > 0 && (
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h3 style={{ fontFamily: "Cormorant Garamond", fontSize: 22 }}>⚠ Inventory Alerts</h3>
            <span className="badge" style={{ background: "rgba(239,68,68,0.1)", color: "var(--danger)", border: "1px solid rgba(239,68,68,0.3)" }}>{alerts.length} items need attention</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 16 }}>
            {alerts.map((item) => (
              <div key={item.id} style={{ padding: 16, background: "var(--bg-hover)", borderRadius: 8, border: "1px solid var(--border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}><span style={{ fontSize: 14, fontWeight: 500, color: "var(--text-primary)" }}>{item.name}</span><HealthBadge status={item.healthStatus} /></div>
                <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{item.currentStock} {item.unit} remaining</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Menu overview */}
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ fontFamily: "Cormorant Garamond", fontSize: 22 }}>Menu Overview</h3>
          <div style={{ display: "flex", gap: 16, fontSize: 13 }}><span style={{ color: "var(--success)" }}>✓ {food.filter(f => f.isAvailable).length} Available</span><span style={{ color: "var(--text-muted)" }}>✗ {food.filter(f => !f.isAvailable).length} Off Menu</span></div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 12 }}>
          {food.map((item) => (
            <div key={item.id} style={{ padding: 14, background: "var(--bg-hover)", borderRadius: 8, border: `1px solid ${item.isAvailable ? "var(--border)" : "rgba(239,68,68,0.2)"}` }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)", marginBottom: 4 }}>{item.name}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", textTransform: "capitalize" }}>{item.category.replace("_", " ")}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                <span style={{ color: "var(--accent)", fontSize: 14, fontWeight: 600 }}>${item.price}</span>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: item.isAvailable ? "var(--success)" : "var(--danger)", display: "block" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
