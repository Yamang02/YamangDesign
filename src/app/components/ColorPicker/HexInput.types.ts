export interface HexInputProps {
  value: string;
  onChange: (hex: string) => void;
  label?: string;
  showColorPreview?: boolean;
  size?: 'sm' | 'md';
  disabled?: boolean;
}
