/**
 * E22 P04: Chapter 3 — The Application
 * 모네 팔레트 × DS 토큰을 실제 컴포넌트에 적용한 섹션
 */
import { MONET_PALETTE } from '../monet-palette';
import styles from './ComponentApplication.module.css';

const IMAGE_URL = '/art/monet-water-lilies-green-reflections.png';

const TOKEN_ROLES: Record<string, string> = {
  '#2D5016': 'Primary',
  '#3D7A6E': 'Secondary',
  '#C4A84F': 'Accent',
  '#9B8BB4': 'Sub',
  '#E8E4D5': 'Surface',
  '#5B8FA8': 'Info',
  '#4A3560': 'Deep',
  '#7A9E5F': 'Muted',
};

export function ComponentApplication() {
  return (
    <section id="chapter-3" className={styles.section}>
      <span className={styles.chapterLabel}>Chapter 3 — The Application</span>

      {/* Block 1: Color Tokens */}
      <div>
        <p className={styles.blockTitle}>Color Tokens</p>
        <div className={styles.tokenGrid}>
          {MONET_PALETTE.map(({ name, hex }) => (
            <div key={hex} className={styles.tokenChip}>
              <div className={styles.tokenSwatch} style={{ background: hex }} />
              <div className={styles.tokenMeta}>
                <span className={styles.tokenRole}>{TOKEN_ROLES[hex] ?? '—'}</span>
                <span className={styles.tokenName}>{name}</span>
                <span className={styles.tokenHex}>{hex}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Block 2: Buttons */}
      <div>
        <p className={styles.blockTitle}>Buttons</p>
        <div className={styles.buttonRow}>
          <button className={`${styles.btn} ${styles.btnPrimary}`}>Primary</button>
          <button className={`${styles.btn} ${styles.btnSecondary}`}>Secondary</button>
          <button className={`${styles.btn} ${styles.btnAccent}`}>Accent</button>
          <button className={`${styles.btn} ${styles.btnGhost}`}>Ghost</button>
        </div>
      </div>

      {/* Block 3: Typography */}
      <div>
        <p className={styles.blockTitle}>Typography</p>
        <div className={styles.typeStack}>
          <p className={styles.typeDisplay}>Water Lilies</p>
          <p className={styles.typeBody}>
            Monet's late masterworks blur the boundary between abstraction and
            observation, dissolving form into light, water, and colour.
          </p>
          <p className={styles.typeCaption}>Impressionism · 1914–18 · Oil on Canvas</p>
        </div>
      </div>

      {/* Block 4: Art Card */}
      <div>
        <p className={styles.blockTitle}>Art Card</p>
        <div className={styles.artCard}>
          <div
            className={styles.artCardThumb}
            style={{ backgroundImage: `url(${IMAGE_URL})` }}
            aria-hidden
          />
          <div className={styles.artCardBody}>
            <span className={styles.artCardCategory}>Impressionism</span>
            <p className={styles.artCardTitle}>Water Lilies: Green Reflections</p>
            <span className={styles.artCardSub}>Claude Monet, 1914–18</span>
            <span className={styles.artCardTag}>Glassmorphism</span>
          </div>
        </div>
      </div>
    </section>
  );
}
