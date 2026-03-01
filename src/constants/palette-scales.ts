/**
 * 팔레트 스케일 및 스텝 상수
 * 여러 컴포넌트에서 공유되는 상수를 중앙화
 */

/** 팔레트 스케일 키 (UI 표시 순서) */
export const PALETTE_SCALES = [
  'primary',
  'secondary',
  'accent',
  'sub',
  'neutral',
] as const;
export type PaletteScale = (typeof PALETTE_SCALES)[number];

/** 스케일 스텝 (50-900) */
export const SCALE_STEPS = [
  50, 100, 200, 300, 400, 500, 600, 700, 800, 900,
] as const;
export type ScaleStep = (typeof SCALE_STEPS)[number];

/** 시스템 컬러 키 */
export const SYSTEM_COLOR_KEYS = [
  'error',
  'warning',
  'success',
  'info',
] as const;
export type SystemColorKey = (typeof SYSTEM_COLOR_KEYS)[number];

/** 시스템 컬러에서 사용하는 스텝 */
export const SYSTEM_SCALE_STEPS = [50, 500, 700] as const;
export type SystemScaleStep = (typeof SYSTEM_SCALE_STEPS)[number];

/**
 * 스케일 스텝별 추천 용도 가이드
 * 디자인 시스템 모범 사례 기반 (Tailwind, Material Design 참고)
 */
export interface ScaleStepGuide {
  step: ScaleStep;
  /** 용도 설명 (한국어) */
  usage: string;
  /** 용도 설명 (영어) */
  usageEn: string;
  /** 사용 예시 (한국어) */
  examples: string[];
  /** 대비 레벨 (밝음/중간/어두움) */
  contrast: 'lightest' | 'light' | 'medium' | 'dark' | 'darkest';
}

export const SCALE_STEP_GUIDES: ScaleStepGuide[] = [
  {
    step: 50,
    usage: '배경 (가장 밝음)',
    usageEn: 'Background (lightest)',
    examples: ['페이지 배경', '카드 배경', '입력 필드'],
    contrast: 'lightest',
  },
  {
    step: 100,
    usage: '배경 호버/선택',
    usageEn: 'Background hover/selected',
    examples: ['호버 상태', '선택된 항목', '비활성 영역'],
    contrast: 'light',
  },
  {
    step: 200,
    usage: '보조 배경/구분선',
    usageEn: 'Secondary background/divider',
    examples: ['구분선', '미묘한 테두리', '코드 배경'],
    contrast: 'light',
  },
  {
    step: 300,
    usage: '비활성/플레이스홀더',
    usageEn: 'Disabled/placeholder',
    examples: ['비활성 요소', '플레이스홀더', '기본 테두리'],
    contrast: 'medium',
  },
  {
    step: 400,
    usage: '아이콘/보조 텍스트',
    usageEn: 'Icons/secondary text',
    examples: ['비활성 아이콘', '힌트 텍스트', '캡션'],
    contrast: 'medium',
  },
  {
    step: 500,
    usage: '기본 브랜드 색상',
    usageEn: 'Primary brand color',
    examples: ['주요 버튼', '링크', '강조 요소'],
    contrast: 'medium',
  },
  {
    step: 600,
    usage: '호버 상태',
    usageEn: 'Hover state',
    examples: ['버튼 호버', '링크 호버', '포커스 링'],
    contrast: 'dark',
  },
  {
    step: 700,
    usage: '액티브/강조',
    usageEn: 'Active/emphasis',
    examples: ['버튼 클릭', '강조 텍스트', '활성 탭'],
    contrast: 'dark',
  },
  {
    step: 800,
    usage: '본문 텍스트',
    usageEn: 'Body text',
    examples: ['본문', '제목', '레이블'],
    contrast: 'darkest',
  },
  {
    step: 900,
    usage: '최고 대비 (가장 어두움)',
    usageEn: 'Highest contrast (darkest)',
    examples: ['강조 제목', '고대비 텍스트'],
    contrast: 'darkest',
  },
];

/** 스텝별 가이드 조회 */
export function getStepGuide(step: ScaleStep): ScaleStepGuide | undefined {
  return SCALE_STEP_GUIDES.find((g) => g.step === step);
}
