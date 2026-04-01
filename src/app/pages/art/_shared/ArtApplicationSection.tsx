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
  level: 'Display' | 'Body' | 'Caption'
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
  variant?: 'glass' | 'brutal' | 'minimal'
  sectionId?: string  // 추가 — 기본값: 'chapter-3'
}

function variantClass(
  base: string,
  variant: 'glass' | 'brutal' | 'minimal',
  variantMap: Partial<Record<'brutal' | 'minimal', string>>,
): string {
  const suffix = variantMap[variant as keyof typeof variantMap];
  return suffix ? `${base} ${suffix}` : base;
}

function getTypographyClass(
  level: ArtTypographyItem['level'],
  stylesObj: typeof styles,
): string {
  if (level === 'Display') return stylesObj.typeDisplay;
  if (level === 'Body') return stylesObj.typeBody;
  return stylesObj.typeCaption;
}

export function ArtApplicationSection({
  palette,
  buttons,
  typography,
  artCard,
  variant = 'glass',
  sectionId,
}: Readonly<ArtApplicationSectionProps>) {
  const sectionClass = variantClass(styles.section, variant, { brutal: styles.sectionBrutal, minimal: styles.sectionMinimal });
  const tokenChipClass = variantClass(styles.tokenChip, variant, { brutal: styles.tokenChipBrutal, minimal: styles.tokenChipMinimal });
  const tokenMetaClass = variantClass(styles.tokenMeta, variant, { brutal: styles.tokenMetaBrutal, minimal: styles.tokenMetaMinimal });
  const btnClass = variantClass(styles.btn, variant, { brutal: styles.btnBrutal });
  const artCardClass = variantClass(styles.artCard, variant, { brutal: styles.artCardBrutal, minimal: styles.artCardMinimal });
  const artCardTagClass = variantClass(styles.artCardTag, variant, { brutal: styles.artCardTagBrutal, minimal: styles.artCardTagMinimal });

  return (
    <section id={sectionId ?? 'chapter-3'} className={sectionClass}>
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
              className={getTypographyClass(level, styles)}
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
