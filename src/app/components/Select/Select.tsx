import { useState, useRef, useEffect, useCallback } from 'react';
import type { SelectProps } from './Select.types';
import { clsx } from '@shared/utils/clsx';
import styles from './Select.module.css';

export function Select({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  disabled = false,
  size = 'md',
  variant = 'outline',
  fullWidth = false,
  className,
  label,
  open,
  onOpenChange,
  triggerClassName,
}: SelectProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = open !== undefined ? open : internalOpen;

  const setOpen = (next: boolean) => {
    if (open === undefined) setInternalOpen(next);
    onOpenChange?.(next);
  };
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (disabled) return;

      switch (event.key) {
        case 'Enter':
        case ' ':
          event.preventDefault();
          if (isOpen && highlightedIndex >= 0) {
            const option = options[highlightedIndex];
            if (!option.disabled) {
              onChange(option.value);
              setOpen(false);
            }
          } else {
            setOpen(!isOpen);
          }
          break;
        case 'Escape':
          setOpen(false);
          break;
        case 'ArrowDown':
          event.preventDefault();
          if (!isOpen) {
            setOpen(true);
          } else {
            setHighlightedIndex((prev) => {
              const next = prev + 1;
              return next >= options.length ? 0 : next;
            });
          }
          break;
        case 'ArrowUp':
          event.preventDefault();
          if (isOpen) {
            setHighlightedIndex((prev) => {
              const next = prev - 1;
              return next < 0 ? options.length - 1 : next;
            });
          }
          break;
      }
    },
    [disabled, isOpen, highlightedIndex, options, onChange]
  );

  useEffect(() => {
    if (isOpen) {
      const currentIndex = options.findIndex((opt) => opt.value === value);
      queueMicrotask(() => {
        setHighlightedIndex(currentIndex >= 0 ? currentIndex : 0);
      });
    }
  }, [isOpen, options, value]);

  useEffect(() => {
    if (isOpen && listRef.current && highlightedIndex >= 0) {
      const highlightedElement = listRef.current.children[
        highlightedIndex
      ] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);

  const handleOptionClick = (optionValue: string, optionDisabled?: boolean) => {
    if (optionDisabled) return;
    onChange(optionValue);
    setOpen(false);
  };

  return (
    <div
      ref={wrapperRef}
      className={clsx(styles.wrapper, fullWidth && styles.fullWidth, className)}
    >
      {label && <label className={styles.label}>{label}</label>}

      <button
        type="button"
        className={clsx(styles.trigger, fullWidth && styles.fullWidth, triggerClassName)}
        data-size={size}
        data-variant={variant}
        data-open={isOpen || undefined}
        data-disabled={disabled || undefined}
        onClick={() => !disabled && setOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-disabled={disabled}
        disabled={disabled}
      >
        <span
          className={clsx(
            styles.selectedValue,
            !selectedOption && styles.placeholder
          )}
        >
          {selectedOption ? (
            <>
              {selectedOption.icon}
              {selectedOption.label}
            </>
          ) : (
            placeholder
          )}
        </span>
        <span className={styles.chevron} data-open={isOpen || undefined}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>

      {isOpen && (
        <ul
          ref={listRef}
          className={styles.dropdown}
          role="listbox"
          aria-activedescendant={
            highlightedIndex >= 0
              ? `option-${options[highlightedIndex]?.value}`
              : undefined
          }
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              id={`option-${option.value}`}
              className={styles.option}
              role="option"
              aria-selected={option.value === value}
              aria-disabled={option.disabled}
              data-selected={option.value === value || undefined}
              data-disabled={option.disabled || undefined}
              data-highlighted={index === highlightedIndex || undefined}
              onClick={() => handleOptionClick(option.value, option.disabled)}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              {option.icon}
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
