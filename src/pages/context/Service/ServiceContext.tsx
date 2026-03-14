/**
 * E06 P06: Context — Service
 * DS 테마가 적용된 서비스 UI 미리보기. Controls + Page Preview + Component Set.
 */
import { useState } from 'react';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Input,
  Select,
} from '../../../components';
import { LabSection } from '../../../layouts';
import {
  getThemeVariables,
  getSystemColorVariables,
  getNeutralPresetVariables,
  comparisonPresets,
  MOLECULES,
  ORGANISMS,
} from '../../../constants';
import { landingHero } from '../../../constants/landing-content';
import { fontFamily } from '../../../tokens/global/typography';
import type { PaletteName, StyleName, SystemPresetName } from '../../../@types/theme';
import type { NeutralPresetName } from '../../../tokens/global/neutral-presets';
import styles from './ServiceContext.module.css';

type FontKey = 'sans' | 'mono';

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const paletteOptions = comparisonPresets.palettes.map((p) => ({
  value: p,
  label: capitalize(p),
}));
const systemPresetOptions = comparisonPresets.systemPresets.map((s) => ({
  value: s,
  label: capitalize(s),
}));
const neutralPresetOptions = comparisonPresets.neutralPresets.map((n) => ({
  value: n,
  label: capitalize(n),
}));
const styleOptions = comparisonPresets.styles.map((s) => ({
  value: s,
  label: capitalize(s),
}));
const fontOptions = [
  { value: 'sans' as const, label: 'Sans' },
  { value: 'mono' as const, label: 'Mono' },
];

export function ServiceContext() {
  const [palette, setPalette] = useState<PaletteName>(comparisonPresets.palettes[0]);
  const [systemPreset, setSystemPreset] = useState<SystemPresetName>(
    comparisonPresets.systemPresets[0]
  );
  const [neutralPreset, setNeutralPreset] = useState<NeutralPresetName>(
    comparisonPresets.neutralPresets[0]
  );
  const [style, setStyle] = useState<StyleName>(comparisonPresets.styles[0]);
  const [font, setFont] = useState<FontKey>('sans');

  const themeVars = {
    ...getThemeVariables(palette, style),
    ...getSystemColorVariables(systemPreset),
    ...getNeutralPresetVariables(neutralPreset),
  };
  const fontFamilyValue = font === 'sans' ? fontFamily.sans : fontFamily.mono;

  return (
    <div className={styles.wrapper}>
      <LabSection title="Controls" id="controls" card>
        <div className={styles.selectRow}>
          <Select
            label="Palette (Brand)"
            options={paletteOptions}
            value={palette}
            onChange={(v) => setPalette(v as PaletteName)}
            placeholder="Palette 선택"
          />
          <Select
            label="System"
            options={systemPresetOptions}
            value={systemPreset}
            onChange={(v) => setSystemPreset(v as SystemPresetName)}
            placeholder="System 선택"
          />
          <Select
            label="Neutral"
            options={neutralPresetOptions}
            value={neutralPreset}
            onChange={(v) => setNeutralPreset(v as NeutralPresetName)}
            placeholder="Neutral 선택"
          />
          <Select
            label="Style"
            options={styleOptions}
            value={style}
            onChange={(v) => setStyle(v as StyleName)}
            placeholder="Style 선택"
          />
          <Select
            label="Font"
            options={fontOptions}
            value={font}
            onChange={(v) => setFont(v as FontKey)}
            placeholder="Font 선택"
          />
        </div>
      </LabSection>

      <LabSection title="Page Preview" id="page-preview" card>
        <p style={{ margin: '0 0 var(--ds-spacing-4) 0', color: 'var(--shell-text-secondary)', fontSize: 'var(--ds-text-sm)' }}>
          Landing 스타일 목업. data-context=&quot;preview&quot; + 선택된 테마 적용.
        </p>
        <div className={styles.pagePreview}>
          <div
            className={styles.pagePreviewInner}
            data-context="preview"
            style={{ ...themeVars, fontFamily: fontFamilyValue }}
          >
            <section className={styles.hero}>
              <h1 className={styles.heroTitle}>{landingHero.title}</h1>
              <p className={styles.heroSubtitle}>{landingHero.subtitle}</p>
              <div className={styles.heroButtons}>
                <Button variant="primary" size="lg">
                  {landingHero.primaryCta}
                </Button>
                <Button variant="outline" size="lg">
                  {landingHero.secondaryCta}
                </Button>
              </div>
            </section>
            <div className={styles.cardGrid}>
              {[1, 2, 3].map((i) => (
                <Card key={i} variant="elevated" hoverable>
                  <Card.Body>
                    <h3 style={{ margin: '0 0 var(--ds-spacing-2) 0', fontSize: 'var(--ds-text-lg)', fontWeight: 'var(--ds-font-weight-semibold)', color: 'var(--ds-color-text-primary)' }}>
                      Feature {i}
                    </h3>
                    <p style={{ margin: 0, fontSize: 'var(--ds-text-sm)', color: 'var(--ds-color-text-secondary)' }}>
                      서비스 UI에 적용된 테마로 렌더됩니다.
                    </p>
                    <div style={{ marginTop: 'var(--ds-spacing-3)' }}>
                      <Button variant="primary" size="sm">자세히</Button>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
            <section className={styles.formSection}>
              <Card variant="elevated" padding="lg">
                <Card.Body>
                  <Input label="이름" placeholder="이름을 입력하세요" fullWidth />
                  <div style={{ marginTop: 'var(--ds-spacing-4)' }}>
                    <Input label="이메일" type="email" placeholder="email@example.com" fullWidth />
                  </div>
                  <div style={{ marginTop: 'var(--ds-spacing-4)' }}>
                    <Button variant="primary" fullWidth>문의하기</Button>
                  </div>
                </Card.Body>
              </Card>
            </section>
            <footer className={styles.previewFooter}>
              © {new Date().getFullYear()} Service Preview · DS 테마 적용
            </footer>
          </div>
        </div>
      </LabSection>

      <LabSection title="Component Set" id="component-set" card>
        <p style={{ margin: '0 0 var(--ds-spacing-4) 0', color: 'var(--shell-text-secondary)', fontSize: 'var(--ds-text-sm)' }}>
          현재 테마의 Atoms → Molecules → Organisms 순 렌더.
        </p>
        <div className={styles.componentSet}>
          <div
            className={styles.componentSetInner}
            style={{ ...themeVars, fontFamily: fontFamilyValue }}
          >
            <h3 className={styles.sectionTitle}>Atoms</h3>
            <div className={styles.atomsGrid}>
              <div className={styles.atomBlock}>
                <span className={styles.atomLabel}>Button</span>
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
              </div>
              <div className={styles.atomBlock}>
                <span className={styles.atomLabel}>Input</span>
                <Input placeholder="입력" />
              </div>
              <div className={styles.atomBlock}>
                <span className={styles.atomLabel}>Card</span>
                <Card padding="md">
                  <Card.Body>Card content</Card.Body>
                </Card>
              </div>
              <div className={styles.atomBlock}>
                <span className={styles.atomLabel}>Badge</span>
                <Badge>New</Badge>
              </div>
              <div className={styles.atomBlock}>
                <span className={styles.atomLabel}>Avatar</span>
                <Avatar size="md" variant="primary">AB</Avatar>
              </div>
              <div className={styles.atomBlock}>
                <span className={styles.atomLabel}>Select</span>
                <Select
                  label=""
                  options={[{ value: 'a', label: 'Option A' }]}
                  value="a"
                  onChange={() => {}}
                  placeholder="선택"
                />
              </div>
            </div>
            <h3 className={styles.sectionTitle}>Molecules</h3>
            <div className={styles.moleculesRow}>
              {MOLECULES.map((m) => (
                <Card key={m.id} variant="outlined" padding="sm">
                  <Card.Body>
                    <strong style={{ fontSize: 'var(--ds-text-sm)' }}>{m.title}</strong>
                    <p style={{ margin: 'var(--ds-spacing-1) 0 0', fontSize: 'var(--ds-text-caption-size)', color: 'var(--ds-color-text-secondary)' }}>
                      {m.composedOf.join(' · ')}
                    </p>
                  </Card.Body>
                </Card>
              ))}
            </div>
            <h3 className={styles.sectionTitle}>Organisms</h3>
            <div className={styles.organismsRow}>
              {ORGANISMS.map((o) => (
                <Card key={o.id} variant="outlined" padding="sm">
                  <Card.Body>
                    <strong style={{ fontSize: 'var(--ds-text-sm)' }}>{o.title}</strong>
                    <p style={{ margin: 'var(--ds-spacing-1) 0 0', fontSize: 'var(--ds-text-caption-size)', color: 'var(--ds-color-text-secondary)' }}>
                      {o.composedOf.join(' · ')}
                    </p>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </LabSection>
    </div>
  );
}
