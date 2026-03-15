import type { AvatarProps } from './Avatar.types';
import { clsx } from '@shared/utils/clsx';
import styles from './Avatar.module.css';

export function Avatar({
  initials,
  src,
  alt = '',
  size = 'md',
  variant = 'secondary',
  className,
  children,
}: AvatarProps) {
  return (
    <div
      className={clsx(styles.avatar, className)}
      data-size={size}
      data-variant={src ? undefined : variant}
    >
      {src ? (
        <img src={src} alt={alt} className={styles.avatarImage} />
      ) : children ? (
        children
      ) : (
        initials
      )}
    </div>
  );
}
