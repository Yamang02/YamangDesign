/**
 * E05 P05: Playground 패널 — 패널별 테마 적용 + Brand/System 컬럼 의도 구분
 */
import { Button, Card, Input } from '../../../components';
import { sampleText, buttonLabels, inputPlaceholders, semanticPreviews } from '@app/content/lab-content';
import { getThemeVariables, getSystemColorVariables } from '@domain/constants';
import { fontFamily } from '@domain/tokens/global/typography';
import type { PlaygroundPanel } from './types';
import styles from './Playground.module.css';

function getThemeVarsForPanel(panel: PlaygroundPanel): React.CSSProperties {
  return {
    ...getThemeVariables(panel.palette, panel.style, panel.neutralPreset),
    ...getSystemColorVariables(panel.systemPreset),
  } as React.CSSProperties;
}

function getFontFamily(panel: PlaygroundPanel): string {
  return panel.font === 'sans' ? fontFamily.sans : fontFamily.mono;
}

function PanelHeader({ panel }: { panel: PlaygroundPanel }) {
  return (
    <header className={styles.panelHeader}>
      <h3 className={styles.panelHeaderTitle}>{panel.label}</h3>
      <p className={styles.panelHeaderDescription}>{panel.description}</p>
    </header>
  );
}

function PanelContent({ variant }: { variant: 'brand' | 'system' }) {
  if (variant === 'brand') {
    return (
      <>
        <section className={styles.previewSection}>
          <h3 className={styles.previewSectionTitle}>Typography</h3>
          <p className={styles.previewPageTitle}>{semanticPreviews['page-title']}</p>
          <p className={styles.previewSectionSubtitle}>
            {semanticPreviews['section-title']}
          </p>
          <p className={styles.previewBody}>{sampleText.pangram.en}</p>
        </section>

        <section className={styles.previewSection}>
          <h3 className={styles.previewSectionTitle}>Buttons</h3>
          <div className={styles.previewRow}>
            <Button variant="primary">{buttonLabels.primary}</Button>
            <Button variant="secondary">{buttonLabels.secondary}</Button>
            <Button variant="ghost">{buttonLabels.ghost}</Button>
          </div>
        </section>

        <section className={styles.previewSection}>
          <h3 className={styles.previewSectionTitle}>Form Elements</h3>
          <Input placeholder={inputPlaceholders.input} />
        </section>

        <section className={styles.previewSection}>
          <h3 className={styles.previewSectionTitle}>Card</h3>
          <Card padding="md">
            <h4
              style={{
                margin: '0 0 var(--ds-spacing-2) 0',
                fontSize: 'var(--ds-text-lg)',
                fontWeight: 'var(--ds-font-weight-semibold)',
                color: 'var(--ds-color-text-primary)',
              }}
            >
              Card Title
            </h4>
            <p
              style={{
                margin: 0,
                fontSize: 'var(--ds-text-sm)',
                color: 'var(--ds-color-text-primary)',
              }}
            >
              Card content with the selected combination applied.
            </p>
            <div className={styles.cardAction}>
              <Button variant="primary" size="sm">
                Action
              </Button>
            </div>
          </Card>
        </section>

        <section className={styles.previewSection}>
          <h3 className={styles.previewSectionTitle}>Neutral Scale</h3>
          <div className={styles.neutralSwatch}>
            {[100, 300, 500, 700, 900].map((step) => (
              <div
                key={step}
                className={styles.neutralSwatchItem}
                style={{ backgroundColor: `var(--ds-color-neutral-${step})` }}
                title={`neutral-${step}`}
              />
            ))}
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <section className={styles.previewSection}>
        <h3 className={styles.previewSectionTitle}>Typography</h3>
        <p className={styles.previewBody} style={{ color: 'var(--sys-color-error)' }}>
          Error text
        </p>
        <p
          className={styles.previewBody}
          style={{ color: 'var(--sys-color-warning)' }}
        >
          Warning text
        </p>
        <p
          className={styles.previewBody}
          style={{ color: 'var(--sys-color-success)' }}
        >
          Success text
        </p>
        <p className={styles.previewBody} style={{ color: 'var(--sys-color-info)' }}>
          Info text
        </p>
      </section>

      <section className={styles.previewSection}>
        <h3 className={styles.previewSectionTitle}>Form Elements</h3>
        <Input
          placeholder={inputPlaceholders.input}
          isError
          errorMessage="입력값을 확인해 주세요"
        />
      </section>

      <section className={styles.previewSection}>
        <h3 className={styles.previewSectionTitle}>Status</h3>
        <div className={styles.statusRow}>
          <span
            className={styles.statusChip}
            style={{ color: 'var(--sys-color-error)' }}
          >
            Error
          </span>
          <span
            className={styles.statusChip}
            style={{ color: 'var(--sys-color-warning)' }}
          >
            Warning
          </span>
          <span
            className={styles.statusChip}
            style={{ color: 'var(--sys-color-success)' }}
          >
            Success
          </span>
          <span
            className={styles.statusChip}
            style={{ color: 'var(--sys-color-info)' }}
          >
            Info
          </span>
        </div>
      </section>

      <section className={styles.previewSection}>
        <h3 className={styles.previewSectionTitle}>Card</h3>
        <Card padding="md">
          <h4
            style={{
              margin: '0 0 var(--ds-spacing-2) 0',
              fontSize: 'var(--ds-text-lg)',
              fontWeight: 'var(--ds-font-weight-semibold)',
              color: 'var(--ds-color-text-primary)',
            }}
          >
            System Message
          </h4>
          <p
            style={{
              margin: 0,
              fontSize: 'var(--ds-text-sm)',
              color: 'var(--sys-color-error)',
            }}
          >
            Error: 입력값을 확인해 주세요
          </p>
          <div className={styles.cardAction}>
            <Button variant="primary" size="sm">
              Retry
            </Button>
          </div>
        </Card>
      </section>
    </>
  );
}

export function PreviewPanel({
  panel,
  variant,
}: {
  panel: PlaygroundPanel;
  variant: 'brand' | 'system';
}) {
  return (
    <div className={styles.panel}>
      <PanelHeader panel={panel} />
      <div
        className={`${styles.previewContainer} ${variant === 'system' ? styles.previewContainerSystem : ''}`}
        style={{
          ...getThemeVarsForPanel(panel),
          fontFamily: getFontFamily(panel),
        }}
      >
        <PanelContent variant={variant} />
      </div>
    </div>
  );
}
