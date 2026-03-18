/**
 * E16 P02: 디자인 설정 페이지 — LabLayout + LabSection 패턴으로 통일
 * 프리셋 / 시맨틱 매핑 / 컴포넌트 매핑을 스크롤 섹션으로 배치.
 */
import { useEffect, useMemo, useCallback } from 'react';
import { Icon } from '../../../components';
import { LabLayout, LabSection } from '../../../layouts';
import { useTheme } from '@domain/themes';
import { resolveSelection } from '../../../hooks/usePaletteResolution';
import { useGlobalSettings } from '../../../components/GlobalSettings';
import type { StoredSettings } from '../../../components/GlobalSettings/types';
import { clearComponentMappingOverrides } from '@app/infra/storage';
import { PresetTab } from './PresetTab';
import { SemanticTab } from './SemanticTab';
import { ComponentMappingTab } from './ComponentMappingTab';
import styles from './DesignSettingsLab.module.css';

export type DesignSettingsTabId = 'preset' | 'semantic' | 'component';

export interface DesignSettingsLabProps {
  /** 적용 시 호출 (draft를 App에 반영) */
  onApply?: (draft: StoredSettings) => void;
  /** 초기 탭 (예: PaletteLab "시맨틱 매핑 편집"에서 진입 시 'semantic') */
  initialTab?: DesignSettingsTabId;
}

const tocItems = [
  { id: 'preset', label: '프리셋' },
  { id: 'semantic', label: '시맨틱 매핑' },
  { id: 'component', label: '컴포넌트 매핑' },
];

export function DesignSettingsLab({
  onApply,
  initialTab,
}: DesignSettingsLabProps) {
  useEffect(() => {
    if (initialTab && initialTab !== 'preset') {
      requestAnimationFrame(() => {
        document.getElementById(initialTab)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }, [initialTab]);

  const settings = useGlobalSettings({
    onApply,
  });

  const { customSemanticPresets } = useTheme();
  const definitionForSemantic = useMemo(
    () => resolveSelection(settings.selection, customSemanticPresets).definition,
    [settings.selection, customSemanticPresets]
  );

  const handleApply = () => {
    settings.apply();
  };

  const handleReset = useCallback(() => {
    settings.reset();
    clearComponentMappingOverrides();
  }, [settings]);

  const handleExport = useCallback(() => {
    settings.exportSettings();
  }, [settings]);

  const handleImport = useCallback(async () => {
    await settings.importSettings();
  }, [settings]);

  const headerActions = (
    <>
      <button
        type="button"
        className={styles.headerIconBtn}
        onClick={handleExport}
        aria-label="내보내기"
      >
        <Icon name="download" library="nucleo" size="sm" />
      </button>
      <button
        type="button"
        className={styles.headerIconBtn}
        onClick={handleImport}
        aria-label="가져오기"
      >
        <Icon name="upload" library="nucleo" size="sm" />
      </button>
      <button
        type="button"
        className={styles.headerIconBtn}
        onClick={handleReset}
        aria-label="초기화"
      >
        <Icon name="refresh" library="nucleo" size="sm" />
      </button>
      <button
        type="button"
        className={styles.applyBtn}
        onClick={handleApply}
        disabled={!settings.hasChanges}
        aria-label="적용"
      >
        <Icon name="check" library="nucleo" size="sm" />
        적용
      </button>
    </>
  );

  return (
    <LabLayout title="디자인 설정" tocItems={tocItems} headerActions={headerActions}>
      <LabSection title="프리셋" id="preset" card>
        <PresetTab settings={settings} />
      </LabSection>

      <LabSection title="시맨틱 매핑" id="semantic" card>
        <SemanticTab
          definition={definitionForSemantic}
          overrides={settings.semanticMapping}
          onOverridesChange={settings.setSemanticMapping}
        />
      </LabSection>

      <LabSection title="컴포넌트 매핑" id="component" card>
        <ComponentMappingTab />
      </LabSection>
    </LabLayout>
  );
}
