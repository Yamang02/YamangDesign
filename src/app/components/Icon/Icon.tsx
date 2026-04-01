import type { IconProps } from './Icon.types';
import { clsx } from '@shared/utils/clsx';
import styles from './Icon.module.css';
import { materialIcons } from './icons/material';
import { nucleoIcons } from './icons/nucleo';

interface SvgConfig {
  path: string;
  fill: string;
  stroke: string;
  strokeWidth: number;
  strokeLinecap?: 'round';
  strokeLinejoin?: 'round';
}

function buildNucleoConfig(
  iconData: { path: string; stroke?: boolean },
  color: string,
): SvgConfig {
  const { path, stroke } = iconData;
  return {
    path,
    fill: stroke ? 'none' : color,
    stroke: stroke ? color : 'none',
    strokeWidth: stroke ? 2 : 0,
    strokeLinecap: stroke ? 'round' : undefined,
    strokeLinejoin: stroke ? 'round' : undefined,
  };
}

function renderSvg(
  config: SvgConfig,
  wrapperClass: string,
  wrapperStyle: React.CSSProperties | undefined,
  title: string | undefined,
) {
  return (
    <span className={wrapperClass} style={wrapperStyle}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 24 24"
        fill={config.fill}
        stroke={config.stroke}
        strokeWidth={config.strokeWidth}
        strokeLinecap={config.strokeLinecap}
        strokeLinejoin={config.strokeLinejoin}
        aria-label={title ?? undefined}
        aria-hidden={title ? undefined : true}
      >
        {title && <title>{title}</title>}
        <path d={config.path} />
      </svg>
    </span>
  );
}

export function Icon({
  name,
  library = 'material',
  size = 'md',
  color = 'currentColor',
  className,
  title,
  style,
}: IconProps) {
  const sizeClass = styles[`size${size.charAt(0).toUpperCase() + size.slice(1)}`];
  const wrapperClass = clsx(styles.icon, sizeClass, className);

  if (library === 'material') {
    const path = materialIcons[name];

    if (!path) {
      console.warn(`Icon "${name}" not found in material library`);
      return null;
    }

    return renderSvg(
      { path, fill: color, stroke: 'none', strokeWidth: 0 },
      wrapperClass, style, title,
    );
  }

  if (library === 'nucleo') {
    const iconData = nucleoIcons[name];

    if (!iconData) {
      console.warn(`Icon "${name}" not found in nucleo library`);
      return null;
    }

    return renderSvg(
      buildNucleoConfig(iconData, color),
      wrapperClass, style, title,
    );
  }

  return null;
}
