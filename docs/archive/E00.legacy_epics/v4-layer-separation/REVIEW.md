# v4 레이어 분리 에픽 문서 검토

에픽 문서(E01~E04, epic-overview)와 현재 코드베이스·설계 문서(ARCHITECTURE, 03-token-architecture, 04-color-system)를 대조한 검토 결과입니다.

---

## 1. 잘 정리된 부분

- **에픽 목표·문제 정의**: 배색과 GUI 스타일이 한꺼번에 결정되는 현재 구조와, Palette × Style 분리의 목표가 명확함.
- **레이어 책임 분리**: Palette Layer(배경 전략, 시맨틱 색) / Style Layer(그림자, 테두리, 표면) 구분이 타당함.
- **작업 순서**: E01 → E02 → E03 → E04, 의존 관계가 문서에 맞게 설정됨.
- **폴더 구조**: `palettes/`, `styles/` 신규/리팩터 제안이 구체적임.
- **타입 정의**: PaletteDefinition, ResolvedPalette, StyleDefinition, ResolvedStyle, Theme 보강 방향이 E03까지 일관됨.

---

## 2. 누락·보완 필요 사항

### 2.1 Shadow 키 불일치 (E02 / E03 vs 현재 코드)

**현재 코드**

- `Theme` / `ThemeShadows`: `none`, `sm`, `md`, `lg`, `xl`, `inset`
- CSS 변수: `--ds-shadow-none`, `--ds-shadow-sm`, `--ds-shadow-md`, `--ds-shadow-lg`, `--ds-shadow-inset`
- 컴포넌트(Button, Card 등)는 `--ds-shadow-inset`을 active/pressed 상태에 사용

**에픽 문서 (E02/E03)**

- Style 쪽: `none`, `sm`, `md`, `lg`, `active` (pressed/inset 용도를 "active"로 표현)

**제안**

- 문서에 **결정 사항**을 명시하는 것이 좋음.
  - **옵션 A**: CSS 변수명은 기존 유지 → Theme/ResolvedStyle의 키를 `active` 대신 `inset`으로 사용. (코드 변경 최소)
  - **옵션 B**: `active`로 통일하고, 컴포넌트/변수에서 `--ds-shadow-inset` → `--ds-shadow-active` 마이그레이션 단계를 E02 또는 별도 작업으로 명시.
- `xl`은 현재 Theme에만 있고 variables.css에는 없음. E02에서 xl을 제거할지, 유지할지 문서에 한 줄이라도 적어두면 구현 시 혼선을 줄일 수 있음.

---

### 2.2 ResolvedPalette 타입 충돌 (E01)

**현재**

- `@types/tokens.d.ts`: `ResolvedPalette` = 4색상(primary, secondary, accent, sub) + `_meta` (파생 여부만).

**E01 이후**

- `ResolvedPalette` = name, bgStrategy, **scales**, **semantic** (bg, text, border) 포함.

이름이 같고 구조가 완전히 달라서, 그대로 적용하면 기존 `resolvePalette()` 반환 타입과 충돌합니다.

**제안**

- **이름 분리**:  
  - 기존 “4색상만 해결” 타입 → 예: `ResolvedColors` 또는 `ResolvedPaletteInput`  
  - E01의 “배경 전략·스케일·시맨틱까지 적용된 결과” → `ResolvedPalette` 유지  
  - `resolvePalette()`는 계속 “4색상 해결”만 담당하고, E01의 `createPalette()`가 내부에서 `resolvePalette(definition.colors)` 호출 후 스케일·시맨틱 적용.
- E01 문서에 “기존 `ResolvedPalette` 타입과의 관계 및 리네이밍” 절을 추가하는 것을 권장.

---

### 2.3 generateActionColors (E03)

**E03 `combineTheme()` 예시**

- `generateActionColors(palette.scales)` 호출로 `action` 색상 생성.

**현재 코드**

- `utils/palette.ts`에는 `resolvePalette`, `generateColorScales`, `generateColorScale`만 있고 `generateActionColors` 없음.
- 액션 색상은 각 테마(minimal/neumorphism)의 tokens에서 `scales.primary[500]` 등으로 직접 구성.

**제안**

- E03 작업 목록에 **“`generateActionColors(scales): ThemeActionColors` 추가 (utils/palette 또는 palettes/ 내부)”** 를 명시.
- 입력: `GeneratedScales`, 출력: `action: { primary, secondary, accent }` 각각 `{ default, hover, active }`.  
  → 기존 minimal/neumorphism의 action 구조와 동일하게 맞추면 Theme 타입과 호환됨.

---

### 2.4 Theme 타입 확장 (E03)

**현재 `Theme`** (`@types/theme.d.ts`)

- `name: ThemeName`, `colors`, `shadows` 만 있음.

**E03 문서의 `Theme`**

- `palette: PaletteName`, `style: StyleName`
- `colors`: scales, semantic(bg, text, border), action
- `shadows`: none, sm, md, lg, active(또는 inset)
- **`border`: `{ width: string; style: string }`** (Style에서 옴)

**제안**

- E03 “작업 순서”에 **“Theme 타입 확장 (palette, style, border 추가)”** 를 명시.
- CSS 변수로 border width/style을 쓸지 여부(예: `--ds-border-width`, `--ds-border-style`)를 한 줄이라도 적어두면, 컴포넌트에서 일관되게 적용하기 쉬움.

---

### 2.5 E01 프리셋 개수·우선순위

- E01 폴더 구조: `default`, `vivid`, `pastel`, `monochrome`, `earth` 5개.
- E01 작업 순서·체크리스트: default, vivid, pastel **3개만** 구체적으로 언급.

**제안**

- “최소 3개 (default, vivid, pastel) 필수, monochrome/earth는 P1·P2”처럼 **범위와 우선순위**를 한 줄로 명시하면 구현 범위가 명확해짐.

---

### 2.6 E02 ResolvedStyle과 surface / states

- **StyleDefinition**에는 `surface`, `states`가 있음.
- **ResolvedStyle**과 **createStyle()** 반환값에는 `shadows`, `border`만 있고, surface/states는 없음.

**제안**

- surface/states를 **어디까지 사용할지** 문서에 명시:
  - **옵션 A**: ResolvedStyle/Theme에 넣지 않고, “스타일 가이드·문서용” 또는 컴포넌트 로직에서 StyleDefinition을 직접 참조.
  - **옵션 B**: ResolvedStyle(및 필요 시 Theme)에 surface, states를 포함하고, CSS 변수 또는 data 속성으로 내려서 컴포넌트가 참조 (예: `data-surface="raised"`).
- 선택한 쪽을 E02 “완료 기준”이나 “다음 단계”에 한 줄로 적어두면 E03·컴포넌트 작업 시 일관됨.

---

### 2.7 Border 색상 (Style vs Palette)

- E02 Style: `border.width`, `border.style`, `useColor: boolean`.
- 테두리 **색상**은 Palette 시맨틱(border.default, subtle, focus)에 있음.

**현재 코드**

- Neumorphism은 `border.default: 'transparent'`로 “선 없음”을 표현.

**제안**

- “테두리 색은 Palette 시맨틱, 두께/스타일은 Style”이 E02/E03에 이미 암묵적으로 있으므로, E02 “타입 정의” 옆에 **“border color는 Palette semantic에서만 가져옴”** 한 줄을 넣으면 구현 시 혼동을 줄일 수 있음.

---

### 2.8 E04 라우팅·라이브러리

- E04: “라우터 라이브러리 없이 useState로 페이지 전환”이라고 되어 있음.

**제안**

- “현재 POC는 단일 페이지/탭 전환으로 한정”인지, “추후 react-router 도입 가능”인지 한 줄만 적어두면, 나중에 라우터 도입 시 에픽 범위와 충돌하지 않음.

---

### 2.9 data-theme → data-palette / data-style

- E03: `data-palette`, `data-style` 사용.
- 현재 ThemeProvider: `data-theme`만 설정.

**제안**

- E03 “CSS 변수/속성 변경”에 이미 Before/After가 있으므로, **“기존 `data-theme` 제거 및 선택자 정리”** 를 작업 목록에 넣어두면, 기존에 `[data-theme="minimal"]` 등으로 스타일을 건 경우 마이그레이션을 놓치지 않음. (현재 코드에는 해당 선택자 없음.)

---

### 2.10 기존 API 호환 (setThemeName)

- E03: “기존 themeName API deprecated 처리 (또는 제거)”, “setThemeName('minimal') → setStyleName('minimal') 전환”이라고 되어 있음.

**제안**

- “Deprecated만 두고 setThemeName을 내부에서 setStyleName으로 매핑”할지, “setThemeName 제거 후 setPaletteName/setStyleName만 노출”할지 결정을 문서에 적어두면, App·Navigation 등 소비처 수정 범위가 명확해짐.

---

## 3. 문서 간 일관성

- **03-token-architecture**: Layer 5가 “테마 토큰 (Minimal/Neumorphism)”. v4 이후에는 “Palette + Style 조합 결과”로 바뀌므로, 에픽 완료 후 03 문서에 “v4: Palette 레이어 / Style 레이어 결합” 내용을 짧게 반영하면 좋음.
- **ARCHITECTURE.md**: “Token Flow”가 현재 구조 기준. E03 적용 후 `combineTheme()`와 palette/style 분리가 플로우에 들어가면, 해당 다이어그램을 한 번 갱신하는 것을 E03 완료 기준에 넣을 수 있음.

---

## 4. 요약 체크리스트 (문서 보완 제안)

| 항목 | 제안 | 반영 여부 |
|------|------|-----------|
| Shadow 키 | E02에 inset vs active 결정 및 xl 유지 여부 명시 | ✅ 반영됨 |
| ResolvedPalette | E01에 기존 타입과의 구분(이름·역할) 추가 | ✅ 반영됨 |
| generateActionColors | E03 작업 목록에 함수 추가 명시 | ✅ 반영됨 |
| Theme 타입 | E03에 palette, style, border 확장 및 (선택) CSS 변수 전략 명시 | ✅ 반영됨 |
| E01 프리셋 | default/vivid/pastel 필수, monochrome/earth 우선순위 명시 | ✅ 반영됨 |
| surface/states | E02에 ResolvedStyle/Theme 포함 여부 결정 명시 | ✅ 반영됨 |
| Border 색상 | E02에 "색은 Palette, 두께/스타일은 Style" 명시 | ✅ 반영됨 |
| E04 라우팅 | useState 전환 범위·추후 라우터 도입 가능성 한 줄 명시 | ✅ 반영됨 |
| data 속성 | E03에 data-theme 제거·마이그레이션 작업 포함 | ✅ 반영됨 |
| setThemeName | Deprecated vs 제거 결정 문서화 | ✅ 반영됨 |
| 설계 문서 | E03 완료 시 ARCHITECTURE·03-token-architecture 반영 | ✅ 반영됨 |

---

## 5. 반영 완료 (2026-02-28)

모든 리뷰 항목이 각 에픽 문서에 반영되었습니다:

- **E01**: ResolvedPalette → ResolvedColors 리네이밍, ExpandedPalette 신규 타입 추가, 프리셋 우선순위 명시 (P0/P1/P2)
- **E02**: Shadow 키 inset/xl 유지 결정, surface/states는 가이드 전용, Border 책임 분리 명시
- **E03**: generateActionColors 작업 추가, Theme 타입 확장 명시, data-theme 마이그레이션 전략, setThemeName deprecated 결정, 완료 기준에 문서 반영 포함
- **E04**: 라우팅 전략 및 react-router 도입 가능성 명시
