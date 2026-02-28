# E03: 조합 시스템 구축

## 목표

Palette와 Style을 조합하여 최종 Theme를 생성하는 시스템 구축.

---

## 조합 흐름

```
┌─────────────────┐     ┌─────────────────┐
│  PaletteDefinition │     │  StyleDefinition  │
│  (배색 프리셋)      │     │  (스타일 프리셋)   │
└────────┬────────┘     └────────┬────────┘
         │                       │
         ▼                       │
┌─────────────────┐              │
│  ResolvedPalette │              │
│  (색상 스케일 +    │              │
│   시맨틱 색상)     │              │
└────────┬────────┘              │
         │                       │
         │    bg.base            │
         └───────────┬───────────┘
                     │
                     ▼
         ┌─────────────────────┐
         │   createStyle()     │
         │   (배경색 기반 그림자) │
         └──────────┬──────────┘
                    │
                    ▼
         ┌─────────────────────┐
         │   combineTheme()    │
         │   Palette + Style   │
         └──────────┬──────────┘
                    │
                    ▼
         ┌─────────────────────┐
         │      Theme          │
         │  (최종 테마 객체)     │
         └─────────────────────┘
```

---

## 타입 정의

```typescript
// themes/types.ts

/** 최종 테마 */
interface Theme {
  palette: PaletteName;
  style: StyleName;

  colors: {
    // 팔레트 스케일
    scales: GeneratedScales;

    // 시맨틱 색상
    bg: { base, surface, elevated, muted };
    text: { primary, secondary, muted, onAction };
    border: { default, subtle, focus };

    // 액션 색상 (기존 유지)
    action: {
      primary: { default, hover, active };
      secondary: { default, hover, active };
    };
  };

  shadows: {
    none, sm, md, lg, active;
  };

  border: {
    width: string;
    style: string;
  };
}
```

---

## 조합 함수

```typescript
// themes/combine.ts
import { createPalette, PaletteDefinition } from '../palettes';
import { createStyle, StyleDefinition } from '../styles';
import { generateActionColors } from '../utils/palette';

export function combineTheme(
  paletteDefinition: PaletteDefinition,
  styleDefinition: StyleDefinition
): Theme {
  // 1. Palette 해석
  const palette = createPalette(paletteDefinition);

  // 2. Style 해석 (배경색 전달)
  const style = createStyle(styleDefinition, palette.semantic.bg.base);

  // 3. 액션 색상 생성
  const actionColors = generateActionColors(palette.scales);

  // 4. 최종 테마 조합
  return {
    palette: palette.name,
    style: style.name,

    colors: {
      scales: palette.scales,
      bg: palette.semantic.bg,
      text: palette.semantic.text,
      border: palette.semantic.border,
      action: actionColors,
    },

    shadows: style.shadows,
    border: style.border,
  };
}
```

---

## ThemeProvider 수정

```typescript
// themes/ThemeProvider.tsx

interface ThemeContextValue {
  // 기존
  theme: Theme;

  // 분리된 선택자
  paletteName: PaletteName;
  styleName: StyleName;
  setPaletteName: (name: PaletteName) => void;
  setStyleName: (name: StyleName) => void;

  // 커스텀 팔레트 (기존 유지)
  customColors: ExternalPalette;
  setCustomColors: (colors: ExternalPalette) => void;
}

export function ThemeProvider({ children, initialPalette, initialStyle }) {
  const [paletteName, setPaletteName] = useState<PaletteName>(initialPalette);
  const [styleName, setStyleName] = useState<StyleName>(initialStyle);
  const [customColors, setCustomColors] = useState<ExternalPalette | null>(null);

  const theme = useMemo(() => {
    // 프리셋 또는 커스텀 팔레트 결정
    const paletteDefinition = customColors
      ? { name: 'custom', colors: customColors, bgStrategy: 'light' }
      : palettePresets[paletteName];

    const styleDefinition = stylePresets[styleName];

    return combineTheme(paletteDefinition, styleDefinition);
  }, [paletteName, styleName, customColors]);

  useEffect(() => {
    const cssVars = flattenToCSSVars({ color: theme.colors, shadow: theme.shadows });
    injectCSSVariables(cssVars);

    document.documentElement.setAttribute('data-palette', theme.palette);
    document.documentElement.setAttribute('data-style', theme.style);
  }, [theme]);

  // ...
}
```

---

## 사용 예시

```tsx
// App.tsx
function App() {
  const { paletteName, setPaletteName, styleName, setStyleName } = useTheme();

  return (
    <div>
      {/* 배색 선택 */}
      <select value={paletteName} onChange={e => setPaletteName(e.target.value)}>
        <option value="default">Default</option>
        <option value="vivid">Vivid</option>
        <option value="pastel">Pastel</option>
      </select>

      {/* 스타일 선택 */}
      <select value={styleName} onChange={e => setStyleName(e.target.value)}>
        <option value="minimal">Minimal</option>
        <option value="neumorphism">Neumorphism</option>
      </select>
    </div>
  );
}
```

---

## 작업 항목

### 1. 조합 함수 구현
- [ ] `combineTheme()` 함수
- [ ] `generateActionColors(scales)` 함수 추가 (`utils/palette.ts`에 구현)
- [ ] 타입 정의 업데이트

### 2. Theme 타입 확장
현재 `Theme` 타입에는 `palette`, `style`, `border`가 없다. 확장 필요:

```typescript
// 현재
interface Theme {
  name: ThemeName;
  colors: ThemeColors;
  shadows: ThemeShadows;
}

// 목표
interface Theme {
  palette: PaletteName;
  style: StyleName;
  colors: { scales, bg, text, border, action };
  shadows: ThemeShadows;
  border: { width, style };
}
```

- [ ] `Theme` 타입에 `palette`, `style` 필드 추가
- [ ] `Theme` 타입에 `border` 필드 추가
- [ ] Border CSS 변수 전략: `--ds-border-width`, `--ds-border-style` 주입

### 3. ThemeProvider 수정
- [ ] `paletteName`, `styleName` 상태 분리
- [ ] `setPaletteName()`, `setStyleName()` 제공
- [ ] `data-palette`, `data-style` 속성 주입

### 4. 프리셋 레지스트리
- [ ] `palettePresets` 객체
- [ ] `stylePresets` 객체

### 5. 기존 호환성 & 마이그레이션
- [ ] 기존 `themeName` API deprecated 처리 (또는 유지)
- [ ] 기존 `setThemeName('minimal')` → `setStyleName('minimal')` 매핑

**data-theme 마이그레이션 결정:**
- `data-theme` 속성은 **제거**하고 `data-palette`, `data-style`로 대체
- 외부에서 `data-theme`을 참조하는 CSS가 있다면 마이그레이션 가이드 제공
- `setThemeName()`은 **deprecated** 처리 (console.warn + 내부 매핑), 1~2 버전 후 제거

---

## CSS 변수 구조 변경

### Before
```css
:root[data-theme="minimal"] { ... }
:root[data-theme="neumorphism"] { ... }
```

### After
```css
:root[data-palette="vivid"][data-style="minimal"] { ... }
:root[data-palette="vivid"][data-style="neumorphism"] { ... }
```

실제로는 JS에서 CSS 변수를 동적 주입하므로, data 속성은 디버깅/스타일링 힌트용.

---

## 완료 기준

- [ ] `combineTheme()` 함수 동작
- [ ] Palette와 Style을 개별 선택 가능
- [ ] 어떤 조합이든 테마 생성 가능
- [ ] 기존 테마 전환 기능 호환
- [ ] CSS 변수 정상 주입
- [ ] **문서 반영**: `docs/design/ARCHITECTURE.md` 업데이트
- [ ] **문서 반영**: 토큰 아키텍처 문서 업데이트 (해당 시)

---

## 다음 단계

E04에서 연구 페이지 구축.
