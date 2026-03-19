/**
 * E06 P06: Context — Service
 * E08 P02: 실제 서비스 페이지 목업 (Landing / Dashboard / Article). Component Set 제거.
 * P03: Overview + Token Map 섹션 추가. ShellContext 패턴과 통일.
 */
import { useState } from 'react';
import { LabSection, PreviewControlPanel } from '../../../layouts';
import { comparisonPresets } from '@domain/constants';
import type { PaletteName, StyleName, SystemPresetName } from '@shared/@types/theme';
import type { NeutralPresetName } from '@domain/tokens/global/neutral-presets';
import styles from './ServiceContext.module.css';

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/** 서비스 컴포넌트 인벤토리 */
const SERVICE_INVENTORY: { component: string; path: string; tokens: string[] }[] = [
  { component: 'Button', path: 'src/components/Button', tokens: ['--ds-color-primary-500', '--ds-radius-md'] },
  { component: 'Input', path: 'src/components/Input', tokens: ['--ds-color-border-default', '--ds-color-border-focus'] },
  { component: 'Card', path: 'src/components/Card', tokens: ['--ds-color-bg-base', '--ds-shadow-sm'] },
  { component: 'Select', path: 'src/components/Select', tokens: ['--ds-color-bg-surface', '--ds-color-border-default'] },
  { component: 'Badge', path: 'src/components/Badge', tokens: ['--ds-color-primary-100', '--ds-color-text-primary'] },
];

/** 서비스 레이어 토큰 맵 */
const SERVICE_TOKEN_MAP: { area: string; token: string }[] = [
  { area: '페이지 배경', token: '--ds-color-bg-base' },
  { area: '카드·표면', token: '--ds-color-bg-surface' },
  { area: '본문 텍스트', token: '--ds-color-text-primary' },
  { area: '보조 텍스트', token: '--ds-color-text-secondary' },
  { area: '주요 액션 색상', token: '--ds-color-primary-500' },
  { area: '기본 보더', token: '--ds-color-border-default' },
  { area: '포커스 보더', token: '--ds-color-border-focus' },
  { area: '그림자', token: '--ds-shadow-sm' },
];

const paletteOptions = comparisonPresets.palettes.map((p) => ({ value: p, label: capitalize(p) }));
const systemPresetOptions = comparisonPresets.systemPresets.map((s) => ({ value: s, label: capitalize(s) }));
const neutralPresetOptions = comparisonPresets.neutralPresets.map((n) => ({ value: n, label: capitalize(n) }));
const styleOptions = comparisonPresets.styles.map((s) => ({ value: s, label: capitalize(s) }));

export function ServiceContext() {
  const [palette, setPalette] = useState<PaletteName>(comparisonPresets.palettes[0]);
  const [systemPreset, setSystemPreset] = useState<SystemPresetName>(
    comparisonPresets.systemPresets[0]
  );
  const [neutralPreset, setNeutralPreset] = useState<NeutralPresetName>(
    comparisonPresets.neutralPresets[0]
  );
  const [style, setStyle] = useState<StyleName>(comparisonPresets.styles[0]);

  return (
    <div className={styles.wrapper}>
      <LabSection title="Overview" id="overview" card>
        <div className={styles.inventoryGrid}>
          {SERVICE_INVENTORY.map((item) => (
            <div key={item.component} className={styles.inventoryCard}>
              <div className={styles.inventoryCardTitle}>{item.component}</div>
              <div className={styles.inventoryCardPath}>{item.path}</div>
              <div className={styles.inventoryCardDivider} />
              <ul className={styles.inventoryCardTokens}>
                {item.tokens.map((t) => (
                  <li key={t} className={styles.tokenTag}>{t}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </LabSection>

      <LabSection title="Token Map" id="token-map" card>
        <table className={styles.tokenMapTable}>
          <thead>
            <tr>
              <th>영역</th>
              <th>토큰</th>
            </tr>
          </thead>
          <tbody>
            {SERVICE_TOKEN_MAP.map((row) => (
              <tr key={row.token}>
                <td>{row.area}</td>
                <td>{row.token}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </LabSection>

      <LabSection title="Controls" id="controls" card>
        <div className={styles.controlsStack}>
          <PreviewControlPanel
            label="Palette (Brand)"
            value={palette}
            options={paletteOptions}
            onChange={(v) => setPalette(v as PaletteName)}
          />
          <PreviewControlPanel
            label="System"
            value={systemPreset}
            options={systemPresetOptions}
            onChange={(v) => setSystemPreset(v as SystemPresetName)}
          />
          <PreviewControlPanel
            label="Neutral"
            value={neutralPreset}
            options={neutralPresetOptions}
            onChange={(v) => setNeutralPreset(v as NeutralPresetName)}
          />
          <PreviewControlPanel
            label="Style"
            value={style}
            options={styleOptions}
            onChange={(v) => setStyle(v as StyleName)}
          />
        </div>
      </LabSection>
    </div>
  );
}
