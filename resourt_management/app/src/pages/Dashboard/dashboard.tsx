'use client';

import { useEffect } from 'react';
import {
  FaCheckCircle,
  FaSyncAlt,
  FaExclamationTriangle,
  FaTimesCircle,
  FaClipboardCheck,
  FaShieldAlt,
  FaBoxes,
} from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '@/app/src/store/hooks';
import { fetchDashboardData } from '@/app/src/store/slices/dashboardSlice';
import { fetchInventory } from '@/app/src/store/slices/inventorySlice';
import { fetchHygieneDashboard } from '@/app/src/store/slices/hygieneSlice';
import './dashboard.scss';

const activityColor: Record<string, string> = {
  inventory: '#2d5a3d',
  expiry: '#e74c3c',
  hygiene: '#3498db',
};

const getRestaurantId = () => {
  try {
    const session = localStorage.getItem('adminSession');
    if (session) {
      const parsed = JSON.parse(session);
      return parsed.user?.restaurantId || parsed.restaurantId || '';
    }
  } catch {}
  return '';
};

const getStatusColor = (stockLevel: string) => {
  const s = (stockLevel || '').toLowerCase();
  if (['ok', 'normal', 'fresh', 'in_stock'].includes(s)) return '#2d5a3d';
  if (['low', 'low_stock'].includes(s)) return '#e67e22';
  if (s === 'critical') return '#e74c3c';
  return '#e67e22';
};

const getStatusLabel = (stockLevel: string) => {
  const s = (stockLevel || '').toLowerCase();
  if (['ok', 'normal', 'fresh', 'in_stock'].includes(s)) return 'In Stock';
  if (['low', 'low_stock'].includes(s)) return 'Low Stock';
  if (s === 'critical') return 'Critical';
  return 'Reorder';
};

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { stats, recentActivity, loading: dashLoading } = useAppSelector(
    (state) => state.dashboard
  );
  const { items: inventoryItems } = useAppSelector((state) => state.inventory);
  const { certifications, sanitizationLogs } = useAppSelector(
    (state) => state.hygiene
  );

  useEffect(() => {
    const restaurantId = getRestaurantId();
    if (restaurantId) {
      dispatch(fetchDashboardData(restaurantId));
      dispatch(fetchInventory(restaurantId));
      dispatch(fetchHygieneDashboard(restaurantId));
    }
  }, [dispatch]);

  const summaryCards = [
    {
      label: 'Total Inventory Items',
      value: stats?.totalInventory ?? 0,
      icon: <FaBoxes />,
      color: '#2d5a3d',
    },
    {
      label: 'Reorder Required',
      value: stats?.critical ?? 0,
      icon: <FaSyncAlt />,
      color: '#e74c3c',
    },
    {
      label: 'Running Low',
      value: stats?.lowStock ?? 0,
      icon: <FaExclamationTriangle />,
      color: '#e67e22',
    },
    {
      label: 'Out of Stock',
      value: 0,
      icon: <FaTimesCircle />,
      color: '#c0392b',
    },
    {
      label: 'Hygiene Tasks Done',
      value: stats?.hygieneDone ?? 0,
      icon: <FaClipboardCheck />,
      color: '#3498db',
    },
    {
      label: 'Expiry Alerts',
      value: stats?.expiryAlerts ?? 0,
      icon: <FaExclamationTriangle />,
      color: '#e74c3c',
    },
  ];

  const inventorySnapshot = inventoryItems.slice(0, 4).map((item: any) => ({
    name: item.name,
    stock: `${parseFloat(item.quantity ?? item.stock ?? 0).toFixed(2)} ${item.unit || 'kg'}`,
    status: getStatusLabel(item.stock_level || item.status || 'ok'),
    color: getStatusColor(item.stock_level || item.status || 'ok'),
  }));

  const latestCert = certifications?.[0];
  const latestLog = sanitizationLogs?.[0];

  const builtActivity = [
    ...inventoryItems.slice(0, 2).map((item: any, i: number) => ({
      id: `inv-${i}`,
      action: `${item.name} stock tracked`,
      time: 'Recently',
      type: 'inventory' as const,
    })),
    ...(latestLog ? [{
      id: 'hyg-1',
      action: `${latestLog.session_type || 'Sanitization'} logged`,
      time: latestLog.date_logged ? new Date(latestLog.date_logged).toLocaleDateString() : 'Recently',
      type: 'hygiene' as const,
    }] : []),
    ...(latestCert ? [{
      id: 'cert-1',
      action: `${latestCert.certification_name || 'Certification'} active`,
      time: latestCert.issue_date ? new Date(latestCert.issue_date).toLocaleDateString() : 'Recently',
      type: 'hygiene' as const,
    }] : []),
  ];

  const activityToShow = builtActivity.length > 0
    ? builtActivity
    : recentActivity.length > 0
    ? recentActivity
    : [{ id: '1', action: 'No recent activity', time: '', type: 'inventory' as const }];

  return (
    <div className="dashboard">
      {dashLoading && (
        <div style={{ textAlign: 'center', padding: '20px', color: '#718096', fontSize: '0.9rem' }}>
          Loading dashboard...
        </div>
      )}

      <div className="dashboard__summary">
        {summaryCards.map((card) => (
          <div key={card.label} className="dashboard__card">
            <span className="dashboard__card-icon" style={{ color: card.color }}>{card.icon}</span>
            <div className="dashboard__card-info">
              <span className="dashboard__card-label">{card.label}</span>
              <span className="dashboard__card-value" style={{ color: card.color }}>{card.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard__bottom">
        <div className="dashboard__activity">
          <h3 className="dashboard__section-title">Recent Activity</h3>
          <div className="dashboard__activity-list">
            {activityToShow.map((item) => (
              <div key={item.id} className="dashboard__activity-item">
                <span className="dashboard__activity-dot" style={{ background: activityColor[item.type] || '#718096' }} />
                <div className="dashboard__activity-info">
                  <span className="dashboard__activity-action">{item.action}</span>
                  <span className="dashboard__activity-time">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard__snapshot">
          <h3 className="dashboard__section-title">Inventory Snapshot</h3>
          <div className="dashboard__snapshot-table-wrapper">
            {inventorySnapshot.length === 0 ? (
              <p style={{ color: '#718096', fontSize: '0.85rem', padding: '16px' }}>No inventory data yet.</p>
            ) : (
              <table className="dashboard__snapshot-table">
                <thead>
                  <tr><th>Item</th><th>Stock</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {inventorySnapshot.map((item, idx) => (
                    <tr key={idx}>
                      <td className="dashboard__snapshot-name">
                        <span>&#x1F372;</span> {item.name}
                      </td>
                      <td>{item.stock}</td>
                      <td>
                        <span className="dashboard__snapshot-badge" style={{ color: item.color, background: `${item.color}14` }}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="dashboard__hygiene">
          <h3 className="dashboard__section-title">Hygiene Status</h3>
          <div className="dashboard__hygiene-card">
            {latestCert ? (
              <>
                <div className="dashboard__hygiene-header">
                  <div>
                    <h4 className="dashboard__hygiene-name">{latestCert.certification_name || 'Certification'}</h4>
                    <span className="dashboard__hygiene-status">
                      <FaCheckCircle /> {latestCert.certification_level || 'Standard'}
                    </span>
                  </div>
                  <div className="dashboard__hygiene-badge"><FaShieldAlt /></div>
                </div>
                <div className="dashboard__hygiene-dates">
                  <div>
                    <span className="dashboard__hygiene-date-label">Issued</span>
                    <span className="dashboard__hygiene-date-value">
                      {latestCert.issue_date ? new Date(latestCert.issue_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="dashboard__hygiene-date-label">Expires</span>
                    <span className="dashboard__hygiene-date-value">
                      {latestCert.expiry_date ? new Date(latestCert.expiry_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="dashboard__hygiene-header">
                <div>
                  <h4 className="dashboard__hygiene-name">No Certification Found</h4>
                  <span className="dashboard__hygiene-status"><FaCheckCircle /> Add a certification in Hygiene</span>
                </div>
                <div className="dashboard__hygiene-badge"><FaShieldAlt /></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;