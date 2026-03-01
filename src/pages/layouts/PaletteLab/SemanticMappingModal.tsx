/**
 * P05: 시맨틱 매핑 편집 모달
 * 가로 넓은 레이아웃: [스케일×스텝 그리드 | 시맨틱 매핑 | 컴포넌트 예시]
 */
import { useMemo, useState } from 'react';
import { Icon } from '../../../components';
import { Tooltip } from '../../../components';
import { createPalette } from '../../../palettes';
import { defaultSemanticMappings } from '../../../palettes/strategies/default-mappings';
import { getMergedMapping } from '../../../palettes/mapping/resolve';
import type { PaletteDefinition, SemanticMapping } from '../../../palettes/types';
import type { SemanticTokenPath } from '../../../palettes/mapping/recommendations';
import type { ScaleReference } from '../../../palettes/types';
import { ColorUsageDiagram } from './ColorUsageDiagram';
import { ScaleStepGrid } from './ScaleStepGrid';
import styles from './SemanticMappingModal.module.css';

export interface SemanticMappingModalProps {
  open: boolean;
  onClose: () => void;
  definition: PaletteDefinition;
  overrides?: Partial<SemanticMapping> | null;
  onOverridesChange: (overrides: Partial<SemanticMapping> | null) => void;
}

function setOverrideAtPath(
  overrides: Partial<SemanticMapping> | null | undefined,
  path: SemanticTokenPath,
  value: string | ScaleReference
): Partial<SemanticMapping> {
  const [cat, key] = path.split('.');
  const prev = overrides ?? {};
  const prevCat = (prev as Record<string, unknown>)[cat] as Record<string, unknown> | undefined ?? {};
  return {
    ...prev,
    [cat]: { ...prevCat, [key]: value },
  };
}

export function SemanticMappingModal({
  open,
  onClose,
  definition,
  overrides,
  onOverridesChange,
}: SemanticMappingModalProps) {
  const [selectedToken, setSelectedToken] = useState<SemanticTokenPath | null>(null);

  const { expanded, mapping } = useMemo(() => {
    const exp = createPalette(definition);
    const base = getMergedMapping(
      defaultSemanticMappings[definition.bgStrategy],
      definition.semanticMapping
    );
    const merged = getMergedMapping(base, overrides ?? undefined);
    return { expanded: exp, mapping: merged };
  }, [definition, overrides]);

  const hasOverrides = useMemo(() => {
    if (!overrides) return false;
    const has = (obj: Record<string, unknown> | undefined) =>
      obj && Object.keys(obj).length > 0;
    return has(overrides.bg) || has(overrides.text) || has(overrides.border);
  }, [overrides]);

  const handleMappingChange = (path: SemanticTokenPath, value: string | ScaleReference) => {
    onOverridesChange(setOverrideAtPath(overrides, path, value));
  };

  const handleTokenSelect = (path: SemanticTokenPath) => {
    setSelectedToken(path);
  };

  const handleScaleSelect = (value: ScaleReference) => {
    if (selectedToken) {
      handleMappingChange(selectedToken, value);
      setSelectedToken(null);
    }
  };

  const handleReset = () => {
    onOverridesChange(null);
  };

  if (!open) return null;

  const title = definition.metadata?.displayName ?? definition.name;
  const displayTitle = title.charAt(0).toUpperCase() + title.slice(1);

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="semantic-mapping-modal-title"
    >
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        data-ui-light
      >
        <header className={styles.header}>
          <h2 id="semantic-mapping-modal-title" className={styles.title}>
            {displayTitle} · 시맨틱 매핑
          </h2>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="닫기"
          >
            <Icon name="close" size="sm" />
          </button>
        </header>

        <div className={styles.body}>
          <aside className={styles.leftSlot}>
            {expanded?.scales && (
              <ScaleStepGrid
                scales={expanded.scales}
                bgStrategy={definition.bgStrategy}
                selectedToken={selectedToken}
                onSelect={handleScaleSelect}
              />
            )}
          </aside>
          <div className={styles.main}>
            <ColorUsageDiagram
              interactive
              palette={expanded}
              mapping={mapping}
              onMappingChange={handleMappingChange}
              hideColorRoles
              horizontalLayout
              onTokenSelect={handleTokenSelect}
            />
          </div>
        </div>

        <footer className={styles.footer}>
          {hasOverrides && (
            <Tooltip content="기본 매핑으로 되돌리기" portal position="top">
              <button
                type="button"
                className={styles.resetBtn}
                onClick={handleReset}
                aria-label="기본값으로 초기화"
              >
                <Icon name="refresh" library="nucleo" size="sm" />
                Reset to Default
              </button>
            </Tooltip>
          )}
        </footer>
      </div>
    </div>
  );
}
