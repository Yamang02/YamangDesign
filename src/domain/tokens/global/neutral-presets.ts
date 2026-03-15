import type { ColorScale } from '@shared/@types/tokens';

export type NeutralPresetName = 'gray' | 'slate' | 'zinc' | 'stone';

export interface NeutralPreset {
  name: string;
  scale: ColorScale;
}

/** Gray - 중립 회색 */
export const grayNeutralPreset: NeutralPreset = {
  name: 'gray',
  scale: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
};

/** Slate - 쿨 블루 톤 회색 */
export const slateNeutralPreset: NeutralPreset = {
  name: 'slate',
  scale: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },
};

/** Zinc - 약간 따뜻한 회색 */
export const zincNeutralPreset: NeutralPreset = {
  name: 'zinc',
  scale: {
    50: '#FAFAFA',
    100: '#F4F4F5',
    200: '#E4E4E7',
    300: '#D4D4D8',
    400: '#A1A1AA',
    500: '#71717A',
    600: '#52525B',
    700: '#3F3F46',
    800: '#27272A',
    900: '#18181B',
  },
};

/** Stone - 웜 베이지 톤 회색 */
export const stoneNeutralPreset: NeutralPreset = {
  name: 'stone',
  scale: {
    50: '#FAFAF9',
    100: '#F5F5F4',
    200: '#E7E5E4',
    300: '#D6D3D1',
    400: '#A8A29E',
    500: '#78716C',
    600: '#57534E',
    700: '#44403C',
    800: '#292524',
    900: '#1C1917',
  },
};

export const neutralPresets = {
  gray: grayNeutralPreset,
  slate: slateNeutralPreset,
  zinc: zincNeutralPreset,
  stone: stoneNeutralPreset,
} as const;
