import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react';
import type { Theme, ThemeName } from '../@types/theme';
import type { ExternalPalette } from '../@types/tokens';
import { resolvePalette } from '../utils/palette';
import { flattenToCSSVars, injectCSSVariables } from '../utils/css';
import { createMinimalTheme } from './minimal';
import { createNeumorphismTheme } from './neumorphism';
import {
  spacing,
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  borderRadius,
  borderWidth,
  componentHeight,
  zIndex,
  duration,
  easing,
  stateLayer,
} from '../tokens/primitives';

// 기본 팔레트
const defaultPalette: ExternalPalette = {
  primary: '#6366F1',
};

// Context 타입
interface ThemeContextValue {
  theme: Theme;
  themeName: ThemeName;
  setThemeName: (name: ThemeName) => void;
  palette: ExternalPalette;
  setPalette: (palette: ExternalPalette) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

// Provider Props
interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: ThemeName;
  initialPalette?: ExternalPalette;
}

export function ThemeProvider({
  children,
  initialTheme = 'minimal',
  initialPalette = defaultPalette,
}: ThemeProviderProps) {
  const [themeName, setThemeName] = useState<ThemeName>(initialTheme);
  const [palette, setPalette] = useState<ExternalPalette>(initialPalette);

  // 테마 객체 생성 (메모이제이션)
  const theme = useMemo(() => {
    const resolved = resolvePalette(palette);

    switch (themeName) {
      case 'minimal':
        return createMinimalTheme(resolved);
      case 'neumorphism':
        return createNeumorphismTheme(resolved);
      default:
        return createMinimalTheme(resolved);
    }
  }, [themeName, palette]);

  // CSS 변수 주입
  useEffect(() => {
    // 테마 색상 & 그림자
    const themeCSSVars = flattenToCSSVars({
      color: theme.colors,
      shadow: theme.shadows,
    });

    // Primitive 토큰 (테마 무관)
    const primitiveCSSVars = flattenToCSSVars({
      spacing,
      font: fontFamily,
      text: fontSize,
      'font-weight': fontWeight,
      leading: lineHeight,
      radius: borderRadius,
      border: borderWidth,
      size: componentHeight,
      z: zIndex,
      duration,
      ease: easing,
    });

    // State layer opacity (number → string, flattenToCSSVars는 string만 처리)
    const stateLayerVars: Record<string, string> = {
      '--ds-state-hover-opacity': String(stateLayer.hover),
      '--ds-state-pressed-opacity': String(stateLayer.pressed),
      '--ds-state-focus-opacity': String(stateLayer.focus),
      '--ds-state-selected-opacity': String(stateLayer.selected),
      '--ds-state-disabled-opacity': String(stateLayer.disabled),
    };

    // 모든 CSS 변수 주입
    injectCSSVariables({
      ...primitiveCSSVars,
      ...themeCSSVars,
      ...stateLayerVars,
    });

    // data 속성으로 테마 표시
    document.documentElement.setAttribute('data-theme', themeName);
  }, [theme, themeName]);

  const value: ThemeContextValue = {
    theme,
    themeName,
    setThemeName,
    palette,
    setPalette,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

// Hook
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
