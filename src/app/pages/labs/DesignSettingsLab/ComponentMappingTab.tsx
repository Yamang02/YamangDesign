/**
 * P07: 컴포넌트 매핑 탭 — 행별 ✕, 컴포넌트 전체 초기화, 컬러 스와치, previewVariants 기반 Preview
 */
import type { ReactNode } from 'react';
import { useState, useMemo, useCallback } from 'react';
import { Icon, Button, Input, Select, Card, Badge } from '../../../components';
import { showcaseContent, selectShowcase } from '@app/content/showcase-content';
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

function renderPreviewByVariants(
  id: string,
  comp: ComponentDef | null
): ReactNode {
  const variants = comp?.previewVariants;
  if (id === 'button' && Array.isArray(variants)) {
    return variants.map((v) => (
      <Button key={v} variant={v as 'primary' | 'outline' | 'ghost'}>{showcaseContent.button}</Button>
    ));
  }
  if (id === 'input') {
    return <Input placeholder={showcaseContent.input} />;
  }
  if (id === 'select') {
    return (
      <Select
        options={[...selectShowcase.fruitOptions]}
        value="apple"
        onChange={() => {}}
        variant="outline"
        placeholder={showcaseContent.select}
      />
    );
  }
  if (id === 'card') {
    const variant = variants?.[0] ?? 'elevated';
    return (
      <Card variant={variant as 'elevated'} padding="md">
        <Card.Header>{showcaseContent.card.title}</Card.Header>
        <Card.Body>{showcaseContent.card.body}</Card.Body>
        <Card.Footer>
          <Button variant="primary" size="sm">
            {showcaseContent.button}
          </Button>
        </Card.Footer>
      </Card>
    );
  }
  if (id === 'badge' && Array.isArray(variants)) {
    return variants.map((v) => (
      <Badge key={v} variant={v as 'primary' | 'outline' | 'subtle'}>{showcaseContent.badge}</Badge>
    ));
  }
  if (comp?.tokens?.length) {
    return (
      <p className={styles.componentMappingEmpty}>
        {comp.tokens.map((t) => t.default.replace('--ds-', '')).join(', ')}
      </p>
    );
  }
  return (
    <p className={styles.componentMappingEmpty}>
      미리보기를 지원하지 않는 컴포넌트입니다.
    </p>
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


  type CssVarStyle = React.CSSProperties & Record<`--${string}`, string>;
  const previewStyle = useMemo((): CssVarStyle => {
    if (!selectedId) return {};
    const compOverrides = overrides[selectedId];
    if (!compOverrides || Object.keys(compOverrides).length === 0) return {};
    const s: Record<string, string> = {};
    for (const [token, value] of Object.entries(compOverrides)) {
      if (value) s[token] = value.startsWith('var(') ? value : value;
    }
    return s as CssVarStyle;
  }, [selectedId, overrides]);

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

      <div className={styles.componentMappingPreview} aria-label="Live Preview">
        {selectedId ? (
          <>
            <p className={styles.componentMappingPreviewLabel}>Live Preview</p>
            <div data-context="preview" style={previewStyle}>
              {renderPreviewByVariants(selectedId, selectedComponent)}
            </div>
          </>
        ) : (
          <p className={styles.componentMappingEmpty}>
            컴포넌트를 선택하면 미리보기가 표시됩니다.
          </p>
        )}
      </div>
    </div>
  );
}
