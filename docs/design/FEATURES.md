# YamangDesign 기능 소개

**컬러와 스타일을 시각적으로 탐험하는 디자인 시스템 플레이그라운드**

---

## 핵심 가치

> "디자인 시스템의 모든 요소를 **눈으로 보고, 비교하고, 즉시 적용**할 수 있는 환경"

---

## 주요 기능

### 1. Palette Lab — 배색 비교 시스템

**한눈에 팔레트를 비교하고, 클릭 한 번으로 적용**

컬러 팔레트를 카드 형태로 나란히 배치하여 직관적으로 비교할 수 있습니다.

#### 특징
- **카테고리별 정리**: Default / Natural / Pop 테마 분류
- **색상 스케일 시각화**: 50~900 단계의 색상 스펙트럼
- **실시간 미리보기**: 선택 즉시 전체 UI에 반영
- **Detail Panel**: 선택한 팔레트의 상세 정보 확인

#### 사용 시나리오
```
브랜드 리뉴얼 → Palette Lab에서 여러 테마 비교
→ 적합한 팔레트 선택 → 전체 UI 즉시 적용
```

---

### 2. 시맨틱 매핑 — 자동 색상 배분

**Primary 색상 하나로 전체 UI 색상 시스템 완성**

기본 색상(Primary, Secondary, Accent)을 정의하면, 배경·텍스트·테두리 등 모든 UI 요소에 자동으로 적절한 색상이 배분됩니다.

#### 시맨틱 토큰 구조

| 영역 | 토큰 | 자동 매핑 |
|------|------|----------|
| **배경(bg)** | base, subtle, surfaceLow, surface, surfaceHigh, surfaceBrand, elevated, muted | 밝기/채도 자동 조절 |
| **텍스트(text)** | primary, secondary, muted, onActionPrimary/Secondary/Accent | 대비 보장 |
| **테두리(border)** | default, subtle, accent, focus | 강조도별 차등 |

#### bgStrategy 지원

| 전략 | 설명 |
|------|------|
| `light` | 밝은 배경 + 어두운 텍스트 |
| `colored` | 색상 배경 + 대비 텍스트 |
| `dark` | 어두운 배경 + 밝은 텍스트 |

```typescript
// 이것만 정의하면
colors: { primary: '#E72D29' }
bgStrategy: 'light'

// 이 모든 것이 자동으로 생성됨
bg.base      → #FEF2F2 (primary-50)
bg.surface   → #FFFFFF
text.primary → #7F1D1D (primary-900)
border.accent→ #EF4444 (primary-500)
```

---

### 3. Style Lab — GUI 스타일 비교

**동일한 컴포넌트, 세 가지 스타일로 변신**

같은 버튼, 카드, 입력 필드가 스타일에 따라 어떻게 달라지는지 한눈에 비교합니다.

#### 3가지 스타일

| 스타일 | 느낌 | 그림자 | 테두리 |
|--------|------|--------|--------|
| **Minimal** | 깔끔, 현대적 | 가벼운 drop shadow | 1px 얇은 선 |
| **Neumorphism** | 부드러운 입체감 | 양방향 soft shadow | 없음 |
| **Brutalism** | 강렬, 대담 | 굵은 hard shadow | 3px 굵은 선 |

#### 시각적 비교
```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│   Minimal   │  │ Neumorphism │  │  Brutalism  │
│  ┌───────┐  │  │  ╭───────╮  │  │  ┏━━━━━━━┓  │
│  │ Button│  │  │  │ Button│  │  │  ┃ Button┃  │
│  └───────┘  │  │  ╰───────╯  │  │  ┗━━━━━━━┛  │
└─────────────┘  └─────────────┘  └─────────────┘
```

---

### 4. 커스텀 프리셋 — 나만의 테마 저장

**기본 팔레트를 기반으로 시맨틱 매핑을 커스터마이징**

#### 워크플로우

```
1. 기존 팔레트 선택
      ↓
2. 시맨틱 매핑 편집 모달
   - ScaleReference 변경 (예: primary-500 → accent-400)
   - 직접 HEX 입력 (예: #FFFFFF)
      ↓
3. 프리셋으로 저장
      ↓
4. 언제든 불러오기 & 재사용
```

#### 저장 항목
- 프리셋 이름
- 기반 팔레트
- 수정된 시맨틱 매핑
- 생성 일시

---

### 5. Export/Import — 설정 공유

**JSON 파일로 디자인 설정을 팀과 공유**

#### Export 내용

```json
{
  "version": "1.0",
  "settings": {
    "paletteName": "oriental-chinese-restaurant-01",
    "styleName": "minimal",
    "systemPreset": "default"
  },
  "customSemanticPresets": [...]
}
```

#### 활용 시나리오

| 상황 | 활용 |
|------|------|
| **디자이너 → 개발자** | 확정된 테마 설정 전달 |
| **프로젝트 간 재사용** | 동일 브랜드의 다른 프로젝트에 적용 |
| **버전 관리** | 테마 변경 이력을 JSON으로 저장 |
| **백업** | 커스텀 프리셋 백업 및 복원 |

---

### 6. 실시간 CSS 변수 시스템

**변경 즉시 모든 컴포넌트에 반영**

모든 스타일링은 CSS Custom Properties(변수)를 통해 적용됩니다.

#### CSS 변수 네이밍

```css
/* 색상 스케일 */
--ds-color-primary-500
--ds-color-secondary-100

/* 시맨틱 색상 */
--ds-color-bg-base
--ds-color-text-primary
--ds-color-border-accent

/* 스타일 */
--ds-shadow-md
--ds-border-width
```

#### 장점
- **런타임 테마 전환**: 페이지 새로고침 없이 즉시 적용
- **컴포넌트 독립성**: 각 컴포넌트가 변수만 참조하므로 테마에 종속되지 않음
- **디버깅 용이**: DevTools에서 변수 값 확인 및 수정 가능

---

### 7. 확장 가능한 프리셋 시스템

**새 팔레트와 카테고리를 쉽게 추가**

#### 프리셋 추가 절차

```
1. src/domain/palettes/presets/<category>/MyPalette.ts 생성
2. index.ts에 export 추가
3. (새 카테고리인 경우) registry.ts에 등록
```

#### 프리셋 파일 구조

```typescript
export const myPalette: PaletteDefinition = {
  id: 'my-palette',
  displayName: '표시 이름',
  colors: {
    primary: '#FF6B6B',
    secondary: '#4ECDC4',
    accent: '#FFE66D',
  },
  bgStrategy: 'light',
  category: 'pop',
  description: '설명',
};
```

---

## 기술 스택

| 기술 | 버전 | 역할 |
|------|------|------|
| **React** | 19 | UI 프레임워크 |
| **TypeScript** | 5.9 | 타입 안전성 |
| **Vite** | 7 | 빠른 빌드 |
| **CSS Modules** | - | 스코프된 스타일 |
| **CSS Variables** | - | 런타임 테마 |

---

## 사용 대상

| 역할 | 활용 방법 |
|------|----------|
| **디자이너** | 팔레트 비교, 시맨틱 매핑 조정, 스타일 선택 |
| **프론트엔드 개발자** | CSS 변수 확인, 프리셋 추가, 테마 시스템 이해 |
| **디자인 시스템 담당자** | 토큰 관리, 브랜드 일관성 유지 |
| **PM/기획자** | 디자인 옵션 시각적 비교 및 의사결정 |

---

## 시작하기

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

---

## 관련 문서

- [튜토리얼](./TUTORIAL.md) - 단계별 사용 가이드
- [아키텍처](./ARCHITECTURE.md) - 시스템 구조
- [기여 가이드](./CONTRIBUTING.md) - 프로젝트 기여 방법
