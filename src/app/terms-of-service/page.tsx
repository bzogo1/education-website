import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  robots: { index: false },
};

export default function TermsOfServicePage() {
  return (
    <div className="content-container py-12 lg:py-20">
      <h1 className="block-title mb-6">Terms of Service</h1>
      <p className="text-secondaryText mb-6 text-base leading-relaxed">
        Welcome to Tailcast. By creating an account and using our services, you agree to these terms
        of service.
      </p>
      <h2 className="content-title mb-3">Account Registration</h2>
      <p className="text-secondaryText mb-6 text-base leading-relaxed">
        You must provide accurate information when registering. You are responsible for maintaining
        the confidentiality of your account credentials.
      </p>
      <h2 className="content-title mb-3">Acceptable Use</h2>
      <p className="text-secondaryText mb-6 text-base leading-relaxed">
        You agree to use the platform lawfully and not to misuse any features or content made
        available through the service.
      </p>
      <h2 className="content-title mb-3">Changes to These Terms</h2>
      <p className="text-secondaryText mb-6 text-base leading-relaxed">
        We may update these terms from time to time. Continued use of the service constitutes
        acceptance of the updated terms.
      </p>
      <h2 className="content-title mb-3">Contact Us</h2>
      <p className="text-secondaryText text-base leading-relaxed">
        Questions about these terms? Reach us at mailto:bzogovic7@gmail.com
      </p>
    </div>
  );
}
