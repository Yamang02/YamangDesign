import type { ProfileProps } from './Profile.types';
import { clsx } from '@shared/utils/clsx';
import { Avatar } from '../Avatar';
import styles from './Profile.module.css';

export function Profile({
  initials,
  avatarSrc,
  name,
  role,
  avatarSize = 'md',
  avatarVariant = 'secondary',
  className,
  avatar,
}: Readonly<ProfileProps>) {
  return (
    <div className={clsx(styles.profile, className)}>
      {avatar ?? (
        <Avatar
          initials={initials}
          src={avatarSrc}
          size={avatarSize}
          variant={avatarVariant}
        />
      )}
      <div className={styles.info}>
        <div className={styles.name}>{name}</div>
        {role && <div className={styles.role}>{role}</div>}
      </div>
    </div>
  );
}
