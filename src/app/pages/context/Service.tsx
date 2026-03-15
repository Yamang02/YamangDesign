/**
 * E06 P06: Context — Service
 * E08 P02: 실제 서비스 페이지 목업에 집중 (Landing / Dashboard / Article). Component Set 제거.
 */
import { LabLayout } from '../../layouts';
import { ServiceContext } from './Service/ServiceContext';
import type { TocItem } from '../../layouts';

const tocItems: TocItem[] = [
  { id: 'controls', label: 'Controls' },
  { id: 'page-preview', label: 'Page Preview' },
];

export function Service() {
  return (
    <LabLayout title="Service" subtitle="서비스 UI 결과물 미리보기" tocItems={tocItems}>
      <ServiceContext />
    </LabLayout>
  );
}
