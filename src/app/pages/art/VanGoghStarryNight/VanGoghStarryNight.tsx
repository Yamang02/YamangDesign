/**
 * E30: Art Reference Gallery — The Starry Night, Vincent van Gogh (1889)
 * Ch.1 원화 · Ch.2 Canvas 프레임 인상 · Ch.3 팔레트 × DS 적용
 */
import { useId, useLayoutEffect, useState, type CSSProperties } from 'react';
import { ArtShell, type ArtChapter } from '../_shared/ArtShell';
import { ArtHeroStage } from '../_shared/ArtHeroStage';
import type { LabelInfo } from '../_shared/ArtHeroStage';
import { ArtApplicationSection } from '../_shared/ArtApplicationSection';
import type {
  ArtPaletteItem,
  ArtButtonItem,
  ArtTypographyItem,
  ArtCardMeta,
} from '../_shared/ArtApplicationSection';
import { STARRY_NIGHT_PALETTE, STARRY_NIGHT_SWATCHES } from './starry-night-palette';
import {
  STARRY_NIGHT_SEAMLESS_BG_URL,
  type CanvasMotionPreference,
} from './components/StarryNightCanvasBorder';
import { StarryNightFrame } from './components/StarryNightFrame';
import styles from './VanGoghStarryNight.module.css';

const CHAPTERS: ArtChapter[] = [
  { id: 'chapter-1', number: 'Ch.1', title: 'The Painting' },
  { id: 'chapter-2', number: 'Ch.2', title: 'The Impression' },
  { id: 'chapter-3', number: 'Ch.3', title: 'The Application' },
];

const HERO_IMAGE_URL = '/art/starry-night/hero.jpg';

const STARRY_NIGHT_PALETTE_ITEMS: ArtPaletteItem[] = STARRY_NIGHT_PALETTE.map((p) => ({
  name: p.name,
  hex: p.hex,
  role: p.role,
}));

const STARRY_NIGHT_BUTTONS: ArtButtonItem[] = [
  { label: 'Primary', hex: '#1B3A8C', textHex: '#F0E8C8' },
  { label: 'Secondary', hex: '#3D2B6B', textHex: '#F0E8C8' },
  { label: 'Accent', hex: '#F5C842', textHex: '#0D1B3E' },
  { label: 'Ghost', hex: 'transparent', textHex: '#0D1B3E' },
];

const STARRY_NIGHT_TYPOGRAPHY: ArtTypographyItem[] = [
  { level: 'Display', text: 'The Starry Night', hex: '#0D1B3E' },
  {
    level: 'Body',
    text: 'I dream of painting and then I paint my dream.',
    hex: '#1A2A1A',
  },
  { level: 'Caption', text: 'Vincent van Gogh, 1889', hex: '#1B3A8C' },
];

const STARRY_NIGHT_ART_CARD: ArtCardMeta = {
  imageUrl: HERO_IMAGE_URL,
  title: 'The Starry Night',
  artist: 'Vincent van Gogh',
  year: 1889,
  movement: 'Post-Impressionism',
  styleTag: 'Post-Impressionism',
};

const STARRY_NIGHT_LABEL: LabelInfo = {
  title: 'The Starry Night',
  artist: 'Vincent van Gogh',
  medium: 'Oil on canvas',
  year: 1889,
};

const CANVAS_WIDTH_MIN = 260;
const CANVAS_WIDTH_MAX = 420;
const CANVAS_WIDTH_DEFAULT = 380;
const CANVAS_WIDTH_STEP = 4;

const BORDER_IMAGE_REPEAT_OPTIONS = [
  { value: 'stretch', label: 'stretch' },
  { value: 'repeat', label: 'repeat' },
  { value: 'round', label: 'round' },
  { value: 'space', label: 'space' },
] as const;

type BorderImageRepeatKeyword = (typeof BORDER_IMAGE_REPEAT_OPTIONS)[number]['value'];

const CANVAS_MOTION_OPTIONS: ReadonlyArray<{
  value: CanvasMotionPreference;
  label: string;
}> = [
  { value: 'system', label: 'System' },
  { value: 'full', label: 'Full' },
  { value: 'reduced', label: 'Reduced' },
];

export function VanGoghStarryNight() {
  useLayoutEffect(() => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = STARRY_NIGHT_SEAMLESS_BG_URL;
    document.head.appendChild(link);
    return () => {
      link.remove();
    };
  }, []);

  const canvasLabelId = useId();
  const canvasScaleId = useId();
  const canvasHintId = useId();
  const borderImageRepeatLabelId = useId();
  const borderImageRepeatSelectId = useId();
  const canvasMotionLabelId = useId();
  const canvasMotionSelectId = useId();
  const [canvasWidthPx, setCanvasWidthPx] = useState(CANVAS_WIDTH_DEFAULT);
  const [borderImageRepeat, setBorderImageRepeat] = useState<BorderImageRepeatKeyword>('round');
  const [canvasMotionPreference, setCanvasMotionPreference] =
    useState<CanvasMotionPreference>('full');

  const frameWrapStyleShared = {
    '--starry-frame-max-width': `${canvasWidthPx}px`,
  } as CSSProperties;

  const frameWrapStyleCss = {
    ...frameWrapStyleShared,
    '--starry-border-image-repeat': borderImageRepeat,
  } as CSSProperties;

  return (
    <div className={styles.page}>
      <ArtShell chapters={CHAPTERS}>
        <div id="chapter-1" className={styles.anchorTarget}>
          <ArtHeroStage
            imageUrl={HERO_IMAGE_URL}
            imageAlt="Vincent van Gogh — The Starry Night, 1889"
            label={STARRY_NIGHT_LABEL}
            palette={STARRY_NIGHT_SWATCHES}
            variant="minimal"
            imageObjectPosition="48% 36%"
            imageFetchPriority="high"
          />
        </div>

        <div className={styles.chapterTransition} />

        <section id="chapter-2" className={styles.chapter2}>
          <span className={styles.chapter2Label}>Chapter 2 — The Impression</span>
          <div className={styles.canvasControl}>
            <label
              id={canvasLabelId}
              className={styles.canvasControlLabel}
              htmlFor={canvasScaleId}
            >
              Canvas
            </label>
            <input
              id={canvasScaleId}
              className={styles.canvasControlRange}
              type="range"
              min={CANVAS_WIDTH_MIN}
              max={CANVAS_WIDTH_MAX}
              step={CANVAS_WIDTH_STEP}
              value={canvasWidthPx}
              onChange={(e) => {
                setCanvasWidthPx(Number(e.target.value));
              }}
              aria-valuemin={CANVAS_WIDTH_MIN}
              aria-valuemax={CANVAS_WIDTH_MAX}
              aria-valuenow={canvasWidthPx}
              aria-labelledby={canvasLabelId}
              aria-describedby={canvasHintId}
            />
            <span className={styles.canvasControlValue} aria-live="polite">
              {canvasWidthPx}px
            </span>
          </div>
          <p id={canvasHintId} className={styles.canvasControlHint}>
            Use the slider to change the preview width for both panels below.
          </p>
          <div className={styles.chapter2Compare}>
            <div className={styles.chapter2Panel}>
              <h3 className={styles.chapter2PanelTitle}>CSS border-image</h3>
              <p className={styles.chapter2PanelHint}>
                9-slice seamless PNG — compare{' '}
                <code className={styles.chapter2InlineCode}>border-image-repeat</code> keywords.
              </p>
              <div className={styles.chapter2PanelFrame} style={frameWrapStyleCss}>
                <StarryNightFrame variant="css" />
              </div>
              <div className={styles.chapter2PanelSelectRow}>
                <label
                  id={borderImageRepeatLabelId}
                  className={styles.chapter2PanelSelectLabel}
                  htmlFor={borderImageRepeatSelectId}
                >
                  Repeat
                </label>
                <select
                  id={borderImageRepeatSelectId}
                  className={styles.chapter2PanelSelect}
                  value={borderImageRepeat}
                  onChange={(e) => {
                    setBorderImageRepeat(e.target.value as BorderImageRepeatKeyword);
                  }}
                  aria-labelledby={borderImageRepeatLabelId}
                >
                  {BORDER_IMAGE_REPEAT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className={styles.chapter2Panel}>
              <h3 className={styles.chapter2PanelTitle}>Canvas wavy ring</h3>
              <p className={styles.chapter2PanelHint}>
                Procedural path: rounded corners + edge waves; texture fill + inner cut-out.
              </p>
              <div className={styles.chapter2PanelFrame} style={frameWrapStyleShared}>
                <StarryNightFrame
                  variant="canvas"
                  canvasMotionPreference={canvasMotionPreference}
                />
              </div>
              <div className={styles.chapter2PanelSelectRow}>
                <label
                  id={canvasMotionLabelId}
                  className={styles.chapter2PanelSelectLabel}
                  htmlFor={canvasMotionSelectId}
                >
                  Motion
                </label>
                <select
                  id={canvasMotionSelectId}
                  className={styles.chapter2PanelSelect}
                  value={canvasMotionPreference}
                  onChange={(e) => {
                    setCanvasMotionPreference(e.target.value as CanvasMotionPreference);
                  }}
                  aria-labelledby={canvasMotionLabelId}
                >
                  {CANVAS_MOTION_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        <div className={styles.chapterTransition} />

        <ArtApplicationSection
          palette={STARRY_NIGHT_PALETTE_ITEMS}
          buttons={STARRY_NIGHT_BUTTONS}
          typography={STARRY_NIGHT_TYPOGRAPHY}
          artCard={STARRY_NIGHT_ART_CARD}
          variant="minimal"
          sectionId="chapter-3"
        />
      </ArtShell>
    </div>
  );
}
