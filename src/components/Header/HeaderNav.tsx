/**
 * E02: 아이콘 기반 네비게이션 - 2단계 하이브리드
 * [Pages▾] [Components] [Labs▾] | [⚙️설정]
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
  pages: 'Pages',
  components: 'Components',
  labs: 'Labs',
};

export interface HeaderNavProps {
  activePage: string;
  onSelect: (pageId: string) => void;
}

export function HeaderNav({ activePage, onSelect }: HeaderNavProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <nav className={styles.nav} aria-label="주 메뉴" data-ui>
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
              tooltip={category.tooltip}
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
          <HeaderNavItem
            key={category.id}
            icon={icon}
            label={label}
            tooltip={category.tooltip}
            active={category.id === activePage}
            onClick={() => onSelect(category.id)}
          />
        );
      })}

      <span className={styles.divider} aria-hidden />
      <HeaderSettingsButton />
    </nav>
  );
}
