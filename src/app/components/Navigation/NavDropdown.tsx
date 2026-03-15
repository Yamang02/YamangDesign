/**
 * E08: Navigation 카테고리 드롭다운
 */
import { useEffect, useRef } from 'react';
import { clsx } from '@shared/utils/clsx';
import { Icon } from '../Icon';
import { Tooltip } from '../Tooltip';
import type { NavDropdownProps } from './NavDropdown.types';
import styles from './NavDropdown.module.css';

export function NavDropdown({
  category,
  isOpen,
  onToggle,
  onSelect,
  activeItem,
}: NavDropdownProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSelect = (itemId: string) => {
    onSelect(itemId);
    onToggle();
  };

  const handleTriggerClick = () => {
    if (category.items) {
      onToggle();
    } else {
      onSelect(category.id);
    }
  };

  const isActive = category.items
    ? category.items.some((item) => item.id === activeItem)
    : category.id === activeItem;

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

  return (
    <div className={styles.navDropdown} ref={containerRef}>
      <Tooltip content={category.tooltip}>
        <button
          type="button"
          className={clsx(styles.navTrigger, isOpen && styles.open, isActive && styles.active)}
          onClick={handleTriggerClick}
          aria-expanded={category.items ? isOpen : undefined}
          aria-haspopup={!!category.items}
        >
          <Icon
            name={category.icon}
            library={category.iconLibrary ?? 'material'}
            size="sm"
            title={category.tooltip}
          />
          {category.items && (
            <Icon name="expand-more" size="sm" className={clsx(styles.expandIcon, isOpen && styles.expandOpen)} />
          )}
        </button>
      </Tooltip>

      {category.items && isOpen && (
        <div className={styles.dropdownMenu} role="menu">
          {category.items.map((item) => (
            <button
              key={item.id}
              type="button"
              className={clsx(styles.dropdownItem, activeItem === item.id && styles.active)}
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
