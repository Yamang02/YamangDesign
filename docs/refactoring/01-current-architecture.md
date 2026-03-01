# 현재 아키텍처 분석

## 개요

YamangDesign은 5계층 토큰 아키텍처를 사용하는 디자인 시스템입니다.

---

## 계층 구조

```
┌─────────────────────────────────────────────────────────┐
│                    Theme (최종 출력)                     │
│              colors, shadows, border                     │
└─────────────────────────────────────────────────────────┘
                         ▲
          ┌──────────────┴──────────────┐
          │                             │
┌─────────────────────┐     ┌─────────────────────┐
│   Palette Layer     │     │    Style Layer      │
│   (E01: 배색)        │     │   (E02: GUI 효과)    │
│   - primary         │     │   - minimal         │
│   - secondary       │     │   - neumorphism     │
│   - accent          │     │   - brutalism       │
│   - neutral/sub     │     │                     │
└─────────────────────┘     └─────────────────────┘
          │                             │
          ▼                             ▼
┌─────────────────────┐     ┌─────────────────────┐
│ createPalette()     │     │ createStyle()       │
│ → ExpandedPalette   │     │ → shadows, border   │
└─────────────────────┘     └─────────────────────┘
          │                             │
          └──────────────┬──────────────┘
                         ▼
                  combineTheme()
                         │
                         ▼
              flattenToCSSVars()
                         │
                         ▼
               var(--ds-xxx)
```

---

## 주요 파일 및 책임

### 타입 정의
| 파일 | 책임 |
|------|------|
| `src/@types/theme.d.ts` | 테마 관련 전역 타입 (ThemeName, StyleName, PaletteName) |
| `src/@types/tokens.d.ts` | 토큰 타입 (ExternalPalette, GeneratedScales) |
| `src/palettes/types.ts` | 팔레트 레이어 타입 (PaletteDefinition, SemanticMapping) |

### 팔레트 레이어 (E01)
| 파일 | 책임 |
|------|------|
| `src/palettes/index.ts` | createPalette() 함수 |
| `src/palettes/presets/` | 팔레트 프리셋 (default, natural 카테고리) |
| `src/palettes/strategies/` | 배경 전략 (light, colored, dark) |
| `src/palettes/mapping/` | 시맨틱 색상 해석 |

### 스타일 레이어 (E02)
| 파일 | 책임 |
|------|------|
| `src/styles/index.ts` | createStyle() 함수 |
| `src/styles/presets/` | 스타일 프리셋 (minimal, neumorphism) |

### 테마 조합 (E03)
| 파일 | 책임 |
|------|------|
| `src/themes/combine.ts` | combineTheme() - Palette × Style 조합 |
| `src/themes/presets.ts` | palettePresets, stylePresets 내보내기 |
| `src/themes/ThemeProvider.tsx` | React Context + CSS 변수 주입 |
| `src/themes/ThemeContext.ts` | Context 타입 정의 |

### 상수 및 설정
| 파일 | 책임 |
|------|------|
| `src/constants/theme-presets.ts` | 테마 프리셋 단일 소스 (SOT) |
| `src/constants/semantic-presets.ts` | 커스텀 시맨틱 프리셋 저장 |
| `src/constants/lab-presets.ts` | Lab UI용 프리셋 |

---

## 데이터 흐름

### 1. 팔레트 선택 → CSS 변수

```typescript
// 사용자가 팔레트 선택
setPaletteName('springCreamSoda01');

// ThemeProvider 내부 처리
const basePaletteDefinition = useMemo(() => {
  // 1. custom-semantic 체크
  // 2. customColors 체크
  // 3. preset 조회
}, [paletteName, customColors, customSemanticPresets]);

// 팔레트 확장
const expandedPalette = createPalette(basePaletteDefinition);

// 테마 조합
const theme = combineTheme(paletteDefinition, styleDef);

// CSS 변수 주입
injectCSSVariables({
  ...primitiveCSSVars,
  ...paletteScaleVars,
  ...themeCSSVars,
});
```

### 2. 시맨틱 매핑 해석

```typescript
SemanticMapping {
  bg: {
    base: { scale: 'neutral', step: 50 }  // ScaleReference
    surface: '#FFFFFF'                     // Direct color
  }
}
        ↓
resolveColorValue(mapping.bg.base, scales)
        ↓
scales['neutral'][50] → '#FAFAFA'
```

---

## 상태 관리 구조

### ThemeProvider 상태

```typescript
// 핵심 상태
const [styleName, setStyleName] = useState<StyleName>('minimal');
const [paletteName, setPaletteNameState] = useState<PaletteName>('default');
const [customColors, setCustomColorsState] = useState<ExternalPalette | null>(null);
const [systemPreset, setSystemPresetState] = useState<SystemPresetName>('default');

// 커스텀 시맨틱 프리셋 (localStorage 연동)
const [customSemanticPresets, setCustomSemanticPresetsState] = useState<CustomSemanticPreset[]>(() => {
  // localStorage에서 초기화
});
```

### PaletteLab 상태

```typescript
// 현재: 분산된 상태
const [detailSelection, setDetailSelection] = useState<DetailSelection>(null);
const [mappingModalTarget, setMappingModalTarget] = useState<MappingModalTarget>(null);
const [mappingOverrides, setMappingOverrides] = useState<Partial<SemanticMapping> | null>(null);
const [activeBrandTab, setActiveBrandTab] = useState<BrandColorTabId>('default');
```

---

## CSS 변수 네이밍 규칙

```
--ds-{category}-{property}-{variant}

예시:
--ds-color-bg-base           // 배경 기본
--ds-color-text-primary      // 텍스트 주요
--ds-color-primary-500       // 팔레트 스케일
--ds-shadow-md               // 그림자
--ds-spacing-4               // 간격
```

---

## 컴포넌트 패턴

```
ComponentName/
├── ComponentName.tsx           # 컴포넌트 구현
├── ComponentName.types.ts      # Props 타입
├── ComponentName.module.css    # CSS 모듈 (var(--ds-*) 사용)
└── index.ts                    # export
```

---

## 현재 아키텍처 강점

1. **관심사 분리**: Palette와 Style이 독립적으로 관리됨
2. **유연한 조합**: 어떤 Palette와 Style도 조합 가능
3. **CSS 변수 기반**: 런타임 테마 전환 지원
4. **프리셋 시스템**: 사전 정의된 테마 쉽게 적용

## 현재 아키텍처 약점

1. **타입 중복**: PaletteName이 여러 곳에서 다르게 정의
2. **상태 분산**: 관련 상태가 여러 위치에서 독립적으로 관리
3. **로직 중복**: 팔레트 해석 로직이 여러 곳에서 반복
4. **컴포넌트 중복**: 유사한 UI 패턴이 별도 구현

다음 문서에서 각 문제점을 상세히 분석합니다.
