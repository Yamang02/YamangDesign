import type { ReactNode } from 'react';

export interface ComponentCardProps {
  id: string;
  title: string;
  variantCount: number;
  preview: ReactNode;
  onClick: () => void;
  /** E06 P04: 이 Atom이 어떤 Molecule에서 쓰이는지 (Atoms 카드 하단) */
  usedIn?: string[];
  /** E06 P05: 이 Molecule/Organism을 구성하는 Atoms/Molecules 이름 목록 (카드 하단) */
  composedOf?: string[];
  /** composedOf 레이블 (기본값: "Atoms:") */
  composedOfLabel?: string;
}
