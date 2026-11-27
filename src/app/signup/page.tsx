import type { Metadata } from 'next';
import AuthSectionThree from '@/components/ui/auth-section-3';

export const metadata: Metadata = {
  title: 'Sign Up',
};

export default function SignupPage() {
  return <AuthSectionThree />;
}
