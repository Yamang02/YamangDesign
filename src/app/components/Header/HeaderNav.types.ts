export interface HeaderNavProps {
  activePage: string;
  onSelect: (pageId: string) => void;
  /** P05: 설정 버튼 클릭 시 호출 (설정 페이지로 이동) */
  onOpenSettings?: () => void;
}
