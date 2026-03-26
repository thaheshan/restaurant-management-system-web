import DashboardLayout from '@/components/DashboardLayout/MainDashboard';
import Settings from '@/app/src/pages/Settings/Settings';

export default function SettingsPage() {
  return (
    <DashboardLayout title="Settings">
      <Settings />
    </DashboardLayout>
  );
}