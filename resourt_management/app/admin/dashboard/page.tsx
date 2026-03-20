import DashboardLayout from '@/components/DashboardLayout/MainDashboard';
import Dashboard from '../../src/pages/Dashboard/dashboard';

export default function AdminDashboardPage() {
  return (
    <DashboardLayout title="Dashboard" >
      <Dashboard />
    </DashboardLayout>
  );
}