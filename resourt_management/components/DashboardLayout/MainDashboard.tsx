"use client";

import { usePathname, useRouter } from 'next/navigation';
import Sidebar from '@/app/src/pages/sidebar/Sidebar';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
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
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
          style={{ background: headerBg || 'var(--header-bg, #004a35)' }}
        >
          <h2
            className="dashboard-main__title"
            style={{ color: headerTextColor || 'var(--header-text, #ffffff)' }}
          >
            {title}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: 'auto' }}>
            {mounted && (
              <button 
                className="btn-theme-toggle" 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                aria-label="Toggle Theme"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: headerTextColor || 'var(--header-text, #ffffff)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '8px',
                  borderRadius: '50%',
                  transition: 'background 0.3s'
                }}
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            )}
            {headerRight && (
              <div className="dashboard-main__header-right">{headerRight}</div>
            )}
          </div>
        </header>

        <div className="dashboard-main__content">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;