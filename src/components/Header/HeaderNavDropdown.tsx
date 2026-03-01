/**
 * E02: 아이콘 기반 네비게이션 - 드롭다운 메뉴 아이템
 */
import { useEffect, useRef, type ReactNode } from 'react';
import { clsx } from '../../utils/clsx';
import { Icon } from '../Icon';
import { Tooltip } from '../Tooltip';
import styles from './HeaderNav.module.css';

export interface HeaderNavDropdownItem {
  id: string;
  label: string;
  icon?: string;
}

export interface HeaderNavDropdownProps {
  icon: ReactNode;
  label: string;
  tooltip?: string;
  items: HeaderNavDropdownItem[];
  active?: boolean;
  activeItemId?: string;
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (itemId: string) => void;
}

export function HeaderNavDropdown({
  icon,
  label,
  tooltip,
  items,
  active,
  activeItemId,
  isOpen,
  onToggle,
  onSelect,
}: HeaderNavDropdownProps) {
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
      <Tooltip content={tooltip ?? label} position="bottom">
        {trigger}
      </Tooltip>

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
              {item.icon && <Icon name={item.icon} size="sm" />}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
