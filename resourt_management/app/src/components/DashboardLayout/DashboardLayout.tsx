import { NavLink, useLocation } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaBoxes,
  FaExclamationTriangle,
  FaClipboardCheck,
  FaChartBar,
  FaCog,
  FaUserCircle,
} from 'react-icons/fa';
import './DashboardLayout.scss';

interface DashboardLayoutProps {
  title: string;
  headerRight?: React.ReactNode;
  children: React.ReactNode;
}

const navItems = [
  { to: '/dashboard/inventory', label: 'Dashboard', icon: <FaTachometerAlt /> },
  { to: '/dashboard/inventory', label: 'Inventory', icon: <FaBoxes /> },
  {
    to: '/dashboard/expiry-alert',
    label: 'Expiry Alert Tracking',
    icon: <FaExclamationTriangle />,
  },
  { to: '/dashboard/hygiene', label: 'Hygiene', icon: <FaClipboardCheck /> },
  { to: '/dashboard/reports', label: 'Reports', icon: <FaChartBar /> },
];

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  title,
  headerRight,
  children,
}) => {
  const location = useLocation();

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <div className="dashboard-sidebar__top">
          <h1 className="dashboard-sidebar__logo">DineSmart</h1>

          <nav className="dashboard-sidebar__nav">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                className={() =>
                  `dashboard-sidebar__link ${
                    location.pathname === item.to
                      ? 'dashboard-sidebar__link--active'
                      : ''
                  }`
                }
              >
                <span className="dashboard-sidebar__link-icon">
                  {item.icon}
                </span>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="dashboard-sidebar__bottom">
          <NavLink to="/dashboard/settings" className="dashboard-sidebar__link">
            <span className="dashboard-sidebar__link-icon">
              <FaCog />
            </span>
            Settings
          </NavLink>

          <div className="dashboard-sidebar__user">
            <FaUserCircle className="dashboard-sidebar__user-avatar" />
            <div className="dashboard-sidebar__user-info">
              <span className="dashboard-sidebar__user-name">Chef Michael</span>
              <span className="dashboard-sidebar__user-role">Head Chef</span>
            </div>
          </div>
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
