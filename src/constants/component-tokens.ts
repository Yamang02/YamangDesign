export const componentTokenMap = {
  Button: {
    'primary bg': '--ds-color-action-primary-default',
    'primary bg hover': '--ds-color-action-primary-hover',
    'primary bg active': '--ds-color-action-primary-active',
    'secondary bg': '--ds-color-action-secondary-default',
    'accent bg': '--ds-color-action-accent-default',
    'text on action': '--ds-color-text-on-action',
    'ghost text': '--ds-color-text-primary',
    'subtle bg': '--ds-color-bg-muted',
    'focus ring': '--ds-color-border-focus',
    shadow: '--ds-shadow-sm',
  },
  Input: {
    bg: '--ds-color-bg-surface',
    border: '--ds-color-border-default',
    'border hover': '--ds-color-border-focus',
    'border focus': '--ds-color-border-focus',
    text: '--ds-color-text-primary',
    placeholder: '--ds-color-text-muted',
    'error border': '--ds-color-system-error',
    'error text': '--ds-color-system-error',
  },
  Card: {
    bg: '--ds-color-bg-surface',
    border: '--ds-color-border-subtle',
    shadow: '--ds-shadow-sm',
  },
  Badge: {
    'default bg': '--ds-color-bg-muted',
    'default text': '--ds-color-text-secondary',
    'primary bg': '--ds-color-action-primary-default',
    'primary text': '--ds-color-text-on-action',
  },
} as const;

export type ComponentTokenMap = typeof componentTokenMap;
