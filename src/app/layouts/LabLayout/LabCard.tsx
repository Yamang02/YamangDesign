/**
 * E08: Lab 카드 - 클릭 시 상세 패널용
 */
import { clsx } from '@shared/utils/clsx';
import styles from './LabLayout.module.css';

export interface LabCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  selected?: boolean;
}

export function LabCard({ children, onClick, selected }: Readonly<LabCardProps>) {
  const className = clsx(styles.labCard, selected && styles.selected);
  if (onClick) {
    return (
      <button type="button" className={className} onClick={onClick}>
        {children}
      </button>
    );
  }
  return <div className={className}>{children}</div>;
}
