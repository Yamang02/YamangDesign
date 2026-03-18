import { createContext, useContext, useRef, useState } from 'react';
import type { componentTokenMap } from '@domain/constants';

export type InspectorComponentKey = keyof typeof componentTokenMap;

interface InspectorContextValue {
  isOpen: boolean;
  activeComponent: InspectorComponentKey;
  openInspector: (component?: InspectorComponentKey) => void;
  closeInspector: () => void;
  setActiveComponent: (component: InspectorComponentKey) => void;
  /** LabToc nav 요소 ref — 패널 left 동적 계산용 */
  tocAnchorRef: React.RefObject<HTMLElement | null>;
}

export const InspectorContext = createContext<InspectorContextValue | null>(null);

export function InspectorProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeComponent, setActiveComponent] = useState<InspectorComponentKey>('Button');
  const tocAnchorRef = useRef<HTMLElement | null>(null);

  const openInspector = (component?: InspectorComponentKey) => {
    if (component) setActiveComponent(component);
    setIsOpen(true);
  };

  return (
    <InspectorContext.Provider
      value={{
        isOpen,
        activeComponent,
        openInspector,
        closeInspector: () => setIsOpen(false),
        setActiveComponent,
        tocAnchorRef,
      }}
    >
      {children}
    </InspectorContext.Provider>
  );
}

export function useInspector() {
  return useContext(InspectorContext);
}
