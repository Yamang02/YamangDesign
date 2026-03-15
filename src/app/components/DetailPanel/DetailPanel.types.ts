export interface DetailPanelProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}
