import { Avatar } from '../Avatar';
import { Badge } from '../Badge';
import { Button } from '../Button';
import styles from './AdminTopBarActions.module.css';
import type { AdminTopBarActionsProps } from './AdminTopBarActions.types';

export function AdminTopBarActions({
  userDisplayName,
  userEmail,
  roleLabel,
  environmentLabel,
  avatarInitials,
  avatarNode,
  isLoggingOut = false,
  onLogout,
}: Readonly<AdminTopBarActionsProps>) {
  return (
    <div className={styles.container}>
      {environmentLabel && (
        <Badge variant="outline" size="sm" className={styles.environment}>
          {environmentLabel}
        </Badge>
      )}
      {roleLabel && <Badge variant="subtle">{roleLabel}</Badge>}
      <div className={styles.identity}>
        <div className={styles.meta}>
          <span className={styles.name}>{userDisplayName}</span>
          <span className={styles.email}>{userEmail}</span>
        </div>
        <Avatar size="sm" initials={avatarInitials}>
          {avatarNode}
        </Avatar>
      </div>
      {onLogout && (
        <Button
          variant="outline"
          size="sm"
          onClick={onLogout}
          disabled={isLoggingOut}
          className={styles.logoutButton}
        >
          {isLoggingOut ? '로그아웃 중' : '로그아웃'}
        </Button>
      )}
    </div>
  );
}
