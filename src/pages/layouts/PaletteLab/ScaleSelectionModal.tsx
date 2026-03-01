/**
 * P04: 스케일 선택 모달
 * 시맨틱 토큰 매핑 편집 - scale/step 또는 직접 HEX 선택
 */
import { useState, useEffect, useRef } from 'react';
import { Icon } from '../../../components';
import { Tooltip } from '../../../components';
import {
  getScaleRecommendation,
  type RecommendationLevel,
  type SemanticTokenPath,
} from '../../../palettes/mapping/recommendations';
import type { BgStrategy, ScaleReference } from '../../../palettes/types';
import type { GeneratedScales } from '../../../@types/tokens';
import styles from './ScaleSelectionModal.module.css';

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
  const [directHex, setDirectHex] = useState('');
  const [useDirectColor, setUseDirectColor] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    queueMicrotask(() => {
      if (isScaleReference(currentValue)) {
        setSelectedScale(currentValue.scale);
        setSelectedStep(currentValue.step);
        setUseDirectColor(false);
        setDirectHex('');
      } else {
        setUseDirectColor(true);
        setDirectHex(currentValue || '');
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
    if (useDirectColor && directHex.trim()) {
      const hex = directHex.trim().startsWith('#')
        ? directHex.trim()
        : `#${directHex.trim()}`;
      if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
        onSelect(hex);
      }
    } else if (!useDirectColor) {
      onSelect({ scale: selectedScale, step: selectedStep });
    }
    onClose();
  };

  const recommendation = !useDirectColor
    ? getScaleRecommendation(semanticToken, selectedScale, selectedStep, bgStrategy)
    : { level: 'neutral' as RecommendationLevel };

  const resolvedColor = useDirectColor
    ? directHex.trim().startsWith('#')
      ? directHex.trim()
      : directHex.trim()
        ? `#${directHex.trim()}`
        : null
    : scales[selectedScale]?.[selectedStep] ?? null;

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
        data-ui-light
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
                const color = scaleData?.[500] ?? '#ccc';
                return (
                  <button
                    key={scale}
                    type="button"
                    className={styles.scaleBtn}
                    data-active={selectedScale === scale && !useDirectColor}
                    onClick={() => {
                      setUseDirectColor(false);
                      setSelectedScale(scale);
                    }}
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
                const color = scales[selectedScale]?.[step] ?? '#ccc';
                return (
                  <button
                    key={step}
                    type="button"
                    className={styles.stepBtn}
                    data-active={
                      selectedStep === step && !useDirectColor
                    }
                    onClick={() => {
                      setUseDirectColor(false);
                      setSelectedStep(step);
                    }}
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

          {/* Direct Color */}
          <section className={styles.section}>
            <label className={styles.directLabel}>
              <input
                type="checkbox"
                checked={useDirectColor}
                onChange={(e) => setUseDirectColor(e.target.checked)}
              />
              직접 색상 입력 (#HEX)
            </label>
            {useDirectColor && (
              <div className={styles.hexRow}>
                <span className={styles.hexPrefix}>#</span>
                <input
                  type="text"
                  className={styles.hexInput}
                  value={directHex.replace(/^#/, '')}
                  onChange={(e) =>
                    setDirectHex(
                      e.target.value.replace(/[^0-9A-Fa-f]/g, '').slice(0, 6)
                    )
                  }
                  placeholder="FFFFFF"
                  aria-label="HEX 색상 코드"
                />
                {resolvedColor && (
                  <span
                    className={styles.hexPreview}
                    style={{ backgroundColor: resolvedColor }}
                  />
                )}
              </div>
            )}
          </section>
        </div>

        <footer className={styles.footer}>
          <button
            type="button"
            className={styles.applyBtn}
            onClick={handleApply}
            disabled={
              useDirectColor &&
              (!directHex.trim() || !/^#?[0-9A-Fa-f]{6}$/.test(
                directHex.trim().startsWith('#')
                  ? directHex.trim()
                  : `#${directHex.trim()}`
              ))
            }
          >
            적용
          </button>
        </footer>
      </div>
    </div>
  );
}
