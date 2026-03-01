/**
 * E06: Tooltip - Site Style 가이드용
 * portal: true 시 document.body에 렌더링 (모달/스크롤 컨테이너 내부에서 스크롤바에 가려지지 않음)
 */
import { useState, useRef, useEffect, useLayoutEffect, useCallback, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { siteStyle } from '../../config/site-style';
import styles from './Tooltip.module.css';

export interface TooltipProps {
  content: ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left';
  delay?: number;
  maxWidth?: string;
  /** true 시 포털로 body에 렌더링 (모달 내부 등 overflow 컨테이너에서 사용) */
  portal?: boolean;
  children: React.ReactElement;
}

export function Tooltip({
  content,
  position = 'top',
  delay = siteStyle.guidance.tooltipDelay,
  maxWidth = '200px',
  portal = false,
  children,
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRef = useRef<HTMLSpanElement | null>(null);

  const updatePosition = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const gap = 4;
    let top = 0;
    let left = rect.left + rect.width / 2;
    switch (position) {
      case 'top':
        top = rect.top - gap;
        break;
      case 'bottom':
        top = rect.bottom + gap;
        break;
      case 'left':
        top = rect.top + rect.height / 2;
        left = rect.left - gap;
        break;
      case 'right':
        top = rect.top + rect.height / 2;
        left = rect.right + gap;
        break;
    }
    requestAnimationFrame(() => setCoords({ top, left }));
  }, [position]);

  useLayoutEffect(() => {
    if (visible && portal) {
      requestAnimationFrame(updatePosition);
    }
  }, [visible, portal, updatePosition]);

  useEffect(() => {
    if (!visible || !portal) return;
    const handler = () => updatePosition();
    window.addEventListener('scroll', handler, true);
    window.addEventListener('resize', handler);
    return () => {
      window.removeEventListener('scroll', handler, true);
      window.removeEventListener('resize', handler);
    };
  }, [visible, portal, updatePosition]);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => setVisible(true), delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setVisible(false);
    setCoords(null);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const tooltipEl = visible && (
    <span
      className={`${styles.tooltip} ${styles[position]} ${portal ? styles.portal : ''}`}
      style={{
        maxWidth,
        ...(portal && coords
          ? {
              position: 'fixed' as const,
              top: coords.top,
              left: coords.left,
              transform:
                position === 'top'
                  ? 'translate(-50%, -100%)'
                  : position === 'bottom'
                    ? 'translate(-50%, 0)'
                    : position === 'left'
                      ? 'translate(-100%, -50%)'
                      : 'translate(0, -50%)',
            }
          : {}),
      }}
      role="tooltip"
    >
      {content}
    </span>
  );

  return (
    <span
      ref={triggerRef}
      className={styles.wrapper}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {portal ? (tooltipEl ? createPortal(tooltipEl, document.body) : null) : tooltipEl}
    </span>
  );
}
