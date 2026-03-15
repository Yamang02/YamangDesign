/**
 * E03: TOC 항목 타입
 */
export interface TocItem {
  id: string;
  label: string;
}

/**
 * TOC 트리 항목 (하위 항목 지원)
 */
export interface TocItemTree {
  id: string;
  label: string;
  children?: TocItemTree[];
}
