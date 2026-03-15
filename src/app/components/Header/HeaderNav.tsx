/**
 * E02: 아이콘 기반 네비게이션 - 아이콘 + 메뉴명 통일
 * [layout▾] [component] [lab▾] | [playground] | [settings]
 */
import { useState } from 'react';
import { Icon } from '../Icon';
import { HeaderNavItem } from './HeaderNavItem';
import { HeaderNavDropdown } from './HeaderNavDropdown';
import { HeaderSettingsButton } from './HeaderSettingsButton';
import { navCategories } from '../../config/nav-categories';
import type { IconLibrary } from '../Icon';
import styles from './HeaderNav.module.css';

const categoryLabels: Record<string, string> = {
  labs: 'Labs',
  build: 'Build',
  context: 'Context',
  playground: 'Playground',
};

export interface HeaderNavProps {
  activePage: string;
  onSelect: (pageId: string) => void;
  /** P05: 설정 버튼 클릭 시 호출 (설정 페이지로 이동) */
  onOpenSettings?: () => void;
}

export function HeaderNav({
  activePage,
  onSelect,
  onOpenSettings,
}: HeaderNavProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <nav className={styles.nav} aria-label="주 메뉴" data-shell>
      {navCategories.map((category) => {
        const label = categoryLabels[category.id] ?? category.tooltip;
        const icon = (
          <Icon
            name={category.icon}
            library={(category.iconLibrary as IconLibrary) ?? 'material'}
            size="md"
          />
        );

        if (category.items) {
          return (
            <HeaderNavDropdown
              key={category.id}
              icon={icon}
              label={label}
              items={category.items.map((item) => ({
                id: item.id,
                label: item.label,
                icon: item.icon,
              }))}
              active={category.items.some((item) => item.id === activePage)}
              activeItemId={activePage}
              isOpen={openDropdown === category.id}
              onToggle={() => setOpenDropdown((prev) => (prev === category.id ? null : category.id))}
              onSelect={(id) => {
                onSelect(id);
                setOpenDropdown(null);
              }}
            />
          );
        }

        return (
          <span key={category.id} style={{ display: 'contents' }}>
            {category.id === 'playground' && <span className={styles.divider} aria-hidden />}
            <HeaderNavItem
              icon={icon}
              label={label}
              active={category.id === activePage}
              onClick={() => onSelect(category.id)}
            />
          </span>
        );
      })}

      <span className={styles.divider} aria-hidden />
      <HeaderSettingsButton onOpenSettings={onOpenSettings} />
    </nav>
  );
}
