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
 *   1. src/domain/palettes/presets/<카테고리>/ 폴더에 새 파일 생성 (예: MyPreset.ts)
 *   2. 아래 템플릿을 복사하고 값만 수정
 *   3. src/domain/palettes/presets/<카테고리>/index.ts 에 export 추가
 *      export { myPresetPalette } from './MyPreset';
 *
 * ### 새 카테고리를 만드는 경우
 *   탭/패널은 themeRegistry 기반으로 동적 생성됩니다. (Custom 선두, 이후 registry 순서)
 *   1. src/domain/palettes/types.ts 의 ThemeCategory 타입에 새 카테고리 추가
 *      export type ThemeCategory = 'default' | 'custom' | 'natural' | 'mycategory';
 *   2. src/domain/palettes/presets/mycategory/ 폴더 생성
 *   3. src/domain/palettes/presets/mycategory/MyPreset.ts 파일 생성
 *   4. src/domain/palettes/presets/mycategory/index.ts 생성하여 export
 *   5. src/domain/palettes/presets/registry.ts 에 새 카테고리 등록
 *      import * as mycategoryThemes from './mycategory/index';
 *      ...
 *      {
 *        category: 'mycategory',
 *        displayName: 'My Category',
 *        description: '설명',
 *        themes: Object.values(mycategoryThemes).filter(...),
 *      },
 *   ※ Lab, 전역설정 모달 탭/패널은 registry에서 자동 반영됩니다.
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
 *     예: 'onActionPrimary' 텍스트를 항상 흰색으로 고정할 때 사용
 *
 * ### 2-3. 시맨틱 토큰 경로 (SemanticTokenPath)
 *   bg:   base, subtle, surfaceLow, surface, surfaceHigh, surfaceBrand, elevated, muted
 *   text: primary, secondary, muted, onActionPrimary, onActionSecondary, onActionAccent
 *   border: default, subtle, accent, focus
 *   action: primary|secondary|accent 각각 default|hover|active
 *   feedback: error|warning|success|info 각각 bg|text|border
 *
 * ### 2-4. 사용자 편집 오버라이드 (런타임)
 *   Lab UI에서 "시맨틱 매핑" 모달을 통해 사용자가 변경한 값은 semanticOverrides로
 *   별도 저장됩니다. getMergedMapping(base, definition.semanticMapping, overrides)
 *   순으로 병합되어 최종 매핑이 결정됩니다.
 *
 * =============================================================================
 */

import type { PaletteDefinition } from '@domain/palettes/types';

export const myPresetPalette: PaletteDefinition = {
  id: 'my-preset', // kebab-case 권장, 고유 식별자. theme-presets 키로 사용됨
  displayName: '내 프리셋 이름',
  category: 'natural', // 'default' | 'natural' | (ThemeCategory에 정의된 값)
  description: '프리셋 설명',
  subname: '내 프리셋 이름', // 사용자에게 보여줄 이름
  colors: {
    primary: '#E94E70', // 필수
    secondary: '#72333E', // 선택
    accent: '#C2D95C', // 선택
    sub: '#F7C9DD', // 선택, 컬러풀 보조색
  },
  bgStrategy: 'light', // 'light' | 'colored' | 'dark'
  // recommendedNeutral: 'gray', // 선택: 'gray' | 'slate' | 'zinc' | 'stone'. 미지정 시 'gray' 기본값.
  contrast: 'normal', // 'normal' | 'high'

  // ---------------------------------------------------------------------------
  // 시맨틱 매핑 오버라이드 (선택)
  // 기본 매핑(bgStrategy 기반)에서 변경할 토큰만 partial로 지정
  // ---------------------------------------------------------------------------
  // semanticMapping: {
  //   bg: {
  //     surfaceBrand: { scale: 'accent', step: 100 }, // primary 대신 accent 사용
  //   },
  //   text: {
  //     // 기본은 light/colored에서 #FFFFFF 힌트(+3:1 채택). 필요 시만 스케일/hex로 덮어쓰기
  //     onActionPrimary: { scale: 'primary', step: 100 },
  //   },
  //   border: {
  //     accent: { scale: 'secondary', step: 400 },
  //   },
  // } as Partial<SemanticMapping>,
};
