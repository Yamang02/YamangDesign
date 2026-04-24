import type { ReactNode } from 'react';

export interface AdminModalTemplateProps {
  isOpen: boolean;
  title: string;
  children: ReactNode;
  isLoading?: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel: () => void;
}
