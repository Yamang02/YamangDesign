import type { BadgeProps } from './Badge.types';
import { clsx } from '@shared/utils/clsx';
import styles from './Badge.module.css';

export function Badge({
  variant = 'accent',
  size = 'sm',
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={clsx(styles.badge, className)}
      data-variant={variant}
      data-size={size}
    >
      {children}
    </span>
  );
}
