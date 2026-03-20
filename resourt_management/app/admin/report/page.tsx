import DashboardLayout from '@/components/DashboardLayout/MainDashboard';
import Dashboard from '@/components/MainDashboard/Dashboard';

export default function AdminDashboardPage() {
  return (
    <DashboardLayout title="Reports Management">
      <Dashboard />
    </DashboardLayout>
  );
}