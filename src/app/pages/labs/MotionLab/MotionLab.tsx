/**
 * E20 P03: Motion Lab — duration / easing / stateLayer 시각화
 */
import { useState, useCallback } from 'react';
import { LabLayout, LabSection, LabOverview, type TocItem } from '../../../layouts';
import { duration, easing, stateLayer } from '@domain/tokens/global/motion';
import styles from './MotionLab.module.css';

type DurationKey = keyof typeof duration;
type EasingKey = keyof typeof easing;
type StateLayerKey = keyof typeof stateLayer;

const durationKeys = Object.keys(duration) as DurationKey[];
const easingKeys = Object.keys(easing) as EasingKey[];
const stateLayerKeys = Object.keys(stateLayer) as StateLayerKey[];

const tocItems: TocItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'duration', label: 'Duration' },
  { id: 'easing', label: 'Easing' },
  { id: 'state-layer', label: 'State Layer' },
];

/** cubic-bezier 파라미터를 SVG 패스로 변환 */
function CubicBezierCurve({ value, size = 56 }: Readonly<{ value: string; size?: number }>) {
  const isCubic = value.startsWith('cubic-bezier(');
  const isLinear = value === 'linear';

  let x1 = 0, y1 = 0, x2 = 1, y2 = 1;
  if (isCubic) {
    const cubicBezierRe = /cubic-bezier\(([^)]+)\)/;
    const match = cubicBezierRe.exec(value);
    if (match) {
      const [a, b, c, d] = match[1].split(',').map(Number);
      x1 = a; y1 = b; x2 = c; y2 = d;
    }
  }

  const p = size;
  const pad = 4;
  const s = p - pad * 2;

  // SVG 좌표계: y는 아래가 양수이므로 뒤집음
  const toSvg = (x: number, y: number) => ({
    x: pad + x * s,
    y: pad + (1 - y) * s,
  });

  const p0 = toSvg(0, 0);
  const p1 = toSvg(x1, y1);
  const p2 = toSvg(x2, y2);
  const p3 = toSvg(1, 1);

  const pathD = isLinear
    ? `M ${p0.x} ${p0.y} L ${p3.x} ${p3.y}`
    : `M ${p0.x} ${p0.y} C ${p1.x} ${p1.y} ${p2.x} ${p2.y} ${p3.x} ${p3.y}`;

  return (
    <svg width={p} height={p} viewBox={`0 0 ${p} ${p}`} className={styles.curveSvg}>
      {/* 격자선 */}
      <line x1={pad} y1={pad} x2={pad} y2={p - pad} className={styles.curveGrid} />
      <line x1={pad} y1={p - pad} x2={p - pad} y2={p - pad} className={styles.curveGrid} />
      {/* 컨트롤 포인트 선 */}
      {isCubic && (
        <>
          <line x1={p0.x} y1={p0.y} x2={p1.x} y2={p1.y} className={styles.curveHandle} />
          <line x1={p3.x} y1={p3.y} x2={p2.x} y2={p2.y} className={styles.curveHandle} />
          <circle cx={p1.x} cy={p1.y} r={2} className={styles.curveHandleDot} />
          <circle cx={p2.x} cy={p2.y} r={2} className={styles.curveHandleDot} />
        </>
      )}
      {/* 커브 */}
      <path d={pathD} className={styles.curvePath} />
      {/* 시작/끝점 */}
      <circle cx={p0.x} cy={p0.y} r={2.5} className={styles.curveEndDot} />
      <circle cx={p3.x} cy={p3.y} r={2.5} className={styles.curveEndDot} />
    </svg>
  );
}

/** 애니메이션 트리거: key 변경 시 재실행 */
function AnimBall({
  dur,
  eas,
  animKey,
  color,
}: Readonly<{
  dur: string;
  eas: string;
  animKey: number;
  color?: string;
}>) {
  return (
    <div className={styles.animTrack}>
      <div
        key={animKey}
        className={styles.animBall}
        style={{
          '--anim-duration': dur,
          '--anim-easing': eas,
          background: color ?? 'var(--ds-color-primary-500)',
        } as React.CSSProperties}
      />
    </div>
  );
}

const BALL_COLORS = [
  'var(--ds-color-primary-500)',
  'var(--ds-color-secondary-500, var(--ds-color-accent-500))',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
];

export function MotionLab() {
  const [replayKey, setReplayKey] = useState(0);
  const [activeDuration, setActiveDuration] = useState<DurationKey>('normal');

  const replay = useCallback(() => setReplayKey((k) => k + 1), []);

  return (
    <LabLayout title="Motion Lab" tocItems={tocItems}>
      <LabSection title="Overview" id="overview" card={false}>
        <LabOverview
          description="트랜지션의 속도와 리듬을 정의하는 토큰. duration은 얼마나 오래, easing은 어떤 궤적으로 움직이는지를 결정한다."
          items={[
            { label: '5 steps', description: 'Duration (instant ~ slower)' },
            { label: '6 curves', description: 'Easing (linear ~ expressive)' },
            { label: '5 states', description: 'State layer opacity' },
          ]}
        />
      </LabSection>

      <LabSection title="Duration" id="duration">
        <div className={styles.replayBar}>
          <span className={styles.replaySub}>동일한 easing(easeOut), 다른 duration</span>
          <button type="button" className={styles.replayBtn} onClick={replay}>
            Replay
          </button>
        </div>
        <div className={styles.durationList}>
          {durationKeys.map((key, i) => (
            <div key={key} className={styles.durationRow}>
              <span className={styles.durationKey}>{key}</span>
              <code className={styles.durationVar}>--ds-duration-{key}</code>
              <span className={styles.durationValue}>{duration[key]}</span>
              <AnimBall
                dur={duration[key]}
                eas={easing.easeOut}
                animKey={replayKey}
                color={BALL_COLORS[i % BALL_COLORS.length]}
              />
            </div>
          ))}
        </div>
      </LabSection>

      <LabSection title="Easing" id="easing">
        <div className={styles.replayBar}>
          <div className={styles.durationSelector}>
            <span className={styles.replaySub}>Duration:</span>
            {durationKeys.filter((k) => k !== 'instant').map((key) => (
              <button
                key={key}
                type="button"
                className={`${styles.durationPill} ${activeDuration === key ? styles.durationPillActive : ''}`}
                onClick={() => setActiveDuration(key)}
              >
                {key}
              </button>
            ))}
          </div>
          <button type="button" className={styles.replayBtn} onClick={replay}>
            Replay
          </button>
        </div>
        <div className={styles.easingGrid}>
          {easingKeys.map((key, i) => (
            <div key={key} className={styles.easingCard}>
              <div className={styles.easingCardHeader}>
                <CubicBezierCurve value={easing[key]} size={64} />
                <div className={styles.easingCardMeta}>
                  <span className={styles.easingKey}>{key}</span>
                  <code className={styles.easingValue}>{easing[key]}</code>
                </div>
              </div>
              <AnimBall
                dur={duration[activeDuration]}
                eas={easing[key]}
                animKey={replayKey}
                color={BALL_COLORS[i % BALL_COLORS.length]}
              />
            </div>
          ))}
        </div>
      </LabSection>

      <LabSection title="State Layer" id="state-layer">
        <p className={styles.stateLayerDesc}>
          컴포넌트 상태(hover, pressed 등)에 오버레이되는 레이어의 불투명도 값.
        </p>
        <div className={styles.stateLayerGrid}>
          {stateLayerKeys.map((key) => {
            const opacity = stateLayer[key];
            return (
              <div key={key} className={styles.stateLayerCard}>
                <div className={styles.stateLayerPreview}>
                  <div className={styles.stateLayerBase} />
                  <div
                    className={styles.stateLayerOverlay}
                    style={{ opacity }}
                  />
                </div>
                <span className={styles.stateLayerKey}>{key}</span>
                <code className={styles.stateLayerValue}>{opacity}</code>
              </div>
            );
          })}
        </div>
      </LabSection>
    </LabLayout>
  );
}
