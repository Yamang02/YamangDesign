import { Button, Icon } from '@app/components';
import { clsx } from '@shared/utils/clsx';
import { mainHero, mainModules, mainSections } from '@app/content/main-content';
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
            <span className={styles.heroTitleAccent}>{mainHero.titleAccent}</span>
            {mainHero.titleAccentSuffix}
            <br />
            {mainHero.titleLead}
            <br />
            <span className={styles.heroTitleBrand}>{mainHero.titleBrand}</span>
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
            <h2 className={styles.sectionTitle}>{mainSections.ecosystem.title}</h2>
            <p className={styles.sectionSubtitle}>{mainSections.ecosystem.subtitle}</p>
          </div>
          <span className={styles.sectionBar} aria-hidden="true" />
        </header>

        <div className={styles.moduleGrid}>
          {mainModules.map((module) => (
            <button
              key={module.id}
              type="button"
              className={clsx(styles.moduleTile, module.variant === 'feature' && styles.moduleTileFeature)}
              onClick={() => navigateTo(module.id)}
            >
              <div className={styles.moduleTop}>
                <Icon name={module.icon} size="lg" className={styles.moduleIcon} />
                <h3 className={styles.moduleTitle}>{module.title}</h3>
              </div>

              {module.submenuBadges && module.submenuBadges.length > 0 && (
                <div className={styles.moduleBadgeList}>
                  {module.submenuBadges.map((label) => (
                    <span key={`${module.id}-${label}`} className={styles.moduleBadge}>
                      {label}
                    </span>
                  ))}
                </div>
              )}

              <p className={styles.moduleDescription}>{module.description}</p>
              <span className={styles.moduleCta}>
                {module.cta}
                <Icon name="arrow-forward" size="sm" />
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
