import { PreviewControlPanel } from '@app/layouts';
import { comparisonPresets } from '@domain/constants';
import { useLayoutPreviewControls } from '@app/context/LayoutPreviewControlsContext';

type FontKey = 'sans' | 'mono';

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const paletteOptions = comparisonPresets.palettes.map((p) => ({ value: p, label: capitalize(p) }));
const systemPresetOptions = comparisonPresets.systemPresets.map((s) => ({ value: s, label: capitalize(s) }));
const neutralPresetOptions = comparisonPresets.neutralPresets.map((n) => ({ value: n, label: capitalize(n) }));
const styleOptions = comparisonPresets.styles.map((s) => ({ value: s, label: capitalize(s) }));
const fontOptions = [
  { value: 'sans' as const, label: 'Sans' },
  { value: 'mono' as const, label: 'Mono' },
];

export function LayoutControlPanel() {
  const {
    palette,
    systemPreset,
    neutralPreset,
    style,
    font,
    setPalette,
    setSystemPreset,
    setNeutralPreset,
    setStyle,
    setFont,
  } = useLayoutPreviewControls();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-spacing-4)' }}>
      <PreviewControlPanel
        label="Palette (Brand)"
        value={palette}
        options={paletteOptions}
        onChange={setPalette}
      />
      <PreviewControlPanel
        label="System"
        value={systemPreset}
        options={systemPresetOptions}
        onChange={setSystemPreset}
      />
      <PreviewControlPanel
        label="Neutral"
        value={neutralPreset}
        options={neutralPresetOptions}
        onChange={setNeutralPreset}
      />
      <PreviewControlPanel
        label="Style"
        value={style}
        options={styleOptions}
        onChange={setStyle}
      />
      <PreviewControlPanel
        label="Font"
        value={font}
        options={fontOptions}
        onChange={(v) => setFont(v as FontKey)}
      />
    </div>
  );
}
