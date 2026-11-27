import type { Metadata } from 'next';
import BuilderDashboard from '@/components/builder/BuilderDashboard';

export const metadata: Metadata = {
  title: 'Workspace',
  description: 'Build and manage your student portfolio.',
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  return <BuilderDashboard />;
}
