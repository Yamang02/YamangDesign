/**
 * P07: 시맨틱 매핑 탭 — 상단 action row(팔레트 배지 + Reset) + 2패널
 * P08: 가져오기/내보내기는 페이지 공통으로만 (완전한 세트)
 */
import { useMemo, useState } from 'react';
import { Icon } from '../../../components';
import { createPalette } from '@domain/palettes';
import { defaultSemanticMappings } from '@domain/palettes/strategies/default-mappings';
import { getMergedMapping } from '@domain/palettes/mapping/resolve';
import type { SemanticTokenPath } from '@domain/palettes/mapping/recommendations';
import type { PaletteDefinition, SemanticMapping, ScaleReference } from '@domain/palettes/types';
import { ColorUsageDiagram } from '../PaletteLab/ColorUsageDiagram';
import { ScaleStepGrid } from '../PaletteLab/ScaleStepGrid';
import styles from './SemanticTab.module.css';

export interface SemanticTabProps {
  definition: PaletteDefinition;
  overrides: Partial<SemanticMapping> | null;
  onOverridesChange: (v: Partial<SemanticMapping> | null) => void;
}

function setOverrideAtPath(
  overrides: Partial<SemanticMapping> | null | undefined,
  path: SemanticTokenPath,
  value: string | ScaleReference
): Partial<SemanticMapping> {
  const [cat, key] = path.split('.');
  const prev = overrides ?? {};
  const prevCat =
    (prev as Record<string, unknown>)[cat] as Record<string, unknown> | undefined ?? {};
  return {
    ...prev,
    [cat]: { ...prevCat, [key]: value },
  };
}

export function SemanticTab({
  definition,
  overrides,
  onOverridesChange,
}: Readonly<SemanticTabProps>) {
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
    return (
      has(overrides.bg) ||
      has(overrides.text) ||
      has(overrides.border) ||
      has(overrides.action as Record<string, unknown> | undefined) ||
      has(overrides.feedback as Record<string, unknown> | undefined)
    );
  }, [overrides]);

  const handleMappingChange = (
    path: SemanticTokenPath,
    value: string | ScaleReference
  ) => {
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

  const displayTitle =
    (definition.displayName ?? definition.id ?? 'Palette').toString();
  const displayTitleCap =
    displayTitle.charAt(0).toUpperCase() + displayTitle.slice(1);

  return (
    <div className={styles.root}>
      <div className={styles.actionRow}>
        <span className={styles.paletteBadge}>{displayTitleCap}</span>
        <div className={styles.actionGroup}>
          {hasOverrides && (
            <button
              type="button"
              className={styles.resetBtn}
              onClick={handleReset}
              aria-label="오버라이드 초기화"
            >
              <Icon name="refresh" library="nucleo" size="sm" />
              오버라이드 초기화
            </button>
          )}
        </div>
      </div>

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
    </div>
  );
}
