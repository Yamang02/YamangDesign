/**
 * E06 P06: Context — Service
 * DS 테마가 적용된 서비스 UI 미리보기 (Controls + Page Preview + Component Set).
 */
import { LabLayout } from '../../layouts';
import { ServiceContext } from './Service/ServiceContext';
import type { TocItem } from '../../layouts';

const tocItems: TocItem[] = [
  { id: 'controls', label: 'Controls' },
  { id: 'page-preview', label: 'Page Preview' },
  { id: 'component-set', label: 'Component Set' },
];

export function Service() {
  return (
    <LabLayout title="Service" subtitle="서비스 UI 결과물 미리보기" tocItems={tocItems}>
      <ServiceContext />
    </LabLayout>
  );
}
