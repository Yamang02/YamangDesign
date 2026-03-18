/**
 * Shell 컴포넌트 인벤토리 데이터.
 * ShellContext Overview 동적 렌더링에 사용.
 * 컴포넌트 추가 시 이 파일만 수정하면 Overview에 자동 반영됨.
 */

export interface ShellInventoryItem {
  component: string;
  path: string;
  tokens: string[];
}

export interface ShellTokenMapRow {
  area: string;
  token: string;
}

export const SHELL_INVENTORY: ShellInventoryItem[] = [
  {
    component: 'Header',
    path: 'src/components/Header',
    tokens: ['--shell-bg-base', '--shell-border-default', '--shell-text-primary'],
  },
  {
    component: 'HeaderNav',
    path: 'src/components/Header/HeaderNav',
    tokens: ['--shell-bg-hover', '--shell-text-hover', '--shell-bg-elevated', '--shell-text-primary'],
  },
  {
    component: 'Navigation',
    path: 'src/components/Navigation',
    tokens: ['--shell-action-primary', '--shell-bg-elevated', '--shell-text-primary', '--shell-bg-base'],
  },
  {
    component: 'NavDropdown',
    path: 'src/components/Header/HeaderNavDropdown',
    tokens: ['--shell-bg-elevated', '--shell-border-default', '--shell-shadow-md', '--shell-action-active'],
  },
  {
    component: 'Footer',
    path: 'src/components/Footer',
    tokens: ['--shell-bg-subtle', '--shell-text-primary', '--shell-text-secondary', '--shell-border-default'],
  },
];

export const SHELL_TOKEN_MAP: ShellTokenMapRow[] = [
  { area: 'Header/Footer 배경', token: '--shell-bg-base' },
  { area: 'Footer 배경 (subtle)', token: '--shell-bg-subtle' },
  { area: '드롭다운/Nav 부유 배경', token: '--shell-bg-elevated' },
  { area: '기본 텍스트', token: '--shell-text-primary' },
  { area: '보조 텍스트', token: '--shell-text-secondary' },
  { area: '호버 배경', token: '--shell-bg-hover' },
  { area: '호버 텍스트', token: '--shell-text-hover' },
  { area: '기본 보더', token: '--shell-border-default' },
  { area: '주요 액션 (활성 Nav)', token: '--shell-action-primary' },
  { area: '현재 선택 항목', token: '--shell-action-active' },
];
