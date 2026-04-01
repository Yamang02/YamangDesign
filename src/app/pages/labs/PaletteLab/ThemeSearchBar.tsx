/**
 * P04: 테마 검색 바
 * Debounce 300ms, 이름/설명 검색
 */
import { useState, useCallback, useRef, useEffect } from 'react';
import { Icon } from '../../../components';
import styles from './ThemeSearchBar.module.css';

export interface ThemeSearchBarProps {
  /** 검색어 (제어) */
  value: string;
  /** 검색어 변경 핸들러 (debounced) */
  onChange: (query: string) => void;
  /** Debounce 지연 (ms) */
  debounceMs?: number;
  placeholder?: string;
  /** 입력 필드 id (접근성) */
  id?: string;
}

export function ThemeSearchBar({
  value,
  onChange,
  debounceMs = 300,
  placeholder = '테마 검색...',
  id = 'theme-search',
}: Readonly<ThemeSearchBarProps>) {
  const [localValue, setLocalValue] = useState(value);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flushDebounce = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    return () => flushDebounce();
  }, [flushDebounce]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setLocalValue(next);

    flushDebounce();
    timeoutRef.current = setTimeout(() => {
      onChange(next);
      timeoutRef.current = null;
    }, debounceMs);
  };

  const handleClear = () => {
    setLocalValue('');
    flushDebounce();
    onChange('');
  };

  return (
    <div className={styles.wrapper}>
      <Icon
        name="search"
        size="sm"
        className={styles.searchIcon}
        title="검색"
      />
      <input
        id={id}
        type="search"
        className={styles.input}
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label="테마 검색"
        autoComplete="off"
      />
      {localValue && (
        <button
          type="button"
          className={styles.clearBtn}
          onClick={handleClear}
          aria-label="검색어 지우기"
        >
          <Icon name="close" size="sm" />
        </button>
      )}
    </div>
  );
}
