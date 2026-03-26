import DashboardLayout from '@/components/DashboardLayout/MainDashboard';
import QRGenerator from '@/app/src/pages/QRGenerator/QRGenerator';

export default function QRCodePage() {
  return (
    <DashboardLayout title="QR Code Generator">
      <QRGenerator />
    </DashboardLayout>
  );
}