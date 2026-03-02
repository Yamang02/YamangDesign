# YamangDesign 튜토리얼

디자인 시스템 플레이그라운드 사용 가이드

---

## 목차

1. [시작하기](#1-시작하기)
2. [Palette Lab 사용하기](#2-palette-lab-사용하기)
3. [시맨틱 매핑 이해하기](#3-시맨틱-매핑-이해하기)
4. [Style Lab 사용하기](#4-style-lab-사용하기)
5. [커스텀 프리셋 만들기](#5-커스텀-프리셋-만들기)
6. [새 팔레트 프리셋 추가하기](#6-새-팔레트-프리셋-추가하기)
7. [설정 Export/Import](#7-설정-exportimport)

---

## 1. 시작하기

### 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/your-repo/YamangDesign.git
cd YamangDesign

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 `http://localhost:5173`으로 접속합니다.

### 화면 구성

| 영역 | 설명 |
|------|------|
| **Header** | 페이지 네비게이션, Global Settings 버튼 |
| **Navigation** | Lab 선택 (Palette / Style / Font) |
| **Main Content** | 선택한 Lab의 비교 카드 |
| **Detail Panel** | 선택한 항목의 상세 정보 |

---

## 2. Palette Lab 사용하기

Palette Lab은 다양한 컬러 팔레트를 비교하고 편집하는 공간입니다.

### 2.1 팔레트 탐색

1. 상단 **탭 네비게이션**에서 카테고리 선택
   - **Default**: 기본 브랜드 팔레트
   - **Natural**: 자연에서 영감받은 테마
   - **Pop**: 팝 문화 영감 테마

2. **팔레트 카드**를 클릭하면 우측 Detail Panel에서 상세 정보 확인
   - 색상 스케일 (50 ~ 900)
   - 시맨틱 색상 매핑
   - 적용된 컴포넌트 미리보기

### 2.2 팔레트 적용

1. 원하는 팔레트 카드의 **Apply** 버튼 클릭
2. 전체 UI에 즉시 반영됨
3. Header의 **Global Settings**에서 현재 적용된 팔레트 확인 가능

---

## 3. 시맨틱 매핑 이해하기

### 시맨틱 매핑이란?

기본 색상(Primary, Secondary 등)을 UI 요소의 **의미적 역할**에 따라 자동으로 배분하는 시스템입니다.

```
Primary Color (#E72D29)
    ↓ 시맨틱 매핑
┌─────────────────────────────────┐
│ bg.base      → primary-100     │
│ bg.surface   → primary-50      │
│ text.primary → primary-900     │
│ border.accent→ primary-500     │
└─────────────────────────────────┘
```

### 시맨틱 토큰 구조

| 카테고리 | 토큰 | 용도 |
|----------|------|------|
| **bg** | base | 페이지 기본 배경 |
| | surface | 카드, 패널 배경 |
| | surfaceBrand | 브랜드 강조 배경 |
| | elevated | 떠있는 요소 배경 |
| | muted | 비활성/음소거 배경 |
| **text** | primary | 주요 텍스트 |
| | secondary | 보조 텍스트 |
| | muted | 흐린 텍스트 |
| | onAction | 버튼 위 텍스트 |
| **border** | default | 기본 테두리 |
| | subtle | 미세한 테두리 |
| | accent | 강조 테두리 |
| | focus | 포커스 상태 테두리 |

### bgStrategy에 따른 기본 매핑

| 전략 | 특징 | 사용 예 |
|------|------|---------|
| **light** | 밝은 배경, 어두운 텍스트 | 일반적인 웹사이트 |
| **colored** | 색상 배경, 대비 텍스트 | 브랜드 강조 페이지 |
| **dark** | 어두운 배경, 밝은 텍스트 | 다크 모드 |

---

## 4. Style Lab 사용하기

Style Lab에서는 동일한 컴포넌트에 다른 GUI 스타일을 적용한 결과를 비교합니다.

### 3가지 스타일

| 스타일 | 특징 | 그림자 | 테두리 |
|--------|------|--------|--------|
| **Minimal** | 플랫 디자인, 깔끔함 | 가벼운 drop shadow | 1px |
| **Neumorphism** | 부드러운 입체감 | 양방향 soft shadow | 없음 |
| **Brutalism** | 강렬하고 거친 느낌 | 굵은 hard shadow | 3px |

### 스타일 비교

1. Style Lab 페이지 진입
2. 3개의 스타일 카드가 나란히 표시됨
3. 동일한 컴포넌트(Button, Card, Input 등)가 각 스타일로 렌더링
4. 원하는 스타일의 **Apply** 버튼으로 전역 적용

---

## 5. 커스텀 프리셋 만들기

기존 팔레트의 시맨틱 매핑을 수정하여 나만의 프리셋을 저장할 수 있습니다.

### 5.1 시맨틱 매핑 편집

1. Palette Lab에서 팔레트 선택
2. Detail Panel의 **시맨틱 매핑 편집** 버튼 클릭
3. 모달에서 원하는 토큰의 색상 변경
   - **Scale Reference**: 스케일에서 선택 (예: primary-500)
   - **직접 입력**: HEX 값 직접 지정 (예: #FFFFFF)

```typescript
// 예: 배경을 secondary 스케일로 변경
semanticMapping: {
  bg: {
    base: { scale: 'secondary', step: 400 },
    surface: { scale: 'secondary', step: 500 },
  }
}
```

### 5.2 프리셋 저장

1. 편집 완료 후 **프리셋으로 저장** 버튼 클릭
2. 프리셋 이름 입력
3. localStorage에 저장되어 브라우저를 닫아도 유지

### 5.3 프리셋 관리

- **불러오기**: Global Settings → 저장된 프리셋 목록에서 선택
- **삭제**: 프리셋 항목의 삭제 버튼 클릭
- **Export**: JSON 파일로 내보내기 (팀 공유용)

---

## 6. 새 팔레트 프리셋 추가하기

개발자가 코드로 새 팔레트를 추가하는 방법입니다.

### 6.1 기존 카테고리에 추가

```typescript
// src/palettes/presets/pop/MyNewPalette.ts

import type { PaletteDefinition } from '../../types';

export const myNewPalette: PaletteDefinition = {
  name: 'myNewPalette',           // camelCase 고유 식별자
  subname: '나의 새 팔레트',        // 표시 이름

  colors: {
    primary: '#FF6B6B',           // 필수
    secondary: '#4ECDC4',         // 선택
    accent: '#FFE66D',            // 선택
    sub: '#2C3E50',               // 보조색
    neutral: '#6B7280',           // 무채색
  },

  bgStrategy: 'light',            // 'light' | 'colored' | 'dark'
  contrast: 'normal',             // 'normal' | 'high'

  metadata: {
    id: 'myNewPalette',
    displayName: '나의 새 팔레트',
    category: 'pop',
    description: '설명을 입력하세요',
  },

  // 선택: 시맨틱 매핑 오버라이드
  semanticMapping: {
    bg: {
      base: { scale: 'neutral', step: 100 },
    },
  },
};
```

### 6.2 export 등록

```typescript
// src/palettes/presets/pop/index.ts
export { myNewPalette } from './MyNewPalette';
```

### 6.3 새 카테고리 추가

1. **타입 추가**: `src/palettes/types.ts`
   ```typescript
   export type ThemeCategory = 'default' | 'natural' | 'pop' | 'myCategory';
   ```

2. **폴더 생성**: `src/palettes/presets/myCategory/`

3. **레지스트리 등록**: `src/palettes/presets/registry.ts`
   ```typescript
   import * as myCategoryThemes from './myCategory/index';

   // themeRegistry 배열에 추가
   {
     category: 'myCategory',
     displayName: 'My Category',
     description: '카테고리 설명',
     themes: Object.values(myCategoryThemes).filter(isPaletteDefinition),
   }
   ```

4. **탭 추가**: `src/pages/layouts/PaletteLab/ThemeTabNavigation.tsx`
   ```typescript
   { id: 'myCategory', label: 'My Category' }
   ```

---

## 7. 설정 Export/Import

### Export (내보내기)

1. Header → **Global Settings** 클릭
2. **Export** 버튼 클릭
3. `yamang-settings-YYYY-MM-DD.json` 파일 다운로드

### Import (가져오기)

1. Global Settings → **Import** 버튼 클릭
2. 이전에 Export한 JSON 파일 선택
3. 팔레트, 스타일, 커스텀 프리셋 모두 복원

### JSON 구조

```json
{
  "version": "1.0",
  "exportedAt": "2024-01-15T10:30:00Z",
  "settings": {
    "paletteName": "orientalChineseRestaurant01",
    "styleName": "minimal",
    "systemPreset": "default"
  },
  "customSemanticPresets": [
    {
      "name": "My Custom Theme",
      "basePalette": "default",
      "semanticMapping": { ... }
    }
  ]
}
```

---

## 다음 단계

- [기능 소개](./FEATURES.md) - 주요 기능 상세 설명
- [아키텍처 문서](./ARCHITECTURE.md) - 시스템 구조 이해
- [기여 가이드](./CONTRIBUTING.md) - 프로젝트 기여 방법
