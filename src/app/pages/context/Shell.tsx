/**
 * E06 P06: Context — Shell
 * 앱 크롬(Header/Nav/Footer)을 디자인 아티팩트로 시각화.
 */
import { LabLayout } from '../../layouts';
import { ShellContext } from './Shell/ShellContext';
import type { TocItem } from '../../layouts';

const tocItems: TocItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'token-map', label: 'Token Map' },
  { id: 'live-preview', label: 'Live Preview' },
];

export function Shell() {
  return (
    <LabLayout title="Shell" tocItems={tocItems}>
      <ShellContext />
    </LabLayout>
  );
}
