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
}: Readonly<AvatarProps>) {
  let inner: React.ReactNode;
  if (src) {
    inner = <img src={src} alt={alt} className={styles.avatarImage} />;
  } else if (children) {
    inner = children;
  } else {
    inner = initials;
  }

  return (
    <div
      className={clsx(styles.avatar, className)}
      data-size={size}
      data-variant={src ? undefined : variant}
    >
      {inner}
    </div>
  );
}
