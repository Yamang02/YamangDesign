/**
 * P04: 스케일 선택 모달
 * E08 P01: 직접 HEX 입력 제거 — scale/step 선택에 집중
 */
import { useState, useEffect, useRef } from 'react';
import { Icon } from '../../../components';
import { Tooltip } from '../../../components';
import {
  getScaleRecommendation,
  type RecommendationLevel,
  type SemanticTokenPath,
} from '@domain/palettes/mapping/recommendations';
import type { BgStrategy, ScaleReference } from '@domain/palettes/types';
import type { GeneratedScales } from '@shared/@types/tokens';
import styles from './ScaleSelectionModal.module.css';
import { RUNTIME_COLOR_FALLBACK } from '@domain/constants/runtime-fallbacks';

const SCALES: ScaleReference['scale'][] = [
  'primary',
  'secondary',
  'accent',
  'neutral',
  'sub',
];

const STEPS: ScaleReference['step'][] = [
  50, 100, 200, 300, 400, 500, 600, 700, 800, 900,
];

function isScaleReference(
  v: string | ScaleReference
): v is ScaleReference {
  return (
    typeof v === 'object' &&
    v !== null &&
    'scale' in v &&
    'step' in v
  );
}

function RecommendationIcon({
  recommendation,
}: {
  recommendation: { level: RecommendationLevel; message?: string };
}) {
  if (recommendation.level === 'recommended') {
    return (
      <Tooltip content={recommendation.message ?? '권장 매핑'} portal position="top">
        <span className={styles.iconRecommended} aria-label="권장">
          <Icon name="check" size="sm" />
        </span>
      </Tooltip>
    );
  }
  if (recommendation.level === 'warning') {
    return (
      <Tooltip content={recommendation.message ?? '주의'} portal position="top">
        <span className={styles.iconWarning} aria-label="주의">
          <Icon name="warning" size="sm" />
        </span>
      </Tooltip>
    );
  }
  return null;
}

export interface ScaleSelectionModalProps {
  open: boolean;
  onClose: () => void;
  /** 시맨틱 토큰 경로 */
  semanticToken: SemanticTokenPath;
  /** 토큰 라벨 (표시용) */
  tokenLabel: string;
  /** 현재 값 */
  currentValue: string | ScaleReference;
  /** 스케일 (스와치 표시용) */
  scales: GeneratedScales;
  /** 배경 전략 */
  bgStrategy: BgStrategy;
  /** 선택 콜백 */
  onSelect: (value: string | ScaleReference) => void;
}

export function ScaleSelectionModal({
  open,
  onClose,
  semanticToken,
  tokenLabel,
  currentValue,
  scales,
  bgStrategy,
  onSelect,
}: ScaleSelectionModalProps) {
  const [selectedScale, setSelectedScale] = useState<ScaleReference['scale']>('neutral');
  const [selectedStep, setSelectedStep] = useState<ScaleReference['step']>(500);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    queueMicrotask(() => {
      if (isScaleReference(currentValue)) {
        setSelectedScale(currentValue.scale);
        setSelectedStep(currentValue.step);
      } else {
        setSelectedScale('neutral');
        setSelectedStep(500);
      }
    });
  }, [open, currentValue]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  const handleApply = () => {
    onSelect({ scale: selectedScale, step: selectedStep });
    onClose();
  };

  const recommendation = getScaleRecommendation(
    semanticToken,
    selectedScale,
    selectedStep,
    bgStrategy
  );

  if (!open) return null;

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="scale-selection-title"
    >
      <div
        ref={modalRef}
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        data-shell
      >
        <header className={styles.header}>
          <div className={styles.scaleHeader}>
            <h2 id="scale-selection-title" className={styles.title}>
              {tokenLabel}
            </h2>
            <RecommendationIcon recommendation={recommendation} />
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="닫기"
          >
            <Icon name="close" size="sm" />
          </button>
        </header>

        <div className={styles.content}>
          {/* Scale 선택 */}
          <section className={styles.section}>
            <label className={styles.label}>스케일</label>
            <div className={styles.scaleRow}>
              {SCALES.map((scale) => {
                const scaleData = scales[scale];
                const color = scaleData?.[500] ?? RUNTIME_COLOR_FALLBACK;
                return (
                  <button
                    key={scale}
                    type="button"
                    className={styles.scaleBtn}
                    data-active={selectedScale === scale}
                    onClick={() => setSelectedScale(scale)}
                    title={scale}
                  >
                    <span
                      className={styles.scaleSwatch}
                      style={{ backgroundColor: color }}
                    />
                    <span className={styles.scaleLabel}>{scale}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Step 선택 */}
          <section className={styles.section}>
            <label className={styles.label}>Step</label>
            <div className={styles.stepRow}>
              {STEPS.map((step) => {
                const color = scales[selectedScale]?.[step] ?? RUNTIME_COLOR_FALLBACK;
                return (
                  <button
                    key={step}
                    type="button"
                    className={styles.stepBtn}
                    data-active={selectedStep === step}
                    onClick={() => setSelectedStep(step)}
                    title={`${selectedScale}-${step}`}
                  >
                    <span
                      className={styles.stepSwatch}
                      style={{ backgroundColor: color }}
                    />
                    <span className={styles.stepLabel}>{step}</span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        <footer className={styles.footer}>
          <button
            type="button"
            className={styles.applyBtn}
            onClick={handleApply}
          >
            적용
          </button>
        </footer>
      </div>
    </div>
  );
}
