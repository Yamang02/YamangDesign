/**
 * P07: 컴포넌트 매핑 탭 — 행별 ✕, 컴포넌트 전체 초기화, 컬러 스와치
 */
import { useState, useMemo, useCallback } from 'react';
import { Icon } from '../../../components';
import {
  loadComponentMappingOverrides,
  saveComponentMappingOverrides,
  type ComponentMappingOverrides,
} from '@app/infra/storage';
import styles from './DesignSettingsLab.module.css';

import mappingData from '../../../content/labs/design-settings/component-mapping.json';

type ComponentDef = {
  id: string;
  label: string;
  category: string;
  previewVariants?: string[];
  tokens: Array<{ prop: string; default: string; description: string }>;
};

type MappingSchema = { components: ComponentDef[] };

const data = mappingData as MappingSchema;

const CATEGORY_LABELS: Record<string, string> = {
  action: '액션',
  form: '폼',
  layout: '레이아웃',
};

function getResolvedValue(token: string): string {
  if (typeof document === 'undefined') return '';
  const val = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
  return val || '(미정의)';
}

function looksLikeColor(value: string): boolean {
  if (!value) return false;
  const v = value.trim();
  return (
    /^#[0-9A-Fa-f]{3,8}$/.test(v) ||
    /^rgb\(/.test(v) ||
    /^rgba\(/.test(v) ||
    /^hsl\(/.test(v) ||
    /^hsla\(/.test(v)
  );
}


export function ComponentMappingTab() {
  const [overrides, setOverrides] = useState<ComponentMappingOverrides>(() =>
    loadComponentMappingOverrides() ?? {}
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedComponent = useMemo(
    () => data.components.find((c) => c.id === selectedId) ?? null,
    [selectedId]
  );

  const componentsByCategory = useMemo(() => {
    const map: Record<string, ComponentDef[]> = {};
    for (const c of data.components) {
      const cat = c.category || 'other';
      if (!map[cat]) map[cat] = [];
      map[cat].push(c);
    }
    return map;
  }, []);

  const persistOverrides = useCallback((next: ComponentMappingOverrides) => {
    setOverrides(next);
    saveComponentMappingOverrides(next);
  }, []);

  const setOverride = useCallback(
    (componentId: string, token: string, value: string) => {
      const trimmed = value.trim();
      const comp = { ...overrides[componentId] };
      if (trimmed) comp[token] = trimmed;
      else delete comp[token];
      if (Object.keys(comp).length === 0) {
        const next = { ...overrides };
        delete next[componentId];
        persistOverrides(next);
      } else {
        persistOverrides({ ...overrides, [componentId]: comp });
      }
    },
    [overrides, persistOverrides]
  );

  const clearTokenOverride = useCallback(
    (componentId: string, token: string) => {
      setOverride(componentId, token, '');
    },
    [setOverride]
  );

  const clearComponentOverrides = useCallback(
    (componentId: string) => {
      const next = { ...overrides };
      delete next[componentId];
      persistOverrides(next);
    },
    [overrides, persistOverrides]
  );


  return (
    <div className={styles.componentMappingRoot}>
      <aside className={styles.componentMappingList} aria-label="컴포넌트 목록">
        {Object.entries(componentsByCategory).map(([cat, comps]) => (
          <div key={cat} className={styles.componentMappingListSection}>
            <h3 className={styles.componentMappingListSectionTitle}>
              {CATEGORY_LABELS[cat] ?? cat}
            </h3>
            {comps.map((c) => (
              <button
                key={c.id}
                type="button"
                className={
                  selectedId === c.id
                    ? `${styles.componentMappingListItem} ${styles.componentMappingListItemActive}`
                    : styles.componentMappingListItem
                }
                onClick={() => setSelectedId(c.id)}
              >
                {c.label}
              </button>
            ))}
          </div>
        ))}
      </aside>

      <div className={styles.componentMappingTableWrap}>
        {selectedComponent ? (
          <>
          <table className={styles.componentMappingTable}>
            <thead>
              <tr>
                <th>속성</th>
                <th>기본 토큰</th>
                <th>현재 값</th>
                <th>오버라이드</th>
                <th aria-label="해당 행 초기화" />
              </tr>
            </thead>
            <tbody>
              {selectedComponent.tokens.map((t) => {
                const token = t.default;
                const overrideVal = overrides[selectedComponent.id]?.[token];
                const currentVal = overrideVal ?? getResolvedValue(token);
                const showSwatch = looksLikeColor(currentVal);
                return (
                  <tr key={t.prop}>
                    <td>
                      <span title={t.description}>{t.prop}</span>
                    </td>
                    <td>
                      <code>{token.replace('--ds-', '')}</code>
                    </td>
                    <td>
                      {showSwatch && (
                        <span
                          className={styles.tokenSwatch}
                          style={{ backgroundColor: currentVal }}
                          aria-hidden
                        />
                      )}
                      <code title={currentVal}>
                        {currentVal.length > 40 ? `${currentVal.slice(0, 40)}…` : currentVal}
                      </code>
                    </td>
                    <td>
                      <input
                        type="text"
                        value={overrideVal ?? ''}
                        onChange={(e) =>
                          setOverride(selectedComponent.id, token, e.target.value)
                        }
                        placeholder="토큰명 또는 값"
                        aria-label={`${t.prop} 오버라이드`}
                      />
                    </td>
                    <td>
                      {overrideVal != null && overrideVal !== '' ? (
                        <button
                          type="button"
                          className={styles.clearRowBtn}
                          onClick={() => clearTokenOverride(selectedComponent.id, token)}
                          aria-label={`${t.prop} 오버라이드 제거`}
                        >
                          <Icon name="close" size="sm" />
                        </button>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {selectedComponent &&
            overrides[selectedComponent.id] &&
            Object.keys(overrides[selectedComponent.id]).length > 0 && (
              <div className={styles.clearComponentRow}>
                <button
                  type="button"
                  className={styles.clearComponentBtn}
                  onClick={() => clearComponentOverrides(selectedComponent.id)}
                  aria-label="이 컴포넌트 오버라이드 전체 초기화"
                >
                  <Icon name="refresh" library="nucleo" size="sm" />
                  이 컴포넌트 초기화
                </button>
              </div>
            )}
          </>
        ) : (
          <p className={styles.componentMappingEmpty}>
            왼쪽에서 컴포넌트를 선택하세요.
          </p>
        )}
      </div>

    </div>
  );
}
