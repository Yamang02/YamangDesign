/**
 * E06: Tooltip - Site Style 가이드용
 * portal: true 시 document.body에 렌더링 (모달/스크롤 컨테이너 내부에서 스크롤바에 가려지지 않음)
 */
import { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { siteStyle } from '../../config/site-style';
import type { TooltipProps } from './Tooltip.types';
import styles from './Tooltip.module.css';

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
  const tooltipRef = useRef<HTMLSpanElement | null>(null);

  const updatePosition = useCallback(() => {
    const triggerEl = triggerRef.current;
    const tooltipEl = tooltipRef.current;
    if (!triggerEl) return;

    const triggerRect = triggerEl.getBoundingClientRect();
    const tooltipRect = tooltipEl?.getBoundingClientRect();
    const tooltipWidth = tooltipRect?.width ?? 0;
    const tooltipHeight = tooltipRect?.height ?? 0;
    const gap = 4;

    let top = 0;
    let left = 0;

    switch (position) {
      case 'top':
        top = triggerRect.top - gap - tooltipHeight;
        left = triggerRect.left + triggerRect.width / 2 - tooltipWidth / 2;
        break;
      case 'bottom':
        top = triggerRect.bottom + gap;
        left = triggerRect.left + triggerRect.width / 2 - tooltipWidth / 2;
        break;
      case 'left':
        top = triggerRect.top + triggerRect.height / 2 - tooltipHeight / 2;
        left = triggerRect.left - gap - tooltipWidth;
        break;
      case 'right':
        top = triggerRect.top + triggerRect.height / 2 - tooltipHeight / 2;
        left = triggerRect.right + gap;
        break;
    }

    setCoords({ top, left });
  }, [position]);

  useLayoutEffect(() => {
    if (visible && portal) {
      // 첫 렌더링 후 툴팁 크기가 측정된 후 위치 계산
      requestAnimationFrame(() => {
        requestAnimationFrame(updatePosition);
      });
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
      ref={tooltipRef}
      className={`${styles.tooltip} ${portal ? styles.portal : styles[position]}`}
      style={{
        maxWidth,
        ...(portal
          ? {
              position: 'fixed' as const,
              top: coords?.top ?? -9999,
              left: coords?.left ?? -9999,
              visibility: coords ? 'visible' : 'hidden',
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
