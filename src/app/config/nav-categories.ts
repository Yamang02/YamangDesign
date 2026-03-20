/**
 * E06 P01: Navigation 카테고리 — 3축 구조 (Labs / Build / Context / Playground)
 */
import type { IconLibrary } from '../components/Icon';

export interface NavItem {
  id: string;
  label: string;
  icon?: string;
  iconLibrary?: IconLibrary;
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
    id: 'layouts',
    icon: 'grid-view',
    iconLibrary: 'material',
    tooltip: 'Layouts',
    items: [
      { id: 'layout-landing', label: 'Landing', icon: 'home' },
      { id: 'layout-dashboard', label: 'Dashboard', icon: 'dashboard' },
      { id: 'layout-article', label: 'Article', icon: 'description' },
    ],
  },
  {
    id: 'labs',
    icon: 'science',
    iconLibrary: 'material',
    tooltip: 'Labs',
    items: [
      { id: 'palette', label: 'Palette', icon: 'palette' },
      { id: 'style', label: 'Style', icon: 'auto-awesome' },
      { id: 'font', label: 'Font', icon: 'text-fields' },
      { id: 'tokens', label: 'Tokens', icon: 'category' },
      { id: 'spacing', label: 'Spacing', icon: 'space-bar' },
      { id: 'grid', label: 'Grid', icon: 'grid-on' },
      { id: 'motion', label: 'Motion', icon: 'animation' },
    ],
  },
  {
    id: 'build',
    icon: 'widgets',
    iconLibrary: 'material',
    tooltip: 'Build',
    items: [
      { id: 'atoms', label: 'Atoms', icon: 'atom', iconLibrary: 'nucleo' },
      { id: 'molecules', label: 'Molecules', icon: 'circles-relation', iconLibrary: 'nucleo' },
      { id: 'organisms', label: 'Organisms', icon: 'auto-awesome-mosaic' },
    ],
  },
  {
    id: 'context',
    icon: 'devices',
    iconLibrary: 'material',
    tooltip: 'Context',
    items: [
      { id: 'service', label: 'Service', icon: 'browser', iconLibrary: 'nucleo' },
      { id: 'shell', label: 'Shell', icon: 'shell', iconLibrary: 'nucleo' },
    ],
  },
  {
    id: 'playground',
    icon: 'ferris-wheel',
    iconLibrary: 'nucleo',
    tooltip: 'Playground',
  },
];
