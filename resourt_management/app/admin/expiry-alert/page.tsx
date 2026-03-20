import DashboardLayout from '@/components/DashboardLayout/MainDashboard';
import ExpiryAlerts from '../../src/pages/ExpiryAlert/ExpiryAlert';

export default function AdminDashboardPage() {
  return (
    <DashboardLayout title="Expiry Alerts">
      <ExpiryAlerts />
    </DashboardLayout>
  );
}