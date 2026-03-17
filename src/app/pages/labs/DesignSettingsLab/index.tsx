/**
 * P07: 디자인 설정 페이지 — 프리셋 | 시맨틱 매핑 | 컴포넌트 매핑
 * P08: 액션을 헤더 행 우측 아이콘 버튼으로 이동 (내보내기/가져오기/초기화/적용)
 */
import { useState, useMemo, useCallback } from 'react';
import { Icon } from '../../../components';
import { LabLayout, TabBar } from '../../../layouts';
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

export function DesignSettingsLab({
  onApply,
  initialTab = 'preset',
}: DesignSettingsLabProps) {
  const [activeTab, setActiveTab] = useState<DesignSettingsTabId>(initialTab);

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

  const tabs: { id: DesignSettingsTabId; label: string }[] = [
    { id: 'preset', label: '프리셋' },
    { id: 'semantic', label: '시맨틱 매핑' },
    { id: 'component', label: '컴포넌트 매핑' },
  ];

  return (
    <LabLayout title="디자인 설정" showToc={false}>
      <div className={styles.page}>
        <div className={styles.headerRow}>
          <h1 className={styles.title}>디자인 시스템 설정</h1>
          <div className={styles.headerActions}>
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
          </div>
        </div>

        <TabBar
          tabs={tabs}
          activeTab={activeTab}
          onChange={(id) => setActiveTab(id as DesignSettingsTabId)}
          variant="underline"
        />

        <div className={styles.content} role="tabpanel">
          {activeTab === 'preset' && <PresetTab settings={settings} />}
          {activeTab === 'semantic' && (
            <SemanticTab
              definition={definitionForSemantic}
              overrides={settings.semanticMapping}
              onOverridesChange={settings.setSemanticMapping}
            />
          )}
          {activeTab === 'component' && <ComponentMappingTab />}
        </div>

      </div>
    </LabLayout>
  );
}
