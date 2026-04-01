type ClassValue =
  | string
  | number
  | boolean
  | undefined
  | null
  | ClassValue[]
  | { [key: string]: boolean };

/**
 * 조건부 클래스 병합 유틸리티
 * clsx(styles.button, { [styles.primary]: variant === 'primary' }, disabled && styles.disabled)
 */
function pushObjectKeys(obj: { [key: string]: boolean }, classes: string[]): void {
  for (const [key, value] of Object.entries(obj)) {
    if (value) classes.push(key);
  }
}

export function clsx(...inputs: ClassValue[]): string {
  const classes: string[] = [];

  for (const input of inputs) {
    if (input == null) continue;
    if (typeof input === 'string' && input.length > 0) {
      classes.push(input);
    } else if (typeof input === 'number') {
      classes.push(String(input));
    } else if (Array.isArray(input)) {
      classes.push(clsx(...input));
    } else if (typeof input === 'object') {
      pushObjectKeys(input, classes);
    }
  }

  return classes.join(' ');
}
