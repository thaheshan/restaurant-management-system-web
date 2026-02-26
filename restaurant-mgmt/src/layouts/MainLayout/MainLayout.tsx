import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/navigation/Sidebar";
import Header from "../../components/navigation/Header";
import { useAppSelector } from "../../hooks";

const MainLayout: React.FC = () => {
  const { sidebarOpen } = useAppSelector((s) => s.ui);

  return (
    <div className="app-shell">
      {/* ── Fixed sidebar ── */}
      <Sidebar />

      {/* ── Main area shifts with sidebar ── */}
      <div
        className={`main-area ${!sidebarOpen ? "sidebar-collapsed" : ""}`}
      >
        <Header />

        {/* ── Page content injected here by React Router ── */}
        <main className="page-container">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
