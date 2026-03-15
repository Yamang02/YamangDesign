/**
 * =============================================================================
 * 컬러 프리셋 템플릿
 * =============================================================================
 *
 * 이 파일을 복사하여 새 프리셋을 만들 때 참고용으로 사용하세요.
 *
 * ## 1. 프리셋 추가 절차
 *
 * ### 기존 카테고리에 추가하는 경우
 *   1. src/palettes/presets/<카테고리>/ 폴더에 새 파일 생성 (예: MyPreset.ts)
 *   2. 아래 템플릿을 복사하고 값만 수정
 *   3. src/palettes/presets/<카테고리>/index.ts 에 export 추가
 *      export { myPresetPalette } from './MyPreset';
 *
 * ### 새 카테고리를 만드는 경우
 *   1. src/palettes/types.ts 의 ThemeCategory 타입에 새 카테고리 추가
 *      export type ThemeCategory = 'default' | 'custom' | 'natural' | 'mycategory';
 *   2. src/palettes/presets/mycategory/ 폴더 생성
 *   3. src/palettes/presets/mycategory/MyPreset.ts 파일 생성
 *   4. src/palettes/presets/mycategory/index.ts 생성하여 export
 *   5. src/palettes/presets/registry.ts 에 새 카테고리 등록
 *      import * as mycategoryThemes from './mycategory/index';
 *      ...
 *      {
 *        category: 'mycategory',
 *        displayName: 'My Category',
 *        description: '설명',
 *        themes: Object.values(mycategoryThemes).filter(...),
 *      },
 *   6. src/pages/labs/PaletteLab/ThemeTabNavigation.tsx 의 TABS 배열에 추가
 *      { id: 'mycategory', label: 'My Category' },
 *
 * ## 2. 시맨틱 매핑 오버라이드 방법
 *
 * 기본 매핑(bgStrategy별 default-mappings) 위에, 선택적으로 일부 토큰만 덮어쓸 수 있습니다.
 *
 * ### 2-1. 프리셋 정의 시 semanticMapping (정적 오버라이드)
 *   PaletteDefinition.semanticMapping 를 지정하면, 해당 프리셋의 시맨틱 색상 일부를
 *   기본 매핑과 다르게 설정할 수 있습니다.
 *   - 기본 매핑 + semanticMapping 이 getMergedMapping() 으로 1depth 병합됩니다.
 *   - 전체를 쓸 필요 없고, 변경할 토큰만 Partial로 제공하면 됩니다.
 *
 * ### 2-2. 값 타입: ScaleReference vs 직접 색상
 *   - ScaleReference: { scale: 'primary'|'secondary'|'accent'|'neutral'|'sub', step: 50|100|200|300|400|500|600|700|800|900 }
 *     예: { scale: 'primary', step: 500 } → primary 스케일의 500 단계 색상 사용
 *   - 직접 색상: '#FFFFFF', 'rgb(255,255,255)' 등 hex/rgb 문자열
 *     예: 'onAction' 텍스트를 항상 흰색으로 고정할 때 사용
 *
 * ### 2-3. 시맨틱 토큰 경로 (SemanticTokenPath)
 *   bg:   base, surface, surfaceBrand, elevated, muted
 *   text: primary, secondary, muted, onAction
 *   border: default, subtle, accent, focus
 *
 * ### 2-4. 사용자 편집 오버라이드 (런타임)
 *   Lab UI에서 "시맨틱 매핑" 모달을 통해 사용자가 변경한 값은 semanticOverrides로
 *   별도 저장됩니다. getMergedMapping(base, definition.semanticMapping, overrides)
 *   순으로 병합되어 최종 매핑이 결정됩니다.
 *
 * =============================================================================
 */

import type { PaletteDefinition } from '../../types';

export const orientalChineseRestaurant01Palette: PaletteDefinition = {
  id: 'orientalChineseRestaurant01', // camelCase, 고유 식별자. theme-presets 키로 사용됨
  displayName: '오리엔탈 중화반점',
  category: 'pop', // 'default' | 'natural' | (ThemeCategory에 정의된 값)
  description: '요비요헤이_팔레트 오리엔탈 중화반점',
  subname: '오리엔탈 중화반점', // 사용자에게 보여줄 이름
  colors: {
    primary: '#E72D29', // 필수
    secondary: '#FFE329', // 선택
    accent: '#00A63C', // 선택
    sub: '#002C2B', // 선택, 컬러풀 보조색
    neutral: '#6B7280', // 선택, 무채색 (텍스트/테두리/배경용)
  },
  bgStrategy: 'light', // 'light' | 'colored' | 'dark'
  contrast: 'normal', // 'normal' | 'high'

  semanticMapping: {
    bg: {
      base: { scale: 'secondary', step: 400 },
      surface: { scale: 'secondary', step: 500 },
      surfaceBrand: { scale: 'secondary', step: 600 },
      elevated: { scale: 'secondary', step: 100 },
      muted: { scale: 'secondary', step: 900 },
    },
    text: {
      primary: { scale: 'primary', step: 900 },
      secondary: { scale: 'primary', step: 800 },
      muted: { scale: 'primary', step: 700 },
      onAction: { scale: 'primary', step: 50 },
    },
    border: {
      default: { scale: 'primary', step: 700 },
      subtle: { scale: 'primary', step: 600 },
      focus: { scale: 'primary', step: 400 },
      accent: { scale: 'primary', step: 500 },
    },
  },
};
