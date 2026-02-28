import { Button, Card, Icon, Input } from '../../../components';
import { clsx } from '../../../utils/clsx';
import styles from './Landing.module.css';

// Feature data
const features = [
  {
    icon: 'speed',
    title: 'Lightning Fast',
    description: 'Optimized for performance with minimal bundle size and instant theme switching.',
  },
  {
    icon: 'palette',
    title: 'Fully Themeable',
    description: 'Switch between themes instantly. Create custom color palettes with ease.',
  },
  {
    icon: 'code',
    title: 'Developer First',
    description: 'Built with TypeScript. Full type safety and excellent IDE support.',
  },
  {
    icon: 'devices',
    title: 'Responsive',
    description: 'Components work seamlessly across all screen sizes and devices.',
  },
];

// Pricing data
const plans = [
  {
    name: 'Starter',
    price: '$0',
    period: '/month',
    features: ['5 projects', 'Basic themes', 'Community support', 'Core components'],
    highlighted: false,
    buttonVariant: 'outline' as const,
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/month',
    features: ['Unlimited projects', 'All themes', 'Priority support', 'All components', 'Custom branding'],
    highlighted: true,
    buttonVariant: 'primary' as const,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    features: ['Dedicated support', 'Custom development', 'SLA guarantee', 'On-premise option'],
    highlighted: false,
    buttonVariant: 'outline' as const,
  },
];

// Testimonial data
const testimonials = [
  {
    quote: 'This design system transformed our development workflow. Switching themes is now effortless.',
    name: 'Sarah Kim',
    role: 'Lead Developer, TechCorp',
    initials: 'SK',
  },
  {
    quote: 'The attention to detail in the neumorphism theme is incredible. Our users love the new look.',
    name: 'James Chen',
    role: 'Product Designer, DesignLab',
    initials: 'JC',
  },
  {
    quote: 'Finally, a design system that prioritizes both aesthetics and developer experience.',
    name: 'Emily Park',
    role: 'CTO, StartupXYZ',
    initials: 'EP',
  },
];

export function Landing() {
  return (
    <>
      {/* Hero Section */}
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>
          Build Something Amazing
        </h1>
        <p className={styles.heroSubtitle}>
          A modern design system with beautiful themes, powerful components,
          and seamless customization. From minimal to neumorphism — your choice.
        </p>
        <div className={styles.heroButtons}>
          <Button variant="primary" size="lg">
            Get Started
          </Button>
          <Button variant="outline" size="lg">
            View Components
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Features</h2>
        <p className={styles.sectionSubtitle}>
          Everything you need to build modern, themeable interfaces
        </p>
        <div className={styles.featuresGrid}>
          {features.map((feature) => (
            <Card key={feature.title} variant="elevated" hoverable>
              <Card.Body>
                <div className={styles.featureCard}>
                  <div className={styles.featureIcon}>
                    <Icon name={feature.icon} size="lg" color="currentColor" />
                  </div>
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
        <h2 className={styles.sectionTitle}>Pricing</h2>
        <p className={styles.sectionSubtitle}>
          Choose the plan that fits your needs
        </p>
        <div className={styles.pricingGrid}>
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={clsx(styles.pricingCard, plan.highlighted && styles.pricingHighlight)}
            >
              <Card variant={plan.highlighted ? 'elevated' : 'outlined'}>
                {plan.highlighted && (
                  <div className={styles.pricingBadge}>Most Popular</div>
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
        <h2 className={styles.sectionTitle}>What People Say</h2>
        <p className={styles.sectionSubtitle}>
          Trusted by developers and designers worldwide
        </p>
        <div className={styles.testimonialsGrid}>
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} variant="flat" padding="lg">
              <Card.Body>
                <p className={styles.testimonialQuote}>"{testimonial.quote}"</p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.testimonialAvatar}>
                    {testimonial.initials}
                  </div>
                  <div>
                    <div className={styles.testimonialName}>{testimonial.name}</div>
                    <div className={styles.testimonialRole}>{testimonial.role}</div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Get in Touch</h2>
        <p className={styles.sectionSubtitle}>
          Have questions? We'd love to hear from you
        </p>
        <div className={styles.contactWrapper}>
          <Card variant="elevated" padding="lg">
            <Card.Body>
              <div className={styles.contactForm}>
                <Input label="Name" placeholder="Your name" fullWidth />
                <Input label="Email" type="email" placeholder="you@example.com" fullWidth />
                <Input label="Message" placeholder="How can we help?" fullWidth />
                <Button variant="primary" fullWidth>
                  Send Message
                </Button>
              </div>
            </Card.Body>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <span className={styles.footerCopyright}>
            © 2024 Yamang Design System. All rights reserved.
          </span>
          <nav className={styles.footerLinks}>
            <span className={styles.footerLink}>Terms</span>
            <span className={styles.footerLink}>Privacy</span>
            <span className={styles.footerLink}>GitHub</span>
          </nav>
        </div>
      </footer>
    </>
  );
}
