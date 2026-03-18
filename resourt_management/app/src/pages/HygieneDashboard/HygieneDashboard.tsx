import DashboardLayout from '../../components/DashboardLayout/DashboardLayout';
import { FaCheckCircle, FaShieldAlt } from 'react-icons/fa';
import './HygieneDashboard.scss';

interface SanitizationEntry {
  id: string;
  task: string;
  assigned: string;
  date: string;
  time: string;
  status: 'Completed' | 'Pending' | 'In Progress';
}

const sanitizationLog: SanitizationEntry[] = [
  {
    id: '1',
    task: 'Surface Prep',
    assigned: 'Sunil',
    date: 'Jun 25, 2025',
    time: '11:50 PM',
    status: 'Completed',
  },
  {
    id: '2',
    task: 'Deep Clean',
    assigned: 'Pradeep',
    date: 'Jun 25, 2025',
    time: '12:00 PM',
    status: 'Completed',
  },
  {
    id: '3',
    task: 'Toilet Clean',
    assigned: 'Ajith',
    date: 'Jun 25, 2025',
    time: '12:00 PM',
    status: 'Completed',
  },
];

const statusColor: Record<string, string> = {
  Completed: '#2d5a3d',
  Pending: '#e67e22',
  'In Progress': '#3498db',
};

const HygieneDashboard: React.FC = () => {
  return (
    <DashboardLayout title="Hygiene & Compliance Dashboard">
      <div className="hygiene">
        {/* Certification Card */}
        <section className="hygiene__cert-section">
          <h3 className="hygiene__section-title">Food Safety Certifications</h3>

          <div className="hygiene__cert-card">
            <div className="hygiene__cert-header">
              <div className="hygiene__cert-info">
                <h4 className="hygiene__cert-name">SL Certification</h4>
                <span className="hygiene__cert-status">
                  <FaCheckCircle /> Standard / Level 4
                </span>
              </div>
              <div className="hygiene__cert-badge">
                <FaShieldAlt />
              </div>
            </div>

            <div className="hygiene__cert-dates">
              <div className="hygiene__cert-date-item">
                <span className="hygiene__cert-date-label">Issued Date</span>
                <span className="hygiene__cert-date-value">Jan 12, 2025</span>
              </div>
              <div className="hygiene__cert-date-item">
                <span className="hygiene__cert-date-label">Expiry Date</span>
                <span className="hygiene__cert-date-value">Jan 12, 2026</span>
              </div>
            </div>
          </div>
        </section>

        {/* Sanitization Log */}
        <section className="hygiene__log-section">
          <h3 className="hygiene__section-title">Recent Sanitization Log</h3>

          <div className="hygiene__log-table-wrapper">
            <table className="hygiene__log-table">
              <thead>
                <tr>
                  <th></th>
                  <th>Task</th>
                  <th>Assigned</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {sanitizationLog.map((entry) => (
                  <tr key={entry.id}>
                    <td>
                      <FaCheckCircle
                        className="hygiene__log-check"
                        style={{ color: statusColor[entry.status] }}
                      />
                    </td>
                    <td className="hygiene__log-task">{entry.task}</td>
                    <td>{entry.assigned}</td>
                    <td>{entry.date}</td>
                    <td>{entry.time}</td>
                    <td>
                      <span
                        className="hygiene__log-status"
                        style={{
                          color: statusColor[entry.status],
                          background: `${statusColor[entry.status]}14`,
                        }}
                      >
                        {entry.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default HygieneDashboard;
