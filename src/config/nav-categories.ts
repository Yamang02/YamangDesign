/**
 * E08: Navigation 카테고리 설정
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
    id: 'pages',
    icon: 'layers',
    iconLibrary: 'nucleo',
    tooltip: 'Page Showcase',
    items: [
      { id: 'landing', label: 'Landing' },
      { id: 'dashboard', label: 'Dashboard' },
      { id: 'card-grid', label: 'Card Grid' },
    ],
  },
  {
    id: 'components',
    icon: 'widgets',
    iconLibrary: 'material',
    tooltip: 'Components',
    // items 없음 → 단일 페이지
  },
  {
    id: 'labs',
    icon: 'science',
    iconLibrary: 'material',
    tooltip: 'Design Labs',
    items: [
      { id: 'palette', label: 'Palette', icon: 'palette' },
      { id: 'style', label: 'Style', icon: 'auto-awesome' },
      { id: 'font', label: 'Font', icon: 'text-fields' },
      { id: 'playground', label: 'Playground', icon: 'tune' },
    ],
  },
];
