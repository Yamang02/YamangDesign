import { useState } from 'react';
import styles from './PaletteSwatchBar.module.css';

export const MONET_PALETTE = [
  { name: 'Deep Green',  hex: '#2D5016' },
  { name: 'Sage',        hex: '#7A9E5F' },
  { name: 'Lavender',    hex: '#9B8BB4' },
  { name: 'Smoke White', hex: '#E8E4D5' },
  { name: 'Teal',        hex: '#3D7A6E' },
  { name: 'Mustard',     hex: '#C4A84F' },
  { name: 'Deep Purple', hex: '#4A3560' },
  { name: 'Water Blue',  hex: '#5B8FA8' },
];

export function PaletteSwatchBar() {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const handleCopy = (hex: string) => {
    navigator.clipboard.writeText(hex).then(() => {
      setCopiedHex(hex);
      setTimeout(() => setCopiedHex(null), 1200);
    });
  };

  return (
    <div className={styles.bar}>
      <p className={styles.label}>Color Palette</p>
      <div className={styles.swatches}>
        {MONET_PALETTE.map(({ name, hex }) => (
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
