/**
 * E02: 아이콘 기반 네비게이션 - 드롭다운 메뉴 아이템 (아이콘 + 메뉴명)
 */
import { useEffect, useRef } from 'react';
import { clsx } from '@shared/utils/clsx';
import { Icon } from '../Icon';
import type { HeaderNavDropdownProps } from './HeaderNavDropdown.types';
import styles from './HeaderNav.module.css';

export function HeaderNavDropdown({
  icon,
  label,
  items,
  active,
  activeItemId,
  isOpen,
  onToggle,
  onSelect,
}: Readonly<HeaderNavDropdownProps>) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSelect = (itemId: string) => {
    onSelect(itemId);
    onToggle();
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onToggle();
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onToggle();
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onToggle]);

  const trigger = (
    <button
      type="button"
      className={clsx(styles.dropdownTrigger, isOpen && styles.open, active && styles.active)}
      onClick={onToggle}
      aria-expanded={isOpen}
      aria-haspopup="menu"
    >
      <span className={styles.navItemIcon}>{icon}</span>
      <span className={styles.dropdownLabel}>{label}</span>
      <Icon name="chevron-down" size="sm" className={clsx(styles.chevron, isOpen && styles.chevronOpen)} />
    </button>
  );

  return (
    <div className={styles.dropdown} ref={containerRef}>
      {trigger}

      {isOpen && (
        <div className={styles.dropdownMenu} role="menu">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              className={clsx(styles.dropdownItem, activeItemId === item.id && styles.dropdownItemActive)}
              onClick={() => handleSelect(item.id)}
              role="menuitem"
            >
              {item.icon && <Icon name={item.icon} library={item.iconLibrary ?? 'material'} size="sm" />}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
