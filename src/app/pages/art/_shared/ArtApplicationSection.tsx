import styles from './ArtApplicationSection.module.css';

export interface ArtPaletteItem {
  name: string
  hex: string
  role: string
}

export interface ArtButtonItem {
  label: string
  hex: string
  textHex: string
}

export interface ArtTypographyItem {
  level: string   // 'Display' | 'Body' | 'Caption'
  text: string
  hex: string
}

export interface ArtCardMeta {
  imageUrl: string
  title: string
  artist: string
  year: number | string   // "1914–18" 같은 범위도 허용
  movement: string        // "Impressionism" 등
  styleTag: string        // "Glassmorphism" | "Brutalism" 등
}

interface ArtApplicationSectionProps {
  palette: ArtPaletteItem[]
  buttons: ArtButtonItem[]
  typography: ArtTypographyItem[]
  artCard: ArtCardMeta
  variant?: 'glass' | 'brutal'
}

export function ArtApplicationSection({
  palette,
  buttons,
  typography,
  artCard,
  variant = 'glass',
}: ArtApplicationSectionProps) {
  const sectionClass =
    variant === 'brutal' ? `${styles.section} ${styles.sectionBrutal}` : styles.section;

  const tokenChipClass =
    variant === 'brutal'
      ? `${styles.tokenChip} ${styles.tokenChipBrutal}`
      : styles.tokenChip;

  const tokenMetaClass =
    variant === 'brutal'
      ? `${styles.tokenMeta} ${styles.tokenMetaBrutal}`
      : styles.tokenMeta;

  const btnClass =
    variant === 'brutal' ? `${styles.btn} ${styles.btnBrutal}` : styles.btn;

  const artCardClass =
    variant === 'brutal'
      ? `${styles.artCard} ${styles.artCardBrutal}`
      : styles.artCard;

  const artCardTagClass =
    variant === 'brutal'
      ? `${styles.artCardTag} ${styles.artCardTagBrutal}`
      : styles.artCardTag;

  return (
    <section id="chapter-3" className={sectionClass}>
      <span className={styles.chapterLabel}>Chapter 3 — The Application</span>

      {/* Block 1: Color Tokens */}
      <div>
        <p className={styles.blockTitle}>Color Tokens</p>
        <div className={styles.tokenGrid}>
          {palette.map(({ name, hex, role }) => (
            <div key={hex} className={tokenChipClass}>
              <div className={styles.tokenSwatch} style={{ background: hex }} />
              <div className={tokenMetaClass}>
                <span className={styles.tokenRole}>{role}</span>
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
          {buttons.map(({ label, hex, textHex }) => (
            <button
              key={label}
              className={btnClass}
              style={{ background: hex === 'transparent' ? 'transparent' : hex, color: textHex }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Block 3: Typography */}
      <div>
        <p className={styles.blockTitle}>Typography</p>
        <div className={styles.typeStack}>
          {typography.map(({ level, text, hex }) => (
            <p
              key={level}
              className={styles[`type${level}` as keyof typeof styles] as string}
              style={{ color: hex, margin: 0 }}
            >
              {text}
            </p>
          ))}
        </div>
      </div>

      {/* Block 4: Art Card */}
      <div>
        <p className={styles.blockTitle}>Art Card</p>
        <div className={artCardClass}>
          <div
            className={styles.artCardThumb}
            style={{ backgroundImage: `url(${artCard.imageUrl})` }}
            aria-hidden
          />
          <div className={styles.artCardBody}>
            <span className={styles.artCardCategory}>{artCard.movement}</span>
            <p className={styles.artCardTitle}>{artCard.title}</p>
            <span className={styles.artCardSub}>{artCard.artist}, {artCard.year}</span>
            <span className={artCardTagClass}>{artCard.styleTag}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
