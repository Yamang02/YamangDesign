import type { IconProps } from './Icon.types';
import { clsx } from '../../utils/clsx';
import styles from './Icon.module.css';
import { materialIcons } from './icons/material';
import { nucleoIcons } from './icons/nucleo';

const sizeMap = {
  sm: 16,
  md: 20,
  lg: 24,
} as const;

export function Icon({
  name,
  library = 'material',
  size = 'md',
  color = 'currentColor',
  className,
  title,
  style,
}: IconProps) {
  const sizeValue = typeof size === 'number' ? size : sizeMap[size];

  // Material Icons (fill-based)
  if (library === 'material') {
    const path = materialIcons[name];

    if (!path) {
      console.warn(`Icon "${name}" not found in material library`);
      return null;
    }

    return (
      <span className={clsx(styles.icon, className)} style={style}>
        <svg
          width={sizeValue}
          height={sizeValue}
          viewBox="0 0 24 24"
          fill={color}
          role={title ? 'img' : 'presentation'}
          aria-label={title}
          aria-hidden={!title}
        >
          {title && <title>{title}</title>}
          <path d={path} />
        </svg>
      </span>
    );
  }

  // Nucleo Icons (stroke-based)
  if (library === 'nucleo') {
    const iconData = nucleoIcons[name];

    if (!iconData) {
      console.warn(`Icon "${name}" not found in nucleo library`);
      return null;
    }

    const { path, stroke } = iconData;

    return (
      <span className={clsx(styles.icon, className)} style={style}>
        <svg
          width={sizeValue}
          height={sizeValue}
          viewBox="0 0 24 24"
          fill={stroke ? 'none' : color}
          stroke={stroke ? color : 'none'}
          strokeWidth={stroke ? 2 : 0}
          strokeLinecap="round"
          strokeLinejoin="round"
          role={title ? 'img' : 'presentation'}
          aria-label={title}
          aria-hidden={!title}
        >
          {title && <title>{title}</title>}
          <path d={path} />
        </svg>
      </span>
    );
  }

  return null;
}
