const CSS_VAR_PREFIX = 'ds';

/**
 * 중첩 객체를 평탄화하여 CSS 변수명 생성
 *
 * 입력: { color: { bg: { primary: '#fff' } } }
 * 출력: { '--ds-color-bg-primary': '#fff' }
 */
export function flattenToCSSVars(
  obj: Record<string, unknown>,
  prefix = ''
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith('_')) continue;

    const varName = prefix ? `${prefix}-${key}` : key;

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
