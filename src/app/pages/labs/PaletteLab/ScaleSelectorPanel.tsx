/**
 * P05: 스케일 선택 인라인 패널
 * 시맨틱 매핑 모달 왼쪽에 표시. 추천(✓)/경고(⚠️) 아이콘 표시
 */
import { useState } from 'react';
import { Icon } from '../../../components';
import { Tooltip } from '../../../components';
import {
  getScaleRecommendation,
  type RecommendationLevel,
  type SemanticTokenPath,
} from '@domain/palettes/mapping/recommendations';
import type { BgStrategy, ScaleReference } from '@domain/palettes/types';
import type { GeneratedScales } from '@shared/@types/tokens';
import styles from './ScaleSelectorPanel.module.css';

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

function isScaleReference(v: string | ScaleReference): v is ScaleReference {
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
  return <span className={styles.iconPlaceholder} aria-hidden />;
}

export interface ScaleSelectorPanelProps {
  semanticToken: SemanticTokenPath;
  tokenLabel: string;
  currentValue: string | ScaleReference;
  scales: GeneratedScales;
  bgStrategy: BgStrategy;
  onSelect: (value: string | ScaleReference) => void;
  onClose: () => void;
}

export function ScaleSelectorPanel({
  semanticToken,
  tokenLabel,
  currentValue,
  scales,
  bgStrategy,
  onSelect,
  onClose,
}: ScaleSelectorPanelProps) {
  const [prevCurrentValue, setPrevCurrentValue] = useState(currentValue);
  const [selectedScale, setSelectedScale] = useState<ScaleReference['scale']>(
    isScaleReference(currentValue) ? currentValue.scale : 'neutral'
  );
  const [selectedStep, setSelectedStep] = useState<ScaleReference['step']>(
    isScaleReference(currentValue) ? currentValue.step : 500
  );
  const [directHex, setDirectHex] = useState(isScaleReference(currentValue) ? '' : (currentValue || ''));
  const [useDirectColor, setUseDirectColor] = useState(!isScaleReference(currentValue));

  if (prevCurrentValue !== currentValue) {
    setPrevCurrentValue(currentValue);
    if (isScaleReference(currentValue)) {
      setSelectedScale(currentValue.scale);
      setSelectedStep(currentValue.step);
      setUseDirectColor(false);
      setDirectHex('');
    } else {
      setUseDirectColor(true);
      setDirectHex(currentValue || '');
    }
  }

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

  const canApply =
    useDirectColor
      ? directHex.trim() && /^#?[0-9A-Fa-f]{6}$/.test(
          directHex.trim().startsWith('#')
            ? directHex.trim()
            : `#${directHex.trim()}`
        )
      : true;

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.scaleHeader}>
          <h3 className={styles.title}>{tokenLabel}</h3>
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
      </div>

      <div className={styles.content}>
        <section className={styles.section}>
          <label className={styles.label}>스케일</label>
          <div className={styles.scaleList}>
            {SCALES.map((scale) => {
              const scaleData = scales[scale];
              const color = scaleData?.[500] ?? '#CCC';
              const isActive = selectedScale === scale && !useDirectColor;
              const rec = getScaleRecommendation(
                semanticToken,
                scale,
                isActive ? selectedStep : 500,
                bgStrategy
              );
              return (
                <button
                  key={scale}
                  type="button"
                  className={styles.scaleRow}
                  data-active={isActive}
                  onClick={() => {
                    setUseDirectColor(false);
                    setSelectedScale(scale);
                  }}
                >
                  <RecommendationIcon recommendation={rec} />
                  <span
                    className={styles.scaleSwatch}
                    style={{ backgroundColor: color }}
                  />
                  <span className={styles.scaleName}>{scale}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className={styles.section}>
          <label className={styles.label}>Step</label>
          <div className={styles.stepRow}>
            {STEPS.map((step) => {
              const color = scales[selectedScale]?.[step] ?? '#CCC';
              return (
                <button
                  key={step}
                  type="button"
                  className={styles.stepBtn}
                  data-active={selectedStep === step && !useDirectColor}
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

        <section className={styles.section}>
          <label className={styles.directLabel}>
            <input
              type="checkbox"
              checked={useDirectColor}
              onChange={(e) => setUseDirectColor(e.target.checked)}
            />
            직접 색상 (#HEX)
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
          disabled={!canApply}
        >
          적용
        </button>
      </footer>
    </div>
  );
}
