import { Avatar, Badge, Button, Card, Icon, Input, Profile } from '../../../components';
import { clsx } from '@shared/utils/clsx';
import {
  landingHero,
  landingFeatures,
  landingPlans,
  landingTestimonials,
  landingSections,
  landingContact,
} from '@app/content/landing-content';
import styles from './Landing.module.css';

export function Landing() {
  return (
    <>
      {/* Hero Section */}
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>{landingHero.title}</h1>
        <p className={styles.heroSubtitle}>{landingHero.subtitle}</p>
        <div className={styles.heroButtons}>
          <Button variant="primary" size="lg">
            {landingHero.primaryCta}
          </Button>
          <Button variant="outline" size="lg">
            {landingHero.secondaryCta}
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{landingSections.features.title}</h2>
        <p className={styles.sectionSubtitle}>{landingSections.features.subtitle}</p>
        <div className={styles.featuresGrid}>
          {landingFeatures.map((feature) => (
            <Card key={feature.title} variant="elevated" hoverable>
              <Card.Body>
                <div className={styles.featureCard}>
                  <Avatar size="lg" variant="primary" className={styles.featureIcon}>
                    <Icon name={feature.icon} size="lg" color="var(--ds-color-text-on-action)" />
                  </Avatar>
                  <h3 className={styles.featureTitle}>{feature.title}</h3>
                  <p className={styles.featureDescription}>{feature.description}</p>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{landingSections.pricing.title}</h2>
        <p className={styles.sectionSubtitle}>{landingSections.pricing.subtitle}</p>
        <div className={styles.pricingGrid}>
          {landingPlans.map((plan) => (
            <div
              key={plan.name}
              className={clsx(styles.pricingCard, plan.highlighted && styles.pricingHighlight)}
            >
              <Card variant={plan.highlighted ? 'elevated' : 'outlined'}>
                {plan.highlighted && (
                  <div className={styles.badgeWrapper}>
                    <Badge>Most Popular</Badge>
                  </div>
                )}
                <Card.Header>{plan.name}</Card.Header>
                <Card.Body>
                  <div className={styles.pricingPriceWrapper}>
                    <span className={styles.pricingPrice}>{plan.price}</span>
                    <span className={styles.pricingPeriod}>{plan.period}</span>
                  </div>
                  <ul className={styles.pricingFeatures}>
                    {plan.features.map((feature) => (
                      <li key={feature} className={styles.pricingFeatureItem}>
                        <Icon name="check" size="sm" color="var(--ds-color-action-primary-default)" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </Card.Body>
                <Card.Footer>
                  <Button variant={plan.buttonVariant} fullWidth>
                    {plan.name === 'Enterprise' ? 'Contact Us' : 'Get Started'}
                  </Button>
                </Card.Footer>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{landingSections.testimonials.title}</h2>
        <p className={styles.sectionSubtitle}>{landingSections.testimonials.subtitle}</p>
        <div className={styles.testimonialsGrid}>
          {landingTestimonials.map((testimonial) => (
            <Card key={testimonial.name} variant="flat" padding="lg">
              <Card.Body>
                <p className={styles.testimonialQuote}>"{testimonial.quote}"</p>
                <Profile
                  initials={testimonial.initials}
                  name={testimonial.name}
                  role={testimonial.role}
                />
              </Card.Body>
            </Card>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{landingContact.title}</h2>
        <p className={styles.sectionSubtitle}>{landingContact.subtitle}</p>
        <div className={styles.contactWrapper}>
          <Card variant="elevated" padding="lg">
            <Card.Body>
              <div className={styles.contactForm}>
                <Input
                  label={landingContact.fields.name}
                  placeholder={landingContact.fields.namePlaceholder}
                  fullWidth
                />
                <Input
                  label={landingContact.fields.email}
                  type="email"
                  placeholder={landingContact.fields.emailPlaceholder}
                  fullWidth
                />
                <Input
                  label={landingContact.fields.message}
                  placeholder={landingContact.fields.messagePlaceholder}
                  fullWidth
                />
                <Button variant="primary" fullWidth>
                  {landingContact.submitLabel}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </div>
      </section>
    </>
  );
}
