import type { Metadata } from 'next';
import TechText from '@/components/TechText';

export const metadata: Metadata = {
  title: 'TechText Test',
};

export default function TestTechTextPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-8">
      <div className="h-[400px] w-full text-white">
        <TechText text="React Bits" color="white" accentColor="#6366f1" fontSize={120} />
      </div>
    </div>
  );
}
