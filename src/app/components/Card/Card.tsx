import type { CardProps, CardSectionProps } from './Card.types';
import { clsx } from '@shared/utils/clsx';
import styles from './Card.module.css';

export function Card({
  variant = 'elevated',
  padding = 'none',
  hoverable = false,
  clickable = false,
  disabled = false,
  onClick,
  children,
  className,
}: Readonly<CardProps>) {
  if (clickable) {
    return (
      <button
        type="button"
        className={clsx(styles.card, className)}
        data-variant={variant}
        data-padding={padding}
        data-hoverable={hoverable || undefined}
        data-clickable
        data-disabled={disabled || undefined}
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
      >
        {children}
      </button>
    );
  }

  return (
    <div
      className={clsx(styles.card, className)}
      data-variant={variant}
      data-padding={padding}
      data-hoverable={hoverable || undefined}
      data-disabled={disabled || undefined}
    >
      {children}
    </div>
  );
}

Card.Header = function CardHeader({ children, className }: Readonly<CardSectionProps>) {
  return (
    <div className={clsx(styles.header, className)}>
      {children}
    </div>
  );
};

Card.Body = function CardBody({ children, className }: Readonly<CardSectionProps>) {
  return (
    <div className={clsx(styles.body, className)}>
      {children}
    </div>
  );
};

Card.Footer = function CardFooter({ children, className }: Readonly<CardSectionProps>) {
  return (
    <div className={clsx(styles.footer, className)}>
      {children}
    </div>
  );
};
