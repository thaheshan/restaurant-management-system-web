"use client";

import { useRouter } from 'next/navigation';
import './Sidebar.scss';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  activePath: string;
  onNavigate: (path: string) => void;
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    path: 'dashboard',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
  },
  {
    label: 'Inventory',
    path: 'inventory',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
        <line x1="12" y1="22.08" x2="12" y2="12"/>
      </svg>
    ),
  },
  {
    label: 'Hygiene',
    path: 'hygiene',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
  },
  {
    label: 'Expiry Alerts',
    path: 'expiry-alert',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
  {
    label: 'Reports',
    path: 'reports',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
  },

    {
    label: 'Logs',
    path: 'reports',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
  },

      {
    label: 'Settings',
    path: 'reports',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
  },
];

const Sidebar = ({ activePath, onNavigate }: SidebarProps) => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    router.push('/admin/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <span className="sidebar__brand-name">DineSmart</span>
      </div>

      <nav className="sidebar__nav">
        {navItems.map(item => (
          <button
            key={item.path}
            className={`sidebar__nav-item ${activePath === item.path ? 'active' : ''}`}
            onClick={() => onNavigate(item.path)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
            {activePath === item.path && <span className="active-indicator" />}
          </button>
        ))}
      </nav>

      <div className="sidebar__footer">
        <div className="sidebar__user">
          <div className="user-avatar">CM</div>
          <div className="user-info">
            <span className="user-name">Chef Michael</span>
            <span className="user-role">Head Chef</span>
          </div>
        </div>
        <button className="sidebar__logout" onClick={handleLogout}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;