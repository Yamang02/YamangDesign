/* eslint-disable react-refresh/only-export-components -- context: Provider + hook + types */
import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
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
  /** LabToc에서 nav ref 연결 시 사용 (ref.current 직접 대입 대신 Provider 내부에서만 갱신) */
  setTocAnchorElement: (el: HTMLElement | null) => void;
}

export const InspectorContext = createContext<InspectorContextValue | null>(null);

export function InspectorProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeComponent, setActiveComponent] = useState<InspectorComponentKey>('Button');
  const tocAnchorRef = useRef<HTMLElement | null>(null);

  const openInspector = useCallback((component?: InspectorComponentKey) => {
    if (component) setActiveComponent(component);
    setIsOpen(true);
  }, []);

  const closeInspector = useCallback(() => setIsOpen(false), []);

  const setTocAnchorElement = useCallback((el: HTMLElement | null) => {
    tocAnchorRef.current = el;
  }, []);

  const value = useMemo<InspectorContextValue>(() => ({
    isOpen,
    activeComponent,
    openInspector,
    closeInspector,
    setActiveComponent,
    tocAnchorRef,
    setTocAnchorElement,
  }), [isOpen, activeComponent, openInspector, closeInspector, setTocAnchorElement]);

  return (
    <InspectorContext.Provider value={value}>
      {children}
    </InspectorContext.Provider>
  );
}

export function useInspector() {
  return useContext(InspectorContext);
}
