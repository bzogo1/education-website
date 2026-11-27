import type { ComponentType } from 'react';
import {
  Award,
  BarChart3,
  Briefcase,
  CreditCard,
  FolderKanban,
  GraduationCap,
  Image as ImageIcon,
  Images,
  LayoutGrid,
  Mail,
  Menu,
  MousePointerClick,
  PanelBottom,
  Quote,
  Sparkles,
  Type,
  UserRound,
  Wrench,
} from 'lucide-react';

const ICONS: Record<string, ComponentType<{ size?: number | string; className?: string }>> = {
  Menu,
  Sparkles,
  BarChart3,
  UserRound,
  GraduationCap,
  Briefcase,
  FolderKanban,
  Wrench,
  Award,
  LayoutGrid,
  Type,
  Image: ImageIcon,
  Images,
  MousePointerClick,
  Quote,
  CreditCard,
  Mail,
  PanelBottom,
};

export function BlockIcon({ name, size = 15 }: { name: string; size?: number }) {
  const Icon = ICONS[name] ?? LayoutGrid;
  return <Icon size={size} />;
}
