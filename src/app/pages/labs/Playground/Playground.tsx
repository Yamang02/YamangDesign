/**
 * E05: Playground - Palette × Style × Font 조합 선택 + Component Preview
 * P05: 패널 아키텍처 전환 — PreviewPanel 배열, Brand/System 컬럼 의도 명확화
 */
import { useState, useCallback } from 'react';
import { Select } from '../../../components';
import { LabLayout, LabSection, type TocItem } from '../../../layouts';
import { sectionTitles, fontFamilyLabels } from '@app/content/lab-content';
import { comparisonPresets } from '@domain/constants';
import type { PaletteName, StyleName, SystemPresetName } from '@shared/@types/theme';
import type { NeutralPresetName } from '@domain/tokens/global/neutral-presets';
import { DEFAULT_PANELS, type PlaygroundPanel, type FontKey } from './types';
import { PreviewPanel } from './PreviewPanel';
import styles from './Playground.module.css';

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
  { value: 'sans', label: fontFamilyLabels.sans },
  { value: 'mono', label: fontFamilyLabels.mono },
];

const tocItems: TocItem[] = [
  { id: 'combination-select', label: sectionTitles.combinationSelect },
  { id: 'component-preview', label: sectionTitles.componentPreview },
];

export function Playground() {
  const [panels, setPanels] = useState<PlaygroundPanel[]>(DEFAULT_PANELS);

  const updateAllPanels = useCallback(
    (patch: Partial<PlaygroundPanel>) => {
      setPanels((prev) => prev.map((p) => ({ ...p, ...patch })));
    },
    []
  );

  return (
    <LabLayout
      title="Playground"
      subtitle="Palette × Style × Font 조합 실험"
      tocItems={tocItems}
    >
      <LabSection title={sectionTitles.combinationSelect} id="combination-select">
        {/* TODO(E07): 패널별 독립 Controls */}
        <div className={styles.selectRow}>
          <Select
            label="Palette (Brand)"
            options={paletteOptions}
            value={panels[0].palette}
            onChange={(v) => updateAllPanels({ palette: v as PaletteName })}
            placeholder="Palette 선택"
          />
          <Select
            label="System"
            options={systemPresetOptions}
            value={panels[0].systemPreset}
            onChange={(v) => updateAllPanels({ systemPreset: v as SystemPresetName })}
            placeholder="System 선택"
          />
          <Select
            label="Neutral"
            options={neutralPresetOptions}
            value={panels[0].neutralPreset}
            onChange={(v) => updateAllPanels({ neutralPreset: v as NeutralPresetName })}
            placeholder="Neutral 선택"
          />
          <Select
            label="Style"
            options={styleOptions}
            value={panels[0].style}
            onChange={(v) => updateAllPanels({ style: v as StyleName })}
            placeholder="Style 선택"
          />
          <Select
            label="Font"
            options={fontOptions}
            value={panels[0].font}
            onChange={(v) => updateAllPanels({ font: v as FontKey })}
            placeholder="Font 선택"
          />
        </div>
      </LabSection>

      <LabSection title={sectionTitles.componentPreview} id="component-preview">
        {/* TODO(E07): 패널 추가/삭제 버튼 */}
        {/* TODO(E07): previewLevel 선택 (atoms | molecules | organisms | page) */}
        {/* TODO(E07): "전역 테마로 적용" 버튼 */}
        <div className={styles.previewGrid}>
          {panels.map((panel) => (
            <PreviewPanel
              key={panel.id}
              panel={panel}
              variant={panel.id === 'brand' ? 'brand' : 'system'}
            />
          ))}
        </div>
      </LabSection>
    </LabLayout>
  );
}
