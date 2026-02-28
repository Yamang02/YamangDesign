import { forwardRef, useId } from 'react';
import type { InputProps } from './Input.types';
import { clsx } from '../../utils/clsx';
import styles from './Input.module.css';

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    type = 'text',
    size = 'md',
    variant = 'outline',
    placeholder,
    value,
    defaultValue,
    disabled = false,
    readOnly = false,
    required = false,
    isError = false,
    errorMessage,
    fullWidth = false,
    onChange,
    onFocus,
    onBlur,
    label,
    id,
    className,
  },
  ref
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div
      className={clsx(styles.wrapper, fullWidth && styles.fullWidth, className)}
    >
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}

      <input
        ref={ref}
        id={inputId}
        type={type}
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        aria-invalid={isError}
        aria-describedby={
          isError && errorMessage ? `${inputId}-error` : undefined
        }
        className={styles.input}
        data-variant={variant}
        data-size={size}
        data-error={isError || undefined}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
      />

      {isError && errorMessage && (
        <span
          id={`${inputId}-error`}
          className={styles.errorMessage}
          role="alert"
        >
          {errorMessage}
        </span>
      )}
    </div>
  );
});
