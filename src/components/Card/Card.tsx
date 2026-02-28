import type { CardProps, CardSectionProps } from './Card.types';
import { clsx } from '../../utils/clsx';
import styles from './Card.module.css';

export function Card({
  variant = 'elevated',
  padding = 'none',
  hoverable = false,
  clickable = false,
  onClick,
  children,
  className,
}: CardProps) {
  return (
    <div
      className={clsx(styles.card, className)}
      data-variant={variant}
      data-padding={padding}
      data-hoverable={hoverable || undefined}
      data-clickable={clickable || undefined}
      onClick={clickable ? onClick : undefined}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
    >
      {children}
    </div>
  );
}

Card.Header = function CardHeader({ children, className }: CardSectionProps) {
  return (
    <div className={clsx(styles.header, className)}>
      {children}
    </div>
  );
};

Card.Body = function CardBody({ children, className }: CardSectionProps) {
  return (
    <div className={clsx(styles.body, className)}>
      {children}
    </div>
  );
};

Card.Footer = function CardFooter({ children, className }: CardSectionProps) {
  return (
    <div className={clsx(styles.footer, className)}>
      {children}
    </div>
  );
};
