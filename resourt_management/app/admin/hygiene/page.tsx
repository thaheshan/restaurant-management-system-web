import DashboardLayout from '@/components/DashboardLayout/MainDashboard';
import HygieneDashboard from '../../src/pages/HygieneDashboard/HygieneDashboard';

export default function AdminDashboardPage() {
  return (
    <DashboardLayout title="Hygiene Management">
      <HygieneDashboard />
    </DashboardLayout>
  );
}