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
    icon: 'auto-awesome-mosaic',
    iconLibrary: 'material',
    tooltip: 'layout',
    items: [
      { id: 'landing', label: 'Landing' },
      { id: 'dashboard', label: 'Dashboard' },
      { id: 'card-grid', label: 'Card Grid' },
    ],
  },
  {
    id: 'components',
    icon: 'category',
    iconLibrary: 'material',
    tooltip: 'component',
  },
  {
    id: 'labs',
    icon: 'science',
    iconLibrary: 'material',
    tooltip: 'lab',
    items: [
      { id: 'palette', label: 'Palette', icon: 'palette' },
      { id: 'style', label: 'Style', icon: 'auto-awesome' },
      { id: 'font', label: 'Font', icon: 'text-fields' },
    ],
  },
  {
    id: 'playground',
    icon: 'tune',
    iconLibrary: 'material',
    tooltip: 'playground',
  },
];
