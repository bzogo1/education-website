import type { Metadata } from 'next';
import AuthSectionThree from '@/components/ui/auth-section-3';
import dashboardImage from '@/assets/images/dashboard.jpg';

export const metadata: Metadata = {
  title: 'Sign Up',
};

export default function SignupPage() {
  return <AuthSectionThree dashboardImageSrc={dashboardImage.src} />;
}
