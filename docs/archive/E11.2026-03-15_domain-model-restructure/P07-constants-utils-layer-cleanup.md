# P07: constants/utils 레이어 완성

## 목표

P03에서 `state/` 레이어 분리를 시작했지만 미완으로 남은 `constants/`와 `utils/`의
도메인/앱 레이어 혼재를 해소한다.
"도메인 코드는 도메인 레이어에, 앱 코드는 앱 레이어에"를 `src/` 전체에 일관되게 적용한다.

## 배경

E11의 목표 중 하나가 "레이어 경계를 명확히"였으나, P03은 `PaletteSelection` 이동에 집중했다.
`constants/`와 `utils/`는 여전히 성격이 다른 코드들이 혼재한다.
이는 새 기능 추가 시 "어디에 파일을 놓아야 하는가"를 결정하기 어렵게 만들고,
도메인 레이어가 앱 레이어에 암묵적으로 의존하는 역전 현상을 유발할 수 있다.

## 현황 분석

### constants/ 디렉토리

| 파일 | 실제 성격 | 문제점 |
|---|---|---|
| `palette-definitions.ts` | 도메인 re-export | `themePresets` 참조 중계만 하는 파일, 직접 참조로 대체 검토 |
| `theme-presets.ts` | 도메인 상수 (registry SOT) | `palettes/`로 이동하는 것이 의미론적으로 적합 |
| `palette-scales.ts` | 도메인 상수 | `palettes/`로 이동 또는 현위치 유지(영향 범위 검토) |
| `semantic-presets.ts` | 앱 레이어 (localStorage 커스텀 프리셋 관리) | 현위치 적절 |
| `lab-presets.ts` | **혼재**: CSS var 생성(앱) + 도메인 preset 조회 | 역할 분리 필요 |
| `build-content.ts` | 앱 레이어 (빌드 페이지 콘텐츠) | `pages/build/`로 이동 적절 |
| `showcase-content.ts` | 앱 레이어 (빌드 페이지 쇼케이스) | `pages/build/`로 이동 적절 |
| `lab-content.ts` | 앱 레이어 (Labs 페이지 콘텐츠) | `pages/labs/`로 이동 적절 |
| `landing-content.ts` | 앱 레이어 (Landing 페이지 콘텐츠) | `pages/landing/` 또는 `pages/home/`으로 이동 적절 |
| `component-tokens.ts` | 앱 레이어 (컴포넌트 토큰 목록) | `pages/build/`로 이동 또는 현위치 유지 |

### utils/ 디렉토리

| 파일 | 실제 성격 | 문제점 |
|---|---|---|
| `css.ts` | 도메인 유틸 (CSS var 직렬화) | 현위치 적절 |
| `css-structured.ts` | 도메인 유틸 | 현위치 적절 |
| `color.ts` | 도메인 유틸 (색상 계산) | 현위치 적절 |
| `system-colors.ts` | 도메인 유틸 | 현위치 적절 |
| `clsx.ts` | 범용 유틸 | 현위치 적절 |
| `palette.ts` | 도메인 유틸 (팔레트 계산 보조) | `palettes/` 내부로 이동 검토 |
| `palette-selection.ts` | **deprecated re-export 스텁** | P03에서 실구현이 `state/`로 이동됨. 완전 제거 가능 |
| `component-mapping-storage.ts` | 앱/인프라 (localStorage CRUD) | `state/` 또는 `hooks/`로 이동 검토 |
| `yamang-export.ts` | 앱 레이어 (내보내기 기능) | 현위치 적절 또는 기능 디렉토리로 이동 |

### template/ 디렉토리

| 파일 | 실제 성격 | 문제점 |
|---|---|---|
| `palette-preset.template.ts` | 팔레트 도메인 템플릿 | `palettes/templates/`로 이동 적절 |

## 구현 상세

### 원칙

변경의 기준은 **의존성 방향**이다:
- 도메인 레이어(`palettes/`, `styles/`, `themes/`, `tokens/`)는 앱 레이어에 의존해서는 안 된다.
- 앱 레이어(`pages/`, `state/`, `hooks/`, `components/`)는 도메인 레이어에 의존할 수 있다.
- `constants/`와 `utils/`는 현재 어느 쪽에도 속하지 않아 방향이 불명확하다.

### Step 1: utils/palette-selection.ts 제거

P03에서 실구현이 `state/palette-selection.ts`로 이동됐고,
`utils/palette-selection.ts`는 re-export + deprecated 래퍼만 남은 스텁 파일이다.

```
1. utils/palette-selection.ts를 import하는 파일 전수 조사
2. 각 import를 state/palette-selection 또는 state/types 직접 참조로 교체
3. utils/palette-selection.ts 파일 삭제
```

### Step 2: constants/lab-presets.ts 역할 분리

현재 `lab-presets.ts`는 두 가지 성격의 코드를 담고 있다:
- **CSS var 생성 함수**: `getThemeVariables`, `getStyleVariables`, `getSystemColorVariables` 등 → 앱 레이어 (빌드/랩 페이지 전용)
- **비교 프리셋 목록**: `comparisonPresets` → 앱 레이어이지만 여러 페이지가 공유

P06 Step 2에서 `getThemeVariables`를 수정하게 되므로, 이 시점에 파일 위치도 함께 검토한다.

**옵션 A — 현위치 유지, 역할 주석 명확화**
파일 이동 없이 `constants/lab-presets.ts`에 명시적인 레이어 주석을 추가.
이동 비용 대비 실익이 적을 경우 선택.

**옵션 B — 앱 레이어 파일로 이동**
`src/app/theme-preview.ts` 또는 `src/utils/preview-vars.ts`로 이동.
도메인 레이어(`themes/presets.ts`)와 명확히 분리.

현재 import 그래프의 복잡도를 고려해 **옵션 A를 우선**으로 하되,
향후 페이지 레이어 재구성 시 B로 전환.

### Step 3: 페이지별 콘텐츠 상수 이동

아래 파일들은 특정 페이지에서만 사용하는 콘텐츠 상수다.
`constants/`에 두는 것보다 해당 페이지 디렉토리에 두는 것이 응집도가 높다.

```
constants/build-content.ts     → pages/build/content.ts
constants/showcase-content.ts  → pages/build/showcase-content.ts  (또는 동일 파일에 병합)
constants/lab-content.ts       → pages/labs/content.ts
constants/landing-content.ts   → pages/(landing or home)/content.ts
```

이동 전 각 파일의 실제 import 현황을 확인해 영향 범위를 파악한다.
여러 페이지가 공유하는 콘텐츠 상수가 있다면 `constants/`에 유지한다.

### Step 4: template/ 이동

```
src/template/palette-preset.template.ts
  → src/palettes/templates/palette-preset.template.ts
```

팔레트 프리셋 작성 가이드 파일이므로 팔레트 도메인 내부에 위치하는 것이 적절하다.

### Step 5: constants/theme-presets.ts 위치 검토

`theme-presets.ts`는 registry를 읽어 `themePresets` Record를 생성하는 도메인 상수 파일이다.
`palettes/presets/index.ts` 또는 `palettes/index.ts`에서 export하는 것이 의미론적으로 더 자연스럽다.

단, 이 파일은 `PaletteName` 타입과 `BuiltinPaletteId`도 정의하며 `@types/theme.d.ts`가 re-export한다.
타입 순환 의존성 발생 여부를 먼저 확인한 후 이동 여부 결정.

## 최종 목표 구조

```
src/
  palettes/
    presets/
      templates/              ← template/ 이동
        palette-preset.template.ts
      registry.ts
      ...
    types.ts
    index.ts
  constants/
    palette-scales.ts         ← 현위치 유지 (이동 시 순환 의존 위험)
    semantic-presets.ts       ← 현위치 유지 (앱 레이어 맞음)
    lab-presets.ts            ← 현위치 유지, 레이어 주석 명확화 (Step 2 옵션 A)
    component-tokens.ts       ← 현위치 유지 또는 pages/build/로 이동
    (build-content.ts)        ← pages/build/로 이동
    (showcase-content.ts)     ← pages/build/로 이동
    (lab-content.ts)          ← pages/labs/로 이동
    (landing-content.ts)      ← pages/(landing)/로 이동
  state/
    types.ts
    palette-selection.ts
  utils/
    css.ts, css-structured.ts, color.ts, system-colors.ts, clsx.ts  ← 현위치 유지
    palette.ts                ← 현위치 유지 (이동 시 영향 범위 검토 필요)
    component-mapping-storage.ts  ← 현위치 유지 또는 state/로 이동
    yamang-export.ts          ← 현위치 유지
    (palette-selection.ts)    ← 삭제 (Step 1)
```

## 체크리스트

- [ ] `utils/palette-selection.ts` import 현황 전수 조사
- [ ] 각 import를 `state/palette-selection` 직접 참조로 교체
- [ ] `utils/palette-selection.ts` 파일 삭제
- [ ] `constants/lab-presets.ts`에 레이어 역할 명시 주석 추가 (옵션 A 선택 시)
- [ ] `constants/build-content.ts`, `showcase-content.ts` import 현황 조사 → 단일 페이지 한정 여부 확인
- [ ] `constants/lab-content.ts` import 현황 조사 → 이동 여부 결정
- [ ] `constants/landing-content.ts` import 현황 조사 → 이동 여부 결정
- [ ] 이동 결정된 콘텐츠 상수 파일 이동 및 import 경로 업데이트
- [ ] `template/palette-preset.template.ts` → `palettes/templates/`로 이동
- [ ] `constants/theme-presets.ts` 순환 의존 여부 확인 → `palettes/`로 이동 가능 여부 결정
- [ ] barrel export(`index.ts`) 파일들 경로 일관성 최종 점검
- [ ] TypeScript 컴파일 오류 없음 확인
