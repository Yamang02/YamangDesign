import { describe, expect, it } from 'vitest';
import categoriesJson from '@shared/content/labs/token-lab/categories.json';
import { themeRegistry } from '@domain/palettes/presets/registry';
import { stylePresets } from '@domain/themes/presets';
import { buildThemeAndTokenSet } from '@domain/themes/token-set';

type TokenLabCategories = {
  aliasGroups: Array<{
    title: string;
    tokens: string[];
  }>;
};

const REQUIRED_STYLE_VAR_KEYS = [
  '--ds-radius-sm',
  '--ds-radius-md',
  '--ds-radius-lg',
  '--ds-radius-full',
  '--ds-duration-instant',
  '--ds-duration-fast',
  '--ds-duration-normal',
  '--ds-duration-slow',
  '--ds-ease-easeOut',
  '--ds-ease-easeInOut',
  '--ds-ease-productive',
] as const;

describe('E17 style expressiveness contracts', () => {
  it('모든 스타일 preset이 metadata를 가진다', () => {
    for (const style of Object.values(stylePresets)) {
      expect(style.metadata).toBeDefined();
      expect(style.metadata?.era).toBeTruthy();
      expect(style.metadata?.origin).toBeTruthy();
      expect(style.metadata?.characteristics.length).toBeGreaterThan(0);
      expect(style.metadata?.description).toBeTruthy();
    }
  });

  it('모든 스타일 preset의 createVars는 핵심 radius/motion 키를 포함한다', () => {
    for (const style of Object.values(stylePresets)) {
      const vars = style.createVars?.({ bgColor: '#FFFFFF' }) ?? {};
      for (const key of REQUIRED_STYLE_VAR_KEYS) {
        expect(vars[key]).toBeDefined();
      }
    }
  });

  it('glassmorphism의 bgStrategy 선호/비호환 규칙이 겹치지 않는다', () => {
    const glass = stylePresets.glassmorphism;
    const preferred = new Set(glass.preferredBgStrategies ?? []);
    const incompatible = new Set(glass.incompatibleBgStrategies ?? []);

    expect(preferred.has('dark')).toBe(true);
    expect(preferred.has('colored')).toBe(true);
    expect(incompatible.has('light')).toBe(true);

    for (const value of preferred) {
      expect(incompatible.has(value)).toBe(false);
    }
  });
});

describe('E17 historical palette contracts', () => {
  it('historical 카테고리가 registry에 등록되어 있다', () => {
    const historical = themeRegistry.find((group) => group.category === 'historical');
    expect(historical).toBeDefined();
    expect(historical?.themes.length).toBeGreaterThanOrEqual(5);
  });

  it('historical 팔레트의 recommendedForStyles는 유효한 스타일 이름만 가진다', () => {
    const styleNames = new Set(Object.keys(stylePresets));
    const historical = themeRegistry.find((group) => group.category === 'historical');
    expect(historical).toBeDefined();

    for (const theme of historical?.themes ?? []) {
      for (const style of theme.recommendedForStyles ?? []) {
        expect(styleNames.has(style)).toBe(true);
      }
    }
  });
});

describe('E17 token diff data contracts', () => {
  it('TokenLab aliasGroups의 모든 토큰은 semanticVars에서 계산 가능하다', () => {
    const palette = themeRegistry.flatMap((g) => g.themes)[0];
    expect(palette).toBeDefined();

    const aliasTokens = Array.from(
      new Set((categoriesJson as TokenLabCategories).aliasGroups.flatMap((g) => g.tokens))
    );

    for (const style of Object.values(stylePresets)) {
      const { tokenSet } = buildThemeAndTokenSet(palette!, style);
      const missing = aliasTokens.filter((token) => tokenSet.semanticVars[token] === undefined);
      expect(missing).toEqual([]);
    }
  });
});
