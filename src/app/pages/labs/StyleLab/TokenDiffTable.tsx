import { useMemo } from 'react';
import { palettePresets, stylePresets } from '@domain/themes/presets';
import { buildThemeAndTokenSet } from '@domain/themes/token-set';
import type { PaletteName, StyleName } from '@shared/@types/theme';
import styles from './StyleLab.module.css';

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function stripDsPrefix(token: string): string {
  return token.replace(/^--ds-/, '');
}

function tokenSortRank(token: string): number {
  if (token.startsWith('--ds-shadow-')) return 0;
  if (token.startsWith('--ds-border-')) return 1;
  if (token.startsWith('--ds-radius-')) return 2;
  if (token.startsWith('--ds-duration-')) return 3;
  if (token.startsWith('--ds-ease-')) return 4;
  if (token.startsWith('--ds-surface-')) return 5;
  if (token.startsWith('--ds-filter')) return 6;
  if (token.startsWith('--ds-perspective')) return 7;
  return 99;
}

export function TokenDiffTable({
  baseStyle,
  compareStyles,
  paletteId,
}: {
  baseStyle: StyleName;
  compareStyles: StyleName[];
  paletteId: PaletteName;
}) {
  const paletteDef = palettePresets[paletteId];

  const stylesToCompute = useMemo(() => {
    const unique = new Set<StyleName>([baseStyle, ...compareStyles]);
    return Array.from(unique.values());
  }, [baseStyle, compareStyles]);

  const valuesByStyle = useMemo(() => {
    if (!paletteDef) return {} as Record<StyleName, Record<string, string>>;
    return stylesToCompute.reduce((acc, styleName) => {
      const styleDef = stylePresets[styleName];
      if (!styleDef) return acc;
      const { tokenSet } = buildThemeAndTokenSet(paletteDef, styleDef);
      acc[styleName] = {
        ...tokenSet.styleVars,
        ...tokenSet.surfaceVars,
      };
      return acc;
    }, {} as Record<StyleName, Record<string, string>>);
  }, [paletteDef, stylesToCompute]);

  const baseVars = valuesByStyle[baseStyle] ?? {};
  const diffTokens = useMemo(() => {
    const all = new Set<string>(Object.keys(baseVars));
    compareStyles.forEach((styleName) => {
      Object.keys(valuesByStyle[styleName] ?? {}).forEach((token) => all.add(token));
    });
    return Array.from(all.values())
      .sort((a, b) => {
        const rankDiff = tokenSortRank(a) - tokenSortRank(b);
        if (rankDiff !== 0) return rankDiff;
        return a.localeCompare(b);
      })
      .filter((token) =>
        compareStyles.some(
          (styleName) => (valuesByStyle[styleName]?.[token] ?? '(미정의)') !== (baseVars[token] ?? '(미정의)')
        )
      );
  }, [baseVars, compareStyles, valuesByStyle]);
  if (!paletteDef) return null;

  if (diffTokens.length === 0) {
    return (
      <div className={styles.tokenDiffEmpty}>
        현재 선택한 두 스타일 간 차이가 있는 스타일 토큰이 없습니다.
      </div>
    );
  }

  return (
    <div className={styles.tokenDiffTableWrap}>
      <table className={styles.tokenDiffTable}>
        <thead>
          <tr>
            <th className={styles.tokenDiffNameTh}>토큰</th>
            <th className={styles.tokenDiffValueTh}>Base ({capitalize(baseStyle)})</th>
            {compareStyles.map((styleName) => (
              <th key={styleName} className={styles.tokenDiffValueTh}>
                {capitalize(styleName)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {diffTokens.map((token) => {
            const baseValue = baseVars[token] ?? '(미정의)';
            return (
              <tr key={token}>
                <td className={styles.tokenDiffNameTd}>
                  <code className={styles.tokenDiffNameCode}>{stripDsPrefix(token)}</code>
                </td>
                <td className={styles.tokenDiffValueTd}>
                  <code className={styles.tokenDiffValueCode}>{baseValue}</code>
                </td>
                {compareStyles.map((styleName) => {
                  const compareValue = valuesByStyle[styleName]?.[token] ?? '(미정의)';
                  const isDifferent = compareValue !== baseValue;
                  return (
                    <td
                      key={styleName}
                      className={isDifferent ? `${styles.tokenDiffValueTd} ${styles.tokenDiffDifferent}` : styles.tokenDiffValueTd}
                    >
                      <code className={styles.tokenDiffValueCode}>{compareValue}</code>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

