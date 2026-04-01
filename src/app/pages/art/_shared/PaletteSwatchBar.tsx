import { useState } from 'react';
import styles from './PaletteSwatchBar.module.css';

export interface PaletteItem {
  name: string
  hex: string
}

interface PaletteSwatchBarProps {
  palette: PaletteItem[]
  variant?: 'glass' | 'brutal' | 'minimal'
}

function SwatchLabel({ copied, hex }: Readonly<{ copied: boolean; hex: string }>) {
  if (copied) {
    return <span className={styles.copied}>Copied!</span>;
  }
  return <span className={styles.tooltip}>{hex}</span>;
}

export function PaletteSwatchBar({ palette, variant = 'glass' }: Readonly<PaletteSwatchBarProps>) {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const handleCopy = (hex: string) => {
    navigator.clipboard.writeText(hex).then(() => {
      setCopiedHex(hex);
      setTimeout(() => setCopiedHex(null), 1200);
    });
  };

  const barClassMap: Record<string, string> = {
    brutal: styles.barBrutal,
    minimal: styles.barMinimal,
  };
  const barClass = barClassMap[variant] ?? styles.bar;

  return (
    <div className={barClass}>
      <p className={styles.label}>Color Palette</p>
      <div className={styles.swatches}>
        {palette.map(({ name, hex }) => (
          <button
            key={hex}
            className={styles.swatch}
            style={{ background: hex }}
            onClick={() => handleCopy(hex)}
            title={`${name} — ${hex}`}
            aria-label={`Copy ${name} ${hex}`}
          >
            <SwatchLabel copied={copiedHex === hex} hex={hex} />
          </button>
        ))}
      </div>
    </div>
  );
}
