/**
 * E21 P04: Responsive Lab — viewport simulator for layout previews
 */
import { useState } from 'react';
import { LabLayout, LabSection, LabOverview, type TocItem } from '../../../layouts';
import { LayoutDashboard } from '../../layouts/LayoutDashboard';
import { LayoutArticle } from '../../layouts/LayoutArticle';
import { LayoutLanding } from '../../layouts/LayoutLanding';
import styles from './ResponsiveLab.module.css';

type LayoutId = 'dashboard' | 'article' | 'landing';
type ViewportPreset = { id: string; label: string; width: number };

const LAYOUT_OPTIONS: { id: LayoutId; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'article', label: 'Article' },
  { id: 'landing', label: 'Landing' },
];

const VIEWPORT_PRESETS: ViewportPreset[] = [
  { id: 'mobile', label: 'Mobile', width: 375 },
  { id: 'tablet', label: 'Tablet', width: 768 },
  { id: 'desktop', label: 'Desktop', width: 1280 },
];

const tocItems: TocItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'simulator', label: 'Simulator' },
];

export function ResponsiveLab() {
  const [activeLayout, setActiveLayout] = useState<LayoutId>('dashboard');
  const [activePreset, setActivePreset] = useState<ViewportPreset>(VIEWPORT_PRESETS[2]);

  const renderLayout = () => {
    switch (activeLayout) {
      case 'dashboard':
        return <LayoutDashboard />;
      case 'article':
        return <LayoutArticle />;
      case 'landing':
        return <LayoutLanding />;
    }
  };

  return (
    <LabLayout title="Responsive Lab" tocItems={tocItems}>
      <LabSection title="Overview" id="overview" card={false}>
        <LabOverview
          description="레이아웃 프리뷰를 다양한 뷰포트 너비에서 시뮬레이션한다. CSS width + overflow: hidden 방식으로 모바일/태블릿/데스크탑 환경을 재현한다."
          items={[
            { label: '375px', description: '모바일 뷰포트' },
            { label: '768px', description: '태블릿 뷰포트' },
            { label: '1280px', description: '데스크탑 뷰포트' },
          ]}
        />
      </LabSection>

      <LabSection title="Simulator" id="simulator">
        <div className={styles.controls}>
          <div className={styles.controlGroup}>
            <span className={styles.controlLabel}>Layout</span>
            <div className={styles.buttonRow}>
              {LAYOUT_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  className={`${styles.tab} ${activeLayout === opt.id ? styles.tabActive : ''}`}
                  onClick={() => setActiveLayout(opt.id)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.controlGroup}>
            <span className={styles.controlLabel}>Viewport</span>
            <div className={styles.buttonRow}>
              {VIEWPORT_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  className={`${styles.tab} ${activePreset.id === preset.id ? styles.tabActive : ''}`}
                  onClick={() => setActivePreset(preset)}
                >
                  {preset.label} {preset.width}px
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.viewportLabel}>
          <span className={styles.viewportPx}>{activePreset.width}px</span>
          <span className={styles.viewportName}>— {activePreset.label}</span>
        </div>

        <div className={styles.previewOuter}>
          <div
            className={styles.previewContainer}
            style={{ width: activePreset.width, maxWidth: '100%' }}
          >
            {renderLayout()}
          </div>
        </div>
      </LabSection>
    </LabLayout>
  );
}
