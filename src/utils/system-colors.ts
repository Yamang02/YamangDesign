/** E04 P02: scale 50/500/700 → --sys-color-* (subtle / default / emphasis) */
export function generateSystemColorVars(
  preset: { colors: Record<string, { 50: string; 500: string; 700: string }> }
): Record<string, string> {
  const vars: Record<string, string> = {};

  for (const [name, scale] of Object.entries(preset.colors)) {
    vars[`--sys-color-${name}-subtle`] = scale[50];
    vars[`--sys-color-${name}`] = scale[500];
    vars[`--sys-color-${name}-emphasis`] = scale[700];
  }

  return vars;
}
