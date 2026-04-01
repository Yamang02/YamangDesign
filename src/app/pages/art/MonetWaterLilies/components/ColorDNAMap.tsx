import styles from './ColorDNAMap.module.css';
import { MONET_PALETTE } from '../monet-palette';

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const r = Number.parseInt(hex.slice(1, 3), 16) / 255;
  const g = Number.parseInt(hex.slice(3, 5), 16) / 255;
  const b = Number.parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  let h = 0;
  if (d !== 0) {
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h, s, l };
}

export function ColorDNAMap() {
  return (
    <div className={styles.container}>
      <p className={styles.heading}>Color DNA</p>
      <p className={styles.subheading}>Saturation × Lightness</p>
      <div style={{ position: 'relative' }}>
        <span className={styles.yLabel}>Lightness ↑</span>
        <div className={styles.mapArea}>
          {MONET_PALETTE.map(({ name, hex }) => {
            const { s, l } = hexToHsl(hex);
            return (
              <div
                key={hex}
                className={styles.dot}
                style={{
                  background: hex,
                  left: `${s * 100}%`,
                  bottom: `${l * 100}%`,
                }}
              >
                <span className={styles.dotTooltip}>{name} · {hex}</span>
              </div>
            );
          })}
        </div>
        <p className={styles.xLabel}>Saturation →</p>
      </div>
    </div>
  );
}
