import { Check, ArrowRight, type LucideIcon } from 'lucide-react';

const lucideIcons: Record<string, LucideIcon> = {
  Check,
  ArrowRight,
};

interface IconPlaceholderProps {
  lucide?: string;
  tabler?: string;
  hugeicons?: string;
  phosphor?: string;
  remixicon?: string;
  className?: string;
  size?: number | string;
  [key: string]: unknown;
}

export function IconPlaceholder({ lucide, className, size = 16, ...props }: IconPlaceholderProps) {
  const Icon = lucide ? lucideIcons[lucide] : undefined;

  if (!Icon) {
    return null;
  }

  return <Icon className={className} size={size} {...props} />;
}
