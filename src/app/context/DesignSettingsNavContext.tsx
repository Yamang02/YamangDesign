import { createContext, useContext } from 'react';
import type { DesignSettingsTabId } from '@app/pages/labs/DesignSettingsLab';

export const DesignSettingsNavContext = createContext<{
  openDesignSettings: (initialTab?: DesignSettingsTabId) => void;
} | null>(null);

export function useDesignSettingsNav() {
  return useContext(DesignSettingsNavContext);
}
