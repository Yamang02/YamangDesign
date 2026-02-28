/**
 * E06: Tooltip - Site Style 가이드용
 */
import { useState, useRef, useEffect, type ReactNode } from 'react';
import { siteStyle } from '../../config/site-style';
import styles from './Tooltip.module.css';

export interface TooltipProps {
  content: ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left';
  delay?: number;
  maxWidth?: string;
  children: React.ReactElement;
}

export function Tooltip({
  content,
  position = 'top',
  delay = siteStyle.guidance.tooltipDelay,
  maxWidth = '200px',
  children,
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => setVisible(true), delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <span
      className={styles.wrapper}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {visible && (
        <span
          className={`${styles.tooltip} ${styles[position]}`}
          style={{ maxWidth }}
          role="tooltip"
        >
          {content}
        </span>
      )}
    </span>
  );
}
