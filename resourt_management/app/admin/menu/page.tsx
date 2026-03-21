import DashboardLayout from '@/components/DashboardLayout/MainDashboard';
import MenuManagement from '@/app/src/pages/MenuManagement/MenuManagement';

export default function MenuPage() {
  return (
    <DashboardLayout title="Menu Management">
      <MenuManagement />
    </DashboardLayout>
  );
}