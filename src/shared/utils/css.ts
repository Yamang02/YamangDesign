const CSS_VAR_PREFIX = 'ds';

/**
 * camelCase를 kebab-case로 변환
 * surfaceBrand → surface-brand
 * onAction → on-action
 */
function toKebabCase(str: string): string {
  return str.replaceAll(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * 중첩 객체를 평탄화하여 CSS 변수명 생성
 *
 * 입력: { color: { bg: { surfaceBrand: '#FFF' } } }
 * 출력: { '--ds-color-bg-surface-brand': '#FFF' }
 *
 * camelCase 키는 자동으로 kebab-case로 변환됨
 */
export function flattenToCSSVars(
  obj: Record<string, unknown>,
  prefix = ''
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith('_')) continue;

    const kebabKey = toKebabCase(key).replaceAll('.', '-');
    const varName = prefix ? `${prefix}-${kebabKey}` : kebabKey;

    if (typeof value === 'object' && value !== null) {
      Object.assign(
        result,
        flattenToCSSVars(value as Record<string, unknown>, varName)
      );
    } else if (typeof value === 'string') {
      result[`--${CSS_VAR_PREFIX}-${varName}`] = value;
    }
  }

  return result;
}

/**
 * CSS 변수를 :root에 주입
 */
export function injectCSSVariables(vars: Record<string, string>): void {
  const root = document.documentElement;

  for (const [name, value] of Object.entries(vars)) {
    root.style.setProperty(name, value);
  }
}

/**
 * CSS 변수 제거
 */
export function removeCSSVariables(varNames: string[]): void {
  const root = document.documentElement;

  for (const name of varNames) {
    root.style.removeProperty(name);
  }
}
