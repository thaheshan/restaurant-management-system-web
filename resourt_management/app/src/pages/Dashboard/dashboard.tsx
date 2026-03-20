'use client'

import {
  FaCheckCircle,
  FaSyncAlt,
  FaExclamationTriangle,
  FaTimesCircle,
  FaClipboardCheck,
  FaShieldAlt,
  FaBoxes,
} from 'react-icons/fa';
import './dashboard.scss';

const summaryCards = [
  { label: 'Total Inventory Items', value: 9, icon: <FaBoxes />, color: '#2d5a3d' },
  { label: 'Reorder Required', value: 2, icon: <FaSyncAlt />, color: '#e74c3c' },
  { label: 'Running Low', value: 2, icon: <FaExclamationTriangle />, color: '#e67e22' },
  { label: 'Out of Stock', value: 0, icon: <FaTimesCircle />, color: '#c0392b' },
  { label: 'Hygiene Tasks Done', value: 3, icon: <FaClipboardCheck />, color: '#3498db' },
  { label: 'Expiry Alerts', value: 2, icon: <FaExclamationTriangle />, color: '#e74c3c' },
];

const recentActivity = [
  { id: '1', action: 'Chicken stock updated', time: '10 mins ago', type: 'inventory' },
  { id: '2', action: 'Prawns expiry alert triggered', time: '30 mins ago', type: 'expiry' },
  { id: '3', action: 'Surface Prep sanitization logged', time: '1 hr ago', type: 'hygiene' },
  { id: '4', action: 'Tomatoes marked Low Stock', time: '2 hrs ago', type: 'inventory' },
  { id: '5', action: 'SL Certification renewed', time: '3 hrs ago', type: 'hygiene' },
];

const activityColor: Record<string, string> = {
  inventory: '#2d5a3d',
  expiry: '#e74c3c',
  hygiene: '#3498db',
};

const inventorySnapshot = [
  { name: 'Chicken', stock: '15 kg', status: 'In Stock', color: '#2d5a3d' },
  { name: 'Prawns', stock: '4 kg', status: 'Reorder', color: '#e74c3c' },
  { name: 'Tomatoes', stock: '12 kg', status: 'Low Stock', color: '#e67e22' },
  { name: 'Spices', stock: '5 kg', status: 'Reorder', color: '#e74c3c' },
];

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">

      {/* Summary Cards */}
      <div className="dashboard__summary">
        {summaryCards.map((card) => (
          <div key={card.label} className="dashboard__card">
            <span className="dashboard__card-icon" style={{ color: card.color }}>
              {card.icon}
            </span>
            <div className="dashboard__card-info">
              <span className="dashboard__card-label">{card.label}</span>
              <span className="dashboard__card-value" style={{ color: card.color }}>
                {card.value}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard__bottom">

        {/* Recent Activity */}
        <div className="dashboard__activity">
          <h3 className="dashboard__section-title">Recent Activity</h3>
          <div className="dashboard__activity-list">
            {recentActivity.map((item) => (
              <div key={item.id} className="dashboard__activity-item">
                <span
                  className="dashboard__activity-dot"
                  style={{ background: activityColor[item.type] }}
                />
                <div className="dashboard__activity-info">
                  <span className="dashboard__activity-action">{item.action}</span>
                  <span className="dashboard__activity-time">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory Snapshot */}
        <div className="dashboard__snapshot">
          <h3 className="dashboard__section-title">Inventory Snapshot</h3>
          <div className="dashboard__snapshot-table-wrapper">
            <table className="dashboard__snapshot-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Stock</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {inventorySnapshot.map((item) => (
                  <tr key={item.name}>
                    <td className="dashboard__snapshot-name">
                      <span>🥘</span> {item.name}
                    </td>
                    <td>{item.stock}</td>
                    <td>
                      <span
                        className="dashboard__snapshot-badge"
                        style={{
                          color: item.color,
                          background: `${item.color}14`,
                        }}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Hygiene Status */}
        <div className="dashboard__hygiene">
          <h3 className="dashboard__section-title">Hygiene Status</h3>
          <div className="dashboard__hygiene-card">
            <div className="dashboard__hygiene-header">
              <div>
                <h4 className="dashboard__hygiene-name">SL Certification</h4>
                <span className="dashboard__hygiene-status">
                  <FaCheckCircle /> Standard / Level 4
                </span>
              </div>
              <div className="dashboard__hygiene-badge">
                <FaShieldAlt />
              </div>
            </div>
            <div className="dashboard__hygiene-dates">
              <div>
                <span className="dashboard__hygiene-date-label">Issued</span>
                <span className="dashboard__hygiene-date-value">Jan 12, 2025</span>
              </div>
              <div>
                <span className="dashboard__hygiene-date-label">Expires</span>
                <span className="dashboard__hygiene-date-value">Jan 12, 2026</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;