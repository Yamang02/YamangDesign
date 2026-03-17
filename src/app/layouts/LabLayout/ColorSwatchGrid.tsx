import styles from './ColorSwatchGrid.module.css';

export interface ColorSwatch {
  label: string;
  color: string;
}

export interface ColorSwatchGridProps {
  swatches: ColorSwatch[];
}

export function ColorSwatchGrid({ swatches }: ColorSwatchGridProps) {
  return (
    <div className={styles.grid}>
      {swatches.map((swatch) => (
        <div key={swatch.label} className={styles.item}>
          <div className={styles.swatch} style={{ backgroundColor: swatch.color }} />
          <span className={styles.label}>{swatch.label}</span>
        </div>
      ))}
    </div>
  );
}
