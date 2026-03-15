import type { NavCategory } from '../../config/nav-categories';

export interface NavDropdownProps {
  category: NavCategory;
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (itemId: string) => void;
  activeItem?: string;
}
