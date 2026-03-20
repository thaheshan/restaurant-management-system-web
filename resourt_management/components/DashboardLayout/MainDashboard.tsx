"use client";

import { usePathname, useRouter } from 'next/navigation';
import Sidebar from '@/app/src/pages/sidebar/Sidebar';
import './MainDashboard.scss';

interface DashboardLayoutProps {
  title: string;
  headerBg?: string;
  headerTextColor?: string;
  headerRight?: React.ReactNode;
  children: React.ReactNode;
}

const DashboardLayout = ({ title, headerBg, headerTextColor, headerRight, children }: DashboardLayoutProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const activePath = pathname?.split('/').pop() || 'dashboard';

  const handleNavigate = (path: string) => {
    router.push(`/admin/${path}`);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar
        activePath={activePath}
        onNavigate={handleNavigate}
      />

      <main className="dashboard-main">
        <header
          className="dashboard-main__header"
          style={{ background: headerBg || '#004a35' }}
        >
          <h2
            className="dashboard-main__title"
            style={{ color: headerTextColor || '#ffffff' }}
          >
            {title}
          </h2>
          {headerRight && (
            <div className="dashboard-main__header-right">{headerRight}</div>
          )}
        </header>

        <div className="dashboard-main__content">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;