import type { ButtonProps } from './Button.types';
import { clsx } from '@shared/utils/clsx';
import styles from './Button.module.css';

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  type = 'button',
  onClick,
  children,
  className,
}: Readonly<ButtonProps>) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={clsx(styles.button, fullWidth && styles.fullWidth, className)}
      data-variant={variant}
      data-size={size}
      data-disabled={disabled || undefined}
      aria-disabled={disabled || undefined}
    >
      {children}
    </button>
  );
}
