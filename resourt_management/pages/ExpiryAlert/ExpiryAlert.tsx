import DashboardLayout from '../../components/DashboardLayout/MainDashboard';
import { FaCalendarTimes } from 'react-icons/fa';
import './ExpiryAlert.scss';

interface ExpiryItem {
  id: string;
  name: string;
  expiryDate: string;
  isExpired: boolean;
}

const expiryItems: ExpiryItem[] = [
  {
    id: '1',
    name: 'Prawns',
    expiryDate: 'Feb 15, 2026',
    isExpired: true,
  },
  {
    id: '2',
    name: 'Tomatoes',
    expiryDate: 'Feb 12, 2026',
    isExpired: true,
  },
];

const ExpiryAlert: React.FC = () => {
  return (
    <DashboardLayout title="Expiration Alert">
      <div className="expiry-alert">
        {expiryItems.map((item) => (
          <div key={item.id} className="expiry-alert__section">
            <h3 className="expiry-alert__item-name">{item.name}</h3>
            <div className="expiry-alert__date-row">
              <FaCalendarTimes className="expiry-alert__date-icon" />
              <span className="expiry-alert__date">{item.expiryDate}</span>
            </div>

            <button
              className="expiry-alert__action-btn"
              id={`expiry-action-${item.id}`}
            >
              ACTION REQUIRED
            </button>

            <a href="#" className="expiry-alert__vendor-link">
              Check Vendor Info
            </a>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default ExpiryAlert;
