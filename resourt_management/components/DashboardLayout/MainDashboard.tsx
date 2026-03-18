'use client'

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  FaTachometerAlt,
  FaBoxes,
  FaExclamationTriangle,
  FaClipboardCheck,
  FaChartBar,
  FaCog,
  FaUserCircle,
  FaSignOutAlt,
} from 'react-icons/fa';
import './MainDashboard.scss';

interface DashboardLayoutProps {
  title: string;
  headerRight?: React.ReactNode;
  children: React.ReactNode;
}

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
  { to: '/admin/inventory', label: 'Inventory', icon: <FaBoxes /> },
  { to: '/admin/expiry-alerts', label: 'Expiry Alert Tracking', icon: <FaExclamationTriangle /> },
  { to: '/admin/hygiene', label: 'Hygiene', icon: <FaClipboardCheck /> },
  { to: '/admin/orders', label: 'Reports', icon: <FaChartBar /> },
];

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  title,
  headerRight,
  children,
}) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    router.push('/admin/login');
  };

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <div className="dashboard-sidebar__top">
          <h1 className="dashboard-sidebar__logo">DineSmart</h1>

          <nav className="dashboard-sidebar__nav">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.to}
                className={`dashboard-sidebar__link ${
                  pathname === item.to ? 'dashboard-sidebar__link--active' : ''
                }`}
              >
                <span className="dashboard-sidebar__link-icon">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="dashboard-sidebar__bottom">
          <Link href="/admin/settings" className="dashboard-sidebar__link">
            <span className="dashboard-sidebar__link-icon"><FaCog /></span>
            Settings
          </Link>

          <div className="dashboard-sidebar__user">
            <FaUserCircle className="dashboard-sidebar__user-avatar" />
            <div className="dashboard-sidebar__user-info">
              <span className="dashboard-sidebar__user-name">Chef Michael</span>
              <span className="dashboard-sidebar__user-role">Head Chef</span>
            </div>
          </div>

          <button className="dashboard-sidebar__logout" onClick={handleLogout}>
            <span className="dashboard-sidebar__link-icon"><FaSignOutAlt /></span>
            Logout
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-main__header">
          <h2 className="dashboard-main__title">{title}</h2>
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