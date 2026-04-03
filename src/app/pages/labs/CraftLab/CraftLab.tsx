/**
 * E29: CraftLab — CSS/렌더링 기법 카탈로그 (DS 토큰 비교용이 아님)
 */
import { LabLayout, LabOverview, LabSection, type TocItem } from '../../../layouts';
import { BorderImageCraft } from './crafts/BorderImage';
import { PretextLayoutCraft } from './crafts/PretextLayout';
import styles from './CraftLab.module.css';

const tocItems: TocItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'border-image-slice', label: 'border-image-slice' },
  { id: 'pretext-layout', label: 'Pretext layout' },
];

export function CraftLab() {
  return (
    <LabLayout title="Craft Lab" tocItems={tocItems}>
      <LabSection title="Overview" id="overview" card={false}>
        <p className={styles.overviewDesc}>
          Design System 토큰 탐색이 아니라, 프로젝트에서 쓰는 CSS·Canvas 렌더링 기법을 모아 두는
          레퍼런스 공간이다. 각 섹션은 짧은 설명과 참고용 코드 스니펫으로 구성된다.
        </p>
        <LabOverview
          description="기법별로 독립 폴더에 자급자족하며, 레이아웃 리듬만 DS spacing 등으로 맞춘다."
          items={[
            { label: 'border-image-slice', description: 'gradient 소스 · slice · repeat · fill' },
            { label: 'Pretext', description: 'prepareWithSegments → layoutWithLines → Canvas' },
          ]}
        />
      </LabSection>

      <BorderImageCraft />
      <PretextLayoutCraft />
    </LabLayout>
  );
}
