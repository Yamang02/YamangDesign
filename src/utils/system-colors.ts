export function generateSystemColorVars(
  preset: { colors: Record<string, Record<number, string>> }
): Record<string, string> {
  const vars: Record<string, string> = {};

  for (const [name, scale] of Object.entries(preset.colors)) {
    vars[`--ds-color-system-${name}-bg`] = scale[50];
    vars[`--ds-color-system-${name}`] = scale[500];
    vars[`--ds-color-system-${name}-emphasis`] = scale[700];
  }

  return vars;
}
