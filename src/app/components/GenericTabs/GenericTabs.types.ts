export interface TabItem<T extends string> {
  id: T;
  label: string;
}

export interface GenericTabsProps<T extends string> {
  /** 탭 목록 */
  tabs: readonly TabItem<T>[] | TabItem<T>[];
  /** 현재 활성 탭 ID */
  activeTab: T;
  /** 탭 변경 핸들러 */
  onTabChange: (tab: T) => void;
  /** 접근성 레이블 */
  ariaLabel: string;
  /** 추가 클래스명 */
  className?: string;
}
