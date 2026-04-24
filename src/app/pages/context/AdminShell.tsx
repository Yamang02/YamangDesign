import { LabLayout } from '../../layouts';
import { AdminShellContext } from './AdminShell/AdminShellContext';
import type { TocItem } from '../../layouts';

const tocItems: TocItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'layout-demo', label: 'Layout Demo' },
];

export function AdminShell() {
  return (
    <LabLayout title="Admin Shell" tocItems={tocItems}>
      <AdminShellContext />
    </LabLayout>
  );
}
