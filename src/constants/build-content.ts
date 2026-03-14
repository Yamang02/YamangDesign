/**
 * E06 P05: Build — Molecules & Organisms 쇼케이스 콘텐츠
 * Molecule/Organism 정의: id, 제목, 구성 Atoms/Molecules, 조합 트리, 토큰
 */

export type MoleculeId =
  | 'form-field'
  | 'search-bar'
  | 'profile-card'
  | 'action-card'
  | 'tag-group';

export type OrganismId =
  | 'header-bar'
  | 'sidebar-nav'
  | 'card-grid'
  | 'form-card'
  | 'status-banner';

export interface MoleculeDef {
  id: MoleculeId;
  title: string;
  /** 카드 하단에 표시할 구성 Atom 이름 목록 */
  composedOf: string[];
  /** CompositionMap용 트리 라인 */
  compositionLines: string[];
  variantCount: number;
  /** 모달 토큰 목록 (선택) */
  tokens?: Array<{ token: string; label?: string }>;
}

export interface OrganismDef {
  id: OrganismId;
  title: string;
  /** 카드 하단에 표시할 구성 Molecule/Atom 이름 목록 */
  composedOf: string[];
  compositionLines: string[];
  variantCount: number;
  tokens?: Array<{ token: string; label?: string }>;
}

export const MOLECULES: MoleculeDef[] = [
  {
    id: 'form-field',
    title: 'FormField',
    composedOf: ['Input', 'Label', 'Helper text'],
    compositionLines: [
      'FormField',
      '├── Label',
      '├── Input',
      '└── Helper text',
    ],
    variantCount: 2,
    tokens: [
      { token: '--ds-spacing-2', label: '라벨-입력 간격' },
      { token: '--ds-text-caption-size', label: '헬퍼/에러 폰트' },
      { token: '--sys-color-error', label: '에러 텍스트' },
    ],
  },
  {
    id: 'search-bar',
    title: 'SearchBar',
    composedOf: ['Input', 'Button', 'Icon'],
    compositionLines: [
      'SearchBar',
      '├── Input',
      '└── Button',
      '    └── Icon',
    ],
    variantCount: 1,
    tokens: [
      { token: '--ds-radius-md', label: '입력/버튼 모서리' },
      { token: '--ds-spacing-2', label: '입력-버튼 간격' },
    ],
  },
  {
    id: 'profile-card',
    title: 'ProfileCard',
    composedOf: ['Avatar', 'Badge', 'Text'],
    compositionLines: [
      'ProfileCard',
      '├── Avatar',
      '├── Text (name/role)',
      '└── Badge',
    ],
    variantCount: 2,
    tokens: [
      { token: '--ds-spacing-3', label: '아바타-텍스트 간격' },
      { token: '--ds-text-body-sm-size', label: '보조 텍스트' },
    ],
  },
  {
    id: 'action-card',
    title: 'ActionCard',
    composedOf: ['Card', 'Button'],
    compositionLines: [
      'ActionCard',
      '├── Card',
      '│   ├── Header/Body',
      '│   └── Footer',
      '└── Button (CTA)',
    ],
    variantCount: 2,
    tokens: [
      { token: '--ds-radius-lg', label: '카드 모서리' },
      { token: '--ds-color-action-primary-default', label: 'CTA 버튼' },
    ],
  },
  {
    id: 'tag-group',
    title: 'TagGroup',
    composedOf: ['Badge × n'],
    compositionLines: [
      'TagGroup',
      '└── Badge × n',
    ],
    variantCount: 1,
    tokens: [
      { token: '--ds-spacing-2', label: '태그 간격' },
    ],
  },
];

export const ORGANISMS: OrganismDef[] = [
  {
    id: 'header-bar',
    title: 'HeaderBar',
    composedOf: ['Navigation', 'ProfileCard', 'Button'],
    compositionLines: [
      'HeaderBar',
      '├── Navigation',
      '├── ProfileCard',
      '└── Button (actions)',
    ],
    variantCount: 1,
    tokens: [
      { token: '--shell-bg-base', label: '헤더 배경' },
      { token: '--ds-spacing-4', label: '내부 간격' },
    ],
  },
  {
    id: 'sidebar-nav',
    title: 'SidebarNav',
    composedOf: ['NavItem × n', 'Badge'],
    compositionLines: [
      'SidebarNav',
      '└── NavItem × n',
      '    └── Badge (optional)',
    ],
    variantCount: 1,
    tokens: [
      { token: '--shell-bg-surface', label: '사이드바 배경' },
      { token: '--ds-spacing-2', label: '아이템 간격' },
    ],
  },
  {
    id: 'card-grid',
    title: 'CardGrid',
    composedOf: ['ActionCard × n'],
    compositionLines: [
      'CardGrid',
      '└── ActionCard × n',
    ],
    variantCount: 1,
    tokens: [
      { token: '--ds-spacing-6', label: '그리드 갭' },
    ],
  },
  {
    id: 'form-card',
    title: 'FormCard',
    composedOf: ['Card', 'FormField × n', 'Button'],
    compositionLines: [
      'FormCard',
      '└── Card',
      '    ├── FormField × n',
      '    │   ├── Input',
      '    │   └── Label',
      '    └── Button',
    ],
    variantCount: 1,
    tokens: [
      { token: '--ds-spacing-4', label: '필드 간격' },
      { token: '--ds-spacing-6', label: '카드 패딩' },
    ],
  },
  {
    id: 'status-banner',
    title: 'StatusBanner',
    composedOf: ['Icon', 'sys-color text'],
    compositionLines: [
      'StatusBanner',
      '├── Icon',
      '└── Text (sys-color)',
    ],
    variantCount: 3,
    tokens: [
      { token: '--sys-color-info', label: '정보' },
      { token: '--sys-color-warning', label: '경고' },
      { token: '--sys-color-error', label: '에러' },
    ],
  },
];
