/**
 * E05 P05: Playground 패널 아키텍처 — 패널당 독립 구성 상태 타입
 */
import type { PaletteName, StyleName, SystemPresetName } from '@shared/@types/theme';
import type { NeutralPresetName } from '@domain/tokens/global/neutral-presets';
import { comparisonPresets } from '@domain/constants';

export type FontKey = 'sans' | 'mono';

export interface PlaygroundPanel {
  id: string;
  label: string;
  description: string;
  palette: PaletteName;
  style: StyleName;
  font: FontKey;
  systemPreset: SystemPresetName;
  neutralPreset: NeutralPresetName;
}

/** 고정 2패널(Brand / System) 초기값. E07에서 패널 추가/삭제 예정 */
export const DEFAULT_PANELS: PlaygroundPanel[] = [
  {
    id: 'brand',
    label: 'Brand',
    description: '팔레트 컬러가 적용된 UI 컴포넌트',
    palette: comparisonPresets.palettes[0],
    style: comparisonPresets.styles[0],
    font: 'sans',
    systemPreset: comparisonPresets.systemPresets[0],
    neutralPreset: comparisonPresets.neutralPresets[0],
  },
  {
    id: 'system',
    label: 'System',
    description: '상태(오류·경고·성공·정보) 색상 컴포넌트',
    palette: comparisonPresets.palettes[0],
    style: comparisonPresets.styles[0],
    font: 'sans',
    systemPreset: comparisonPresets.systemPresets[0],
    neutralPreset: comparisonPresets.neutralPresets[0],
  },
];
