import { Button, Icon } from '@app/components';
import { clsx } from '@shared/utils/clsx';
import { mainHero, mainModules, mainSpotlight } from '@app/content/main-content';
import styles from './Main.module.css';

export interface MainProps {
  readonly onNavigate?: (pageId: string) => void;
}

export function Main({ onNavigate }: Readonly<MainProps>) {
  const navigateTo = (pageId: string) => {
    onNavigate?.(pageId);
  };

  return (
    <div className={styles.mainRoot}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.heroBadge}>{mainHero.badge}</span>
          <h1 className={styles.heroTitle}>
            {mainHero.titleLead} <span className={styles.heroTitleAccent}>{mainHero.titleAccent}</span>{' '}
            {mainHero.titleTrail}
          </h1>
          <p className={styles.heroSubtitle}>{mainHero.subtitle}</p>
          <div className={styles.heroActions}>
            <Button variant="primary" size="lg" onClick={() => navigateTo(mainHero.primaryCta.target)}>
              {mainHero.primaryCta.label}
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigateTo(mainHero.secondaryCta.target)}>
              {mainHero.secondaryCta.label}
            </Button>
          </div>
        </div>
        <div className={styles.heroBackdrop} aria-hidden="true">
          <span className={clsx(styles.heroOrb, styles.heroOrbPrimary)} />
          <span className={clsx(styles.heroOrb, styles.heroOrbAccent)} />
        </div>
      </section>

      <section className={styles.ecosystem}>
        <header className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>The Modular Ecosystem</h2>
            <p className={styles.sectionSubtitle}>
              Each area is mapped to a working page so the main screen acts as an operational hub.
            </p>
          </div>
          <span className={styles.sectionBar} aria-hidden="true" />
        </header>

        <div className={styles.moduleGrid}>
          {mainModules.map((module) => (
            <button
              key={module.id}
              type="button"
              className={clsx(
                styles.moduleTile,
                module.variant === 'feature' && styles.moduleTileFeature,
                module.variant === 'wide' && styles.moduleTileWide,
              )}
              onClick={() => navigateTo(module.id)}
            >
              <div className={styles.moduleTop}>
                <Icon name={module.icon} size="lg" className={styles.moduleIcon} />
                <h3 className={styles.moduleTitle}>{module.title}</h3>
              </div>
              <p className={styles.moduleDescription}>{module.description}</p>
              <span className={styles.moduleCta}>
                {module.cta}
                <Icon name="arrow-forward" size="sm" />
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className={styles.spotlight}>
        <div className={styles.spotlightMedia} aria-hidden="true">
          <div className={styles.spotlightSurface} />
          <div className={styles.spotlightChipRow}>
            {mainSpotlight.chips.map((chip) => (
              <span key={chip} className={styles.spotlightChip}>
                {chip}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.spotlightContent}>
          <h2 className={styles.spotlightTitle}>{mainSpotlight.title}</h2>
          <blockquote className={styles.spotlightQuote}>{mainSpotlight.quote}</blockquote>
          <p className={styles.spotlightMeta}>
            {mainSpotlight.author} ¡¤ {mainSpotlight.role}
          </p>
          <Button variant="primary" size="md" onClick={() => navigateTo(mainSpotlight.cta.target)}>
            {mainSpotlight.cta.label}
          </Button>
        </div>
      </section>
    </div>
  );
}
