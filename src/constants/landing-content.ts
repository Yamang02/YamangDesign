/**
 * 랜딩 페이지 콘텐츠
 * Hero, Features, Pricing, Testimonials 등 하드코딩 데이터 관리
 */

export interface LandingFeature {
  icon: string;
  title: string;
  description: string;
}

export interface LandingPlan {
  name: string;
  price: string;
  period: string;
  features: string[];
  highlighted: boolean;
  buttonVariant: 'primary' | 'outline';
}

export interface LandingTestimonial {
  quote: string;
  name: string;
  role: string;
  initials: string;
}

/** Hero 섹션 */
export const landingHero = {
  title: 'Build Something Amazing',
  subtitle:
    'A modern design system with beautiful themes, powerful components, and seamless customization. From minimal to neumorphism — your choice.',
  primaryCta: 'Get Started',
  secondaryCta: 'View Components',
} as const;

/** Features 섹션 */
export const landingFeatures: LandingFeature[] = [
  {
    icon: 'speed',
    title: 'Lightning Fast',
    description:
      'Optimized for performance with minimal bundle size and instant theme switching.',
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

/** Pricing 섹션 */
export const landingPlans: LandingPlan[] = [
  {
    name: 'Starter',
    price: '$0',
    period: '/month',
    features: ['5 projects', 'Basic themes', 'Community support', 'Core components'],
    highlighted: false,
    buttonVariant: 'outline',
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/month',
    features: [
      'Unlimited projects',
      'All themes',
      'Priority support',
      'All components',
      'Custom branding',
    ],
    highlighted: true,
    buttonVariant: 'primary',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    features: ['Dedicated support', 'Custom development', 'SLA guarantee', 'On-premise option'],
    highlighted: false,
    buttonVariant: 'outline',
  },
];

/** Testimonials 섹션 */
export const landingTestimonials: LandingTestimonial[] = [
  {
    quote:
      'This design system transformed our development workflow. Switching themes is now effortless.',
    name: 'Sarah Kim',
    role: 'Lead Developer, TechCorp',
    initials: 'SK',
  },
  {
    quote:
      'The attention to detail in the neumorphism theme is incredible. Our users love the new look.',
    name: 'James Chen',
    role: 'Product Designer, DesignLab',
    initials: 'JC',
  },
  {
    quote:
      'Finally, a design system that prioritizes both aesthetics and developer experience.',
    name: 'Emily Park',
    role: 'CTO, StartupXYZ',
    initials: 'EP',
  },
];

/** 섹션 제목/부제목 */
export const landingSections = {
  features: {
    title: 'Features',
    subtitle: 'Everything you need to build modern, themeable interfaces',
  },
  pricing: {
    title: 'Pricing',
    subtitle: 'Choose the plan that fits your needs',
  },
  testimonials: {
    title: 'What People Say',
    subtitle: 'Trusted by developers and designers worldwide',
  },
} as const;

/** Contact 섹션 */
export const landingContact = {
  title: 'Get in Touch',
  subtitle: "Have questions? We'd love to hear from you",
  fields: {
    name: 'Name',
    namePlaceholder: 'Your name',
    email: 'Email',
    emailPlaceholder: 'you@example.com',
    message: 'Message',
    messagePlaceholder: 'How can we help?',
  },
  submitLabel: 'Send Message',
} as const;
