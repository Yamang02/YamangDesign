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

export function LabCard({ children, onClick, selected }: LabCardProps) {
  return (
    <div
      className={clsx(styles.labCard, selected && styles.selected)}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {children}
    </div>
  );
}
