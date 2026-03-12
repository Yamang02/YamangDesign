export type SystemColorName = 'error' | 'warning' | 'success' | 'info';

export interface SystemColorScale {
  50: string;
  500: string;
  700: string;
}

export interface SystemColorPreset {
  name: string;
  colors: Record<SystemColorName, SystemColorScale>;
}

/** 기본 프리셋 - Tailwind 계열 */
export const defaultSystemColors: SystemColorPreset = {
  name: 'default',
  colors: {
    error: {
      50: '#FEF2F2',
      500: '#EF4444',
      700: '#B91C1C',
    },
    warning: {
      50: '#FFFBEB',
      500: '#F59E0B',
      700: '#B45309',
    },
    success: {
      50: '#F0FDF4',
      500: '#22C55E',
      700: '#15803D',
    },
    info: {
      50: '#EFF6FF',
      500: '#3B82F6',
      700: '#1D4ED8',
    },
  },
};

/** 차분한 프리셋 - Admin/Dashboard용 */
export const mutedSystemColors: SystemColorPreset = {
  name: 'muted',
  colors: {
    error: {
      50: '#FEF2F2',
      500: '#DC2626',
      700: '#991B1B',
    },
    warning: {
      50: '#FEF9C3',
      500: '#CA8A04',
      700: '#A16207',
    },
    success: {
      50: '#DCFCE7',
      500: '#16A34A',
      700: '#166534',
    },
    info: {
      50: '#DBEAFE',
      500: '#2563EB',
      700: '#1E40AF',
    },
  },
};

/** 프리셋 목록 */
export const systemColorPresets = {
  default: defaultSystemColors,
  muted: mutedSystemColors,
} as const;

export type SystemPresetName = keyof typeof systemColorPresets;
