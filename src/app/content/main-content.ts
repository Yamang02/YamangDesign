export interface MainModule {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly icon: string;
  readonly cta: string;
  readonly variant: 'feature' | 'default' | 'wide';
}

export const mainHero = {
  badge: 'Yamang Design System',
  titleLead: 'Explore the',
  titleAccent: 'Core Surface',
  titleTrail: 'of Yamang',
  subtitle:
    'A design engineering hub where palette systems, component architecture, and art-driven experiments converge into one production workflow.',
  primaryCta: { label: 'Open Playground', target: 'playground' },
  secondaryCta: { label: 'View Layouts', target: 'layout-landing' },
} as const;

export const mainModules: ReadonlyArray<MainModule> = [
  {
    id: 'layout-landing',
    title: 'Layouts',
    description:
      'Scaffold information hierarchy with reusable landing, dashboard, and article structures.',
    icon: 'grid-view',
    cta: 'Explore structures',
    variant: 'feature',
  },
  {
    id: 'palette',
    title: 'Labs',
    description:
      'Probe tokens, typography, spacing, motion, and responsiveness in controlled experiment tracks.',
    icon: 'science',
    cta: 'Open lab suite',
    variant: 'default',
  },
  {
    id: 'atoms',
    title: 'Build',
    description: 'Compose production-ready UI inventory from atoms to organisms.',
    icon: 'build',
    cta: 'Inspect primitives',
    variant: 'default',
  },
  {
    id: 'service',
    title: 'Context',
    description: 'Review the service and shell contexts that frame system behavior.',
    icon: 'devices',
    cta: 'Read context',
    variant: 'default',
  },
  {
    id: 'starry-night',
    title: 'Art',
    description:
      'Trace visual language through reference galleries and painterly composition studies.',
    icon: 'image',
    cta: 'Enter gallery',
    variant: 'default',
  },
  {
    id: 'playground',
    title: 'Interactive Playground',
    description:
      'Test tokens, preview combinations, and validate decisions in a live composition sandbox.',
    icon: 'widgets',
    cta: 'Enter sandbox',
    variant: 'wide',
  },
];

export const mainSpotlight = {
  title: 'From Design Theory to Shipping UI',
  quote:
    'Yamang Design turns visual direction into reliable code paths by keeping tokens, components, and exploratory labs in one operating surface.',
  author: 'Design Lab Core',
  role: 'System Narrative',
  chips: ['Token-driven', 'Component-first', 'Art-connected'],
  cta: { label: 'Tune Design Settings', target: 'design-settings' },
} as const;
