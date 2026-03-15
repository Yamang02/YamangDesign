import { useState, useEffect } from 'react';
import type { HexInputProps } from './ColorPicker.types';
import styles from './HexInput.module.css';

const HEX_REGEX = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

function isValidHex(value: string): boolean {
  return HEX_REGEX.test(value);
}

function normalizeHex(value: string): string {
  if (/^#[A-Fa-f0-9]{3}$/.test(value)) {
    const r = value[1];
    const g = value[2];
    const b = value[3];
    return `#${r}${r}${g}${g}${b}${b}`.toUpperCase();
  }
  return value.toUpperCase();
}

export function HexInput({
  value,
  onChange,
  label,
  showColorPreview = true,
  disabled = false,
}: HexInputProps) {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    if (newValue && !newValue.startsWith('#')) {
      newValue = '#' + newValue;
    }
    setInputValue(newValue);
    if (isValidHex(newValue)) {
      onChange(normalizeHex(newValue));
    }
  };

  const handleBlur = () => {
    if (!isValidHex(inputValue)) {
      setInputValue(value);
    }
  };

  const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.toUpperCase();
    setInputValue(newValue);
    onChange(newValue);
  };

  const isError = Boolean(inputValue && !isValidHex(inputValue));

  return (
    <div className={styles.wrapper}>
      {label && <span className={styles.label}>{label}</span>}
      <div className={styles.row}>
        {showColorPreview && (
          <div
            className={styles.colorPreview}
            style={{
              backgroundColor: isValidHex(inputValue) ? inputValue : value,
            }}
          >
            <input
              type="color"
              value={isValidHex(inputValue) ? normalizeHex(inputValue) : value}
              onChange={handleColorPickerChange}
              className={styles.nativeColorInput}
              disabled={disabled}
            />
          </div>
        )}
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className={styles.hexInput}
          data-error={isError || undefined}
          placeholder="#000000"
          maxLength={7}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
