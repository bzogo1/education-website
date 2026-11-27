import type { Metadata } from 'next';
import TechText from '@/components/TechText';

export const metadata: Metadata = {
  title: 'TechText Test',
};

export default function TestTechTextPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-8">
      <div className="w-full h-[400px] text-white">
        <TechText text="React Bits" color="white" accentColor="#6366f1" fontSize={120} />
      </div>
    </div>
  );
}
