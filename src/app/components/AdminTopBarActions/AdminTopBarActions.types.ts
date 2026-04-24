import type { ReactNode } from 'react';

export interface AdminTopBarActionsProps {
  userDisplayName: string;
  userEmail: string;
  roleLabel?: string;
  environmentLabel?: string;
  avatarInitials?: string;
  avatarNode?: ReactNode;
  isLoggingOut?: boolean;
  onLogout?: () => void;
}
