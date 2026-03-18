/**
 * E15 P04: PreviewControlPanel — 프리뷰 테마 컨트롤 (radio 버튼 그리드)
 * Select 드롭박스를 대체하는 pill-style 옵션 버튼 그룹.
 */
import styles from './PreviewControlPanel.module.css';

export interface PreviewControlOption {
  value: string;
  label: string;
  description?: string;
}

export interface PreviewControlPanelProps {
  label: string;
  value: string;
  options: PreviewControlOption[];
  onChange: (value: string) => void;
}

export function PreviewControlPanel({ label, value, options, onChange }: PreviewControlPanelProps) {
  return (
    <div className={styles.controlPanel}>
      <span className={styles.controlLabel}>{label}</span>
      <div className={styles.controlOptions}>
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={`${styles.controlOption} ${value === opt.value ? styles.controlOptionActive : ''}`}
            onClick={() => onChange(opt.value)}
            title={opt.description}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
