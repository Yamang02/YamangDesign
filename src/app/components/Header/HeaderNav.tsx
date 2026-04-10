/**
 * E02: 아이콘 기반 네비게이션 - 아이콘 + 메뉴명 통일
 * [layout▾] [component] [lab▾] | [playground] | [settings]
 * E21/P02: mobile hamburger toggle
 */
import { useState, useEffect } from 'react';
import { Icon } from '../Icon';
import { HeaderNavItem } from './HeaderNavItem';
import { HeaderNavDropdown } from './HeaderNavDropdown';
import { HeaderSettingsButton } from './HeaderSettingsButton';
import { navCategories } from '../../config/nav-categories';
import type { IconLibrary } from '../Icon';
import type { HeaderNavProps } from './HeaderNav.types';
import styles from './HeaderNav.module.css';

export function HeaderNav({
  activePage,
  onSelect,
  onOpenSettings,
}: Readonly<HeaderNavProps>) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [mobileOpen]);

  const handleSelect = (id: string) => {
    onSelect(id);
    setMobileOpen(false);
    setOpenDropdown(null);
  };

  return (
    <nav className={styles.nav} aria-label="주 메뉴" data-shell>
      {/* Mobile hamburger button — hidden on desktop via CSS */}
      <button
        type="button"
        className={styles.hamburger}
        onClick={() => setMobileOpen((prev) => !prev)}
        aria-label={mobileOpen ? '메뉴 닫기' : '메뉴 열기'}
        aria-expanded={mobileOpen}
        aria-controls="mobile-nav-menu"
      >
        <Icon name={mobileOpen ? 'close' : 'menu'} size="md" />
      </button>

      {/* Nav items — on mobile shown as overlay drawer when mobileOpen */}
      <div
        id="mobile-nav-menu"
        className={`${styles.navItems} ${mobileOpen ? styles.navItemsOpen : ''}`}
      >
        {navCategories.map((category) => {
          const label = category.tooltip;
          const showDividerBefore = category.id === 'labs';
          const icon = (
            <Icon
              name={category.icon}
              library={(category.iconLibrary as IconLibrary) ?? 'material'}
              size="md"
            />
          );

          if (category.items) {
            return (
              <span key={category.id} style={{ display: 'contents' }}>
                {showDividerBefore && <span className={styles.divider} aria-hidden />}
                <HeaderNavDropdown
                  icon={icon}
                  label={label}
                  items={category.items.map((item) => ({
                    id: item.id,
                    label: item.label,
                    icon: item.icon,
                    iconLibrary: item.iconLibrary,
                  }))}
                  active={category.items.some((item) => item.id === activePage)}
                  activeItemId={activePage}
                  isOpen={openDropdown === category.id}
                  onToggle={() => setOpenDropdown((prev) => (prev === category.id ? null : category.id))}
                  onSelect={handleSelect}
                />
              </span>
            );
          }

          return (
            <span key={category.id} style={{ display: 'contents' }}>
              {showDividerBefore && <span className={styles.divider} aria-hidden />}
              <HeaderNavItem
                icon={icon}
                label={label}
                active={category.id === activePage}
                onClick={() => handleSelect(category.id)}
              />
            </span>
          );
        })}

        <span className={styles.divider} aria-hidden />
        <HeaderSettingsButton onOpenSettings={onOpenSettings} />
      </div>
    </nav>
  );
}
