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

export function PaletteSwatchBar({ palette, variant = 'glass' }: PaletteSwatchBarProps) {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const handleCopy = (hex: string) => {
    navigator.clipboard.writeText(hex).then(() => {
      setCopiedHex(hex);
      setTimeout(() => setCopiedHex(null), 1200);
    });
  };

  const barClass =
    variant === 'brutal' ? styles.barBrutal :
    variant === 'minimal' ? styles.barMinimal :
    styles.bar;

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
            {copiedHex === hex ? (
              <span className={styles.copied}>Copied!</span>
            ) : (
              <span className={styles.tooltip}>{hex}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
