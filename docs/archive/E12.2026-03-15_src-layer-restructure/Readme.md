# Epic E12: src/ 계층 구조 재설계

## 목표

`src/` 디렉토리를 **domain / app / shared** 3계층으로 재편한다.
"새 파일을 어디에 두어야 하나?"와 "도메인 로직이 어디 있나?" 두 질문에
디렉토리 구조만으로 즉시 답할 수 있도록 한다.

## 배경 / 맥락

현재 `src/` 최상위는 기술 역할 기준 디렉토리(`components/`, `hooks/`, `utils/`)와
도메인 기준 디렉토리(`palettes/`, `themes/`, `tokens/`)가 같은 레벨에 혼재한다.
`constants/`와 `utils/`는 도메인 상수·로직과 앱/인프라 코드가 단일 파일로 섞여 있어,
파일 위치 결정과 도메인 로직 탐색 두 측면 모두에서 인지 부담을 준다.

E11에서 도메인 모델과 레이어 경계를 정비했지만, 디렉토리 최상위 구조 자체는
아직 그 원칙을 반영하지 않은 상태다.

## 계층 정의

| 계층 | 역할 | 핵심 질문 |
|---|---|---|
| `domain/` | 비즈니스 개념의 순수 표현. React/브라우저 없음 | "이 개념이 뭔지"에 관한 코드인가? |
| `app/` | React 애플리케이션 동작. 도메인을 UI로 연결 | "이 개념을 어떻게 쓰는지"에 관한 코드인가? |
| `shared/` | 계층 지식 없는 범용 유틸/자원 | 도메인도 앱도 모르는 코드인가? |

### 의존성 방향 (엄격)

```
app/  →  domain/  →  shared/
app/  →  shared/
(domain은 app을 모른다, shared는 domain/app을 모른다)
```

### "어디에 넣어야 하나?" 판단 기준

1. React import가 있으면 → `app/`
2. `localStorage`, `fetch`, 파일 I/O가 있으면 → `app/infra/`
3. palette/theme/token 개념을 다루되 React 없으면 → `domain/`
4. 어떤 도메인 지식도 없는 순수 함수면 → `shared/utils/`

## 목표 구조

```
src/
  domain/
    palettes/          ← utils/palette.ts 흡수
    themes/
    tokens/            ← utils/system-colors.ts 흡수
    styles/            ← .ts 파일만 (preset 로직 + CSS var 생성 함수)
    constants/         ← 도메인 상수 + lab-presets 데이터 부분
  app/
    components/
    pages/
    layouts/
    hooks/
    state/
    content/           ← 기존 content/ + constants/*-content.ts 통합
    config/
    infra/
      storage.ts       ← component-mapping-storage.ts
      export.ts        ← yamang-export.ts
  shared/
    utils/             ← clsx, css, css-structured, color (순수 함수)
    styles/            ← .css 파일만 (reset, variables, transitions 등)
    @types/
    assets/
  App.tsx
```

## 디렉토리 매핑 (현재 → 신규)

### → domain/

| 현재 | 신규 |
|---|---|
| `palettes/` | `domain/palettes/` |
| `themes/` | `domain/themes/` |
| `tokens/` | `domain/tokens/` |
| `styles/presets/*.ts`, `styles/types.ts`, `styles/index.ts` | `domain/styles/` |
| `constants/palette-definitions.ts` | `domain/constants/` |
| `constants/palette-scales.ts` | `domain/constants/` |
| `constants/semantic-presets.ts` | `domain/constants/` |
| `constants/theme-presets.ts` | `domain/constants/` |
| `constants/component-tokens.ts` | `domain/constants/` |
| `utils/palette.ts` | `domain/palettes/` 내부 흡수 |
| `utils/system-colors.ts` | `domain/tokens/` 내부 흡수 |
| `constants/lab-presets.ts` (데이터 부분) | `domain/constants/` |
| `constants/lab-presets.ts` (CSS var 생성 부분) | `domain/styles/` |

### → app/

| 현재 | 신규 |
|---|---|
| `components/` | `app/components/` |
| `pages/` | `app/pages/` |
| `layouts/` | `app/layouts/` |
| `hooks/` | `app/hooks/` |
| `state/` | `app/state/` |
| `content/` | `app/content/` |
| `config/` | `app/config/` |
| `constants/build-content.ts` 외 `*-content.ts` | `app/content/` 통합 |
| `utils/component-mapping-storage.ts` | `app/infra/storage.ts` |
| `utils/yamang-export.ts` | `app/infra/export.ts` |

### → shared/

| 현재 | 신규 |
|---|---|
| `utils/clsx.ts`, `utils/css.ts`, `utils/css-structured.ts` | `shared/utils/` |
| `utils/color.ts` | `shared/utils/` |
| `styles/*.css` | `shared/styles/` |
| `@types/` | `shared/@types/` |
| `assets/` | `shared/assets/` |

## 특이점

- **`styles/` 분리**: `.ts` 파일(스타일 도메인 로직)은 `domain/styles/`로, `.css` 파일(전역 CSS)은 `shared/styles/`로 분리된다. 같은 폴더가 두 계층에 걸쳐 있던 현재 상태가 해소된다.
- **`utils/palette.ts`, `utils/system-colors.ts`**: 별도 `domain/utils/`를 만들지 않고 개념이 속하는 도메인 디렉토리 내부로 흡수한다.
- **`constants/lab-presets.ts`**: 파일을 분리해야 한다. 데이터는 `domain/constants/`, CSS var 생성 함수는 `domain/styles/`로.
- **`hooks/`**: 도메인 지식을 담은 훅(`usePalettePresets` 등)이지만 React 의존성이 있으므로 `app/hooks/`에 위치한다. 도메인↔UI 브리지 역할임을 인지한다.
- **import path 대규모 변경**: P05에서 tsconfig paths alias와 전체 import 경로를 일괄 수정해야 한다.

## Phase 목록

- [P01: 설계 문서 기록](./P01-design-doc.md)
- [P02: domain/ 레이어 구성](./P02-domain-layer.md)
- [P03: app/ 레이어 구성](./P03-app-layer.md)
- [P04: shared/ 레이어 구성](./P04-shared-layer.md)
- [P05: import 경로 수정 및 빌드 검증](./P05-import-paths.md)

## 상태

- [x] P01 완료
- [x] P02 완료
- [x] P03 완료
- [x] P04 완료
- [x] P05 완료

## 완료
아카이브일: 2026-03-18
