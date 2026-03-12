/**
 * P05: 시맨틱 매핑 편집 모달
 * 가로 넓은 레이아웃: [스케일×스텝 그리드 | 시맨틱 매핑 | 컴포넌트 예시]
 */
import { useMemo, useState, useRef } from 'react';
import { Icon } from '../../../components';
import { Tooltip } from '../../../components';
import { createPalette } from '../../../palettes';
import { defaultSemanticMappings } from '../../../palettes/strategies/default-mappings';
import { getMergedMapping } from '../../../palettes/mapping/resolve';
import type { PaletteDefinition, SemanticMapping } from '../../../palettes/types';
import {
  extractSemanticOverrides,
  parseYamangJSON,
  getImportErrorMessage,
} from '../../../utils/yamang-export';
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
  /** 'built-in' = 적용 시 새 커스텀 프리셋 생성, 'custom' = 적용 시 기존 커스텀 업데이트 */
  mode?: 'built-in' | 'custom';
  onApply?: () => void;
  onExport?: () => void;
  onImport?: (parsed: Partial<SemanticMapping>) => void;
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
  mode = 'built-in',
  onApply,
  onExport,
  onImport,
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
    return (
      has(overrides.bg) ||
      has(overrides.text) ||
      has(overrides.border) ||
      has(overrides.action as Record<string, unknown> | undefined) ||
      has(overrides.feedback as Record<string, unknown> | undefined)
    );
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

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !onImport) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as unknown;
      const overrides = extractSemanticOverrides(parsed);
      if (overrides && typeof overrides === 'object') {
        onImport(overrides);
      } else {
        const payload = parseYamangJSON(text);
        window.alert(getImportErrorMessage('semantic-mapping', payload));
      }
    } catch {
      window.alert(getImportErrorMessage('semantic-mapping', null));
    }
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
          <div className={styles.footerLeft}>
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
          </div>
          <div className={styles.footerRight}>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              className={styles.hiddenInput}
              onChange={handleFileChange}
              aria-hidden
            />
            {onExport && (
              <button
                type="button"
                className={styles.actionBtn}
                onClick={onExport}
                aria-label="JSON 내보내기"
              >
                <Icon name="download" library="nucleo" size="sm" />
                내보내기
              </button>
            )}
            {onImport && (
              <button
                type="button"
                className={styles.actionBtn}
                onClick={handleImportClick}
                aria-label="JSON 가져오기"
              >
                <Icon name="upload" library="nucleo" size="sm" />
                가져오기
              </button>
            )}
            {onApply && (
              <button
                type="button"
                className={styles.applyBtn}
                onClick={onApply}
                disabled={mode === 'built-in' && !hasOverrides}
                aria-label={mode === 'built-in' ? '커스텀 프리셋으로 저장 및 적용' : '변경 사항 저장'}
              >
                <Icon name="check" size="sm" />
                {mode === 'built-in' ? '적용' : '저장'}
              </button>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}
