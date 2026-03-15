/**
 * E06 P01: Navigation 카테고리 — 3축 구조 (Labs / Build / Context / Playground)
 */
import type { IconLibrary } from '../components/Icon';

export interface NavItem {
  id: string;
  label: string;
  icon?: string;
}

export interface NavCategory {
  id: string;
  icon: string;
  iconLibrary?: IconLibrary;
  tooltip: string;
  items?: NavItem[];
}

export const navCategories: NavCategory[] = [
  {
    id: 'labs',
    icon: 'science',
    iconLibrary: 'material',
    tooltip: 'Labs',
    items: [
      { id: 'palette', label: 'Palette', icon: 'palette' },
      { id: 'style', label: 'Style', icon: 'auto-awesome' },
      { id: 'font', label: 'Font', icon: 'text-fields' },
      { id: 'tokens', label: 'Tokens', icon: 'view-module' },
    ],
  },
  {
    id: 'build',
    icon: 'widgets',
    iconLibrary: 'material',
    tooltip: 'Build',
    items: [
      { id: 'atoms', label: 'Atoms', icon: 'circle' },
      { id: 'molecules', label: 'Molecules', icon: 'donut-small' },
      { id: 'organisms', label: 'Organisms', icon: 'grid-view' },
    ],
  },
  {
    id: 'context',
    icon: 'frame-inspect',
    iconLibrary: 'material',
    tooltip: 'Context',
    items: [
      { id: 'service', label: 'Service', icon: 'phone-iphone' },
      { id: 'shell', label: 'Shell', icon: 'desktop-windows' },
    ],
  },
  {
    id: 'playground',
    icon: 'tune',
    iconLibrary: 'material',
    tooltip: 'Playground',
  },
];
