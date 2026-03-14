/**
 * 스케일 스텝별 추천 용도 가이드
 * ColorUsageDiagram과 동일한 섹션 구조 사용
 */
import type { ColorScale } from '../../../@types/tokens';
import { SCALE_STEP_GUIDES, type ScaleStep } from '../../../constants';
import styles from './ScaleGuide.module.css';

interface ScaleGuideProps {
  /** 현재 선택된 팔레트의 primary 스케일 (시각화용) */
  primaryScale?: ColorScale;
}

export function ScaleGuide({ primaryScale }: ScaleGuideProps) {
  return (
    <div className={styles.section}>
      <h4 className={styles.sectionTitle}>
        스케일 스텝 가이드
        <span className={styles.sectionHint}> (50-900)</span>
      </h4>
      <div className={styles.stepList}>
        {SCALE_STEP_GUIDES.map((guide) => {
          const step = guide.step as ScaleStep;
          const color = primaryScale?.[step];

          return (
            <div key={guide.step} className={styles.stepRow}>
              <div
                className={styles.colorSwatch}
                style={{ backgroundColor: color ?? `var(--ds-color-primary-${guide.step})` }}
              />
              <span className={styles.stepNumber}>{guide.step}</span>
              <div className={styles.stepInfo}>
                <span className={styles.usage}>{guide.usage}</span>
                <span className={styles.usageEn}>{guide.usageEn}</span>
              </div>
              <div className={styles.examples}>
                {guide.examples.map((ex) => (
                  <span key={ex} className={styles.usageTag}>
                    {ex}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
