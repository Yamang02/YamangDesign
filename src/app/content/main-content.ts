export interface MainModule {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly icon: string;
  readonly cta: string;
  readonly variant: 'feature' | 'default';
  readonly submenuBadges?: ReadonlyArray<string>;
}

export const mainHero = {
  badge: 'Yamang Design System',
  titleAccent: '디자인 토큰',
  titleAccentSuffix: '으로',
  titleLead: 'UI 규칙을 검증하는',
  titleBrand: '야망',
  titleTrail: '의 워크벤치',
  subtitle:
    '레이아웃·컴포넌트·시맨틱 매핑을 한 흐름으로 비교하고, 아트 레퍼런스를 통해 디자인시스템의 확장 가능성까지 함께 탐색하는 프로젝트 공간입니다.',
  primaryCta: { label: 'Playground 입장', target: 'playground' },
  secondaryCta: { label: 'Layouts 보기', target: 'layout-landing' },
} as const;

export const mainSections = {
  ecosystem: {
    title: '모듈형 디자인 생태계',
    subtitle:
      '각 섹션은 실사용 페이지로 바로 연결됩니다. 탐색이 곧 작업이 되도록 구조를 설계했습니다.',
  },
} as const;

export const mainModules: ReadonlyArray<MainModule> = [
  {
    id: 'layout-landing',
    title: 'Layouts',
    description: '정보 위계를 빠르게 검증할 수 있는 화면 구조 템플릿을 제공합니다.',
    icon: 'grid-view',
    cta: '구조 탐색',
    variant: 'feature',
    submenuBadges: ['Landing', 'Dashboard', 'Article'],
  },
  {
    id: 'playground',
    title: 'Playground',
    description:
      'Playground 메뉴에서는 토큰 조합과 UI 반응을 실시간으로 미리 보고, 결정 전에 빠르게 검증합니다.',
    icon: 'widgets',
    cta: '샌드박스 진입',
    variant: 'default',
  },
  {
    id: 'palette',
    title: 'Labs',
    description: '디자인 시스템 요소를 실험 단위로 점검하고 비교할 수 있는 분석 공간입니다.',
    icon: 'science',
    cta: '실험실 열기',
    variant: 'default',
    submenuBadges: [
      'Palette',
      'Style',
      'Font',
      'Tokens',
      'Spacing',
      'Grid',
      'Motion',
      'Responsive',
      'CraftLab',
    ],
  },
  {
    id: 'atoms',
    title: 'Build',
    description: '재사용 가능한 UI 블록을 확인하고 조합 기준을 정리하는 빌드 영역입니다.',
    icon: 'build',
    cta: '프리미티브 보기',
    variant: 'default',
    submenuBadges: ['Atoms', 'Molecules', 'Organisms'],
  },
  {
    id: 'service',
    title: 'Context',
    description: '서비스 동작 기준과 운영 맥락을 정렬해 제품 경험의 일관성을 유지합니다.',
    icon: 'devices',
    cta: '맥락 읽기',
    variant: 'default',
    submenuBadges: ['Service', 'Shell'],
  },
  {
    id: 'starry-night',
    title: 'Art',
    description: '자유로운 영감과 디자인시스템의 확장 가능성 탐색',
    icon: 'image',
    cta: '갤러리 입장',
    variant: 'default',
    submenuBadges: ['Water Lilies', 'La Danse II', 'Composition', 'Golconda', 'Starry Night'],
  },
  {
    id: 'design-settings',
    title: 'Settings',
    description:
      '프로젝트 메인 디자인을 조정하는 영역으로, 테마 프리셋과 시맨틱/컴포넌트 매핑을 기준에 맞게 관리합니다.',
    icon: 'settings',
    cta: '설정 열기',
    variant: 'default',
    submenuBadges: ['Preset', 'Semantic Mapping', 'Component Mapping'],
  },
];
