/**
 * E01: 헤더 레이아웃 재구성
 * AI_Portfolio 스타일 2분할 레이아웃, "야망디자인" 브랜딩
 */
import type { ReactNode } from 'react';
import styles from './Header.module.css';

export interface HeaderProps {
  children?: ReactNode;
  onLogoClick?: () => void;
}

export function Header({ children, onLogoClick }: HeaderProps) {
  return (
    <header className={styles.header} data-shell>
      <div className={styles.container}>
        <button
          type="button"
          className={styles.logo}
          onClick={onLogoClick}
          aria-label="야망디자인 홈으로 이동"
        >
          야망디자인
        </button>
        <nav className={styles.nav} aria-label="주 메뉴">
          {children}
        </nav>
      </div>
    </header>
  );
}
