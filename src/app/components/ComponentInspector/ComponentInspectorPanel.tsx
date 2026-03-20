import { useEffect, useState } from 'react';
import { useTheme } from '@domain/themes';
import { componentTokenMap, getThemeVariables } from '@domain/constants';
import { Button, Input, Card, Badge, Avatar, Select } from '@app/components';
import { TabBar } from '@app/layouts/LabLayout';
import { sampleText } from '@app/content/lab-content';
import { selectShowcase } from '@app/content/showcase-content';
import { useCssVar } from '@app/hooks/useCssVar';
import { useInspector, type InspectorComponentKey } from '@app/context/InspectorContext';
import styles from './ComponentInspectorPanel.module.css';

const COMPONENT_ORDER: InspectorComponentKey[] = ['Button', 'Input', 'Card', 'Badge', 'Avatar', 'Select'];

function isColorValue(value: string): boolean {
  if (!value) return false;
  return (
    value.startsWith('#') ||
    value.startsWith('rgb') ||
    value.startsWith('hsl') ||
    value === 'transparent'
  );
}

function TokenRow({ role, token }: { role: string; token: string }) {
  const value = useCssVar(token);
  const showSwatch = isColorValue(value);
  return (
    <tr>
      <td className={styles.tokenNameCell}>{role}</td>
      <td className={styles.tokenVarCell} title={token}>{token}</td>
      <td className={styles.tokenValueCell}>{value || '—'}</td>
      <td className={styles.swatchCell}>
        {showSwatch && (
          <span
            className={styles.swatch}
            style={{ backgroundColor: value }}
            title={value}
          />
        )}
      </td>
    </tr>
  );
}

function ComponentPreview({
  activeComponent,
  styleVars,
}: {
  activeComponent: InspectorComponentKey;
  styleVars: React.CSSProperties;
}) {
  const [selectValue, setSelectValue] = useState<string>('apple');

  return (
    <div data-context="preview" className={styles.previewArea} style={styleVars}>
      {activeComponent === 'Button' && (
        <div className={styles.previewGroup}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
      )}
      {activeComponent === 'Input' && (
        <div className={styles.previewGroup}>
          <Input placeholder="이메일을 입력하세요" />
          <Input placeholder="에러 상태" isError errorMessage="필수 입력값입니다" />
        </div>
      )}
      {activeComponent === 'Card' && (
        <Card padding="md">
          <h4
            style={{
              margin: 0,
              marginBottom: 'var(--ds-spacing-2)',
              fontSize: 'var(--ds-text-lg)',
              fontWeight: 'var(--ds-font-weight-semibold)',
            }}
          >
            Card Title
          </h4>
          <p style={{ margin: 0, fontSize: 'var(--ds-text-sm)' }}>
            {sampleText.pangram.en}
          </p>
        </Card>
      )}
      {activeComponent === 'Badge' && (
        <div className={styles.previewGroup}>
          <Badge variant="subtle">Subtle</Badge>
          <Badge variant="primary">Primary</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="accent">Accent</Badge>
        </div>
      )}
      {activeComponent === 'Avatar' && (
        <div className={styles.previewGroup}>
          <Avatar variant="primary" initials="AB" />
          <Avatar variant="secondary" initials="CD" />
          <Avatar variant="accent" initials="EF" />
        </div>
      )}
      {activeComponent === 'Select' && (
        <div className={styles.previewGroup}>
          <Select
            options={selectShowcase.fruitOptions.map((opt) => ({ ...opt }))}
            value={selectValue}
            onChange={setSelectValue}
            placeholder="선택하세요"
          />
        </div>
      )}
    </div>
  );
}

export function ComponentInspectorPanel() {
  const inspector = useInspector();
  const { theme } = useTheme();
  const [panelLeft, setPanelLeft] = useState<number | null>(null);

  useEffect(() => {
    const updateLeft = () => {
      const anchor = inspector?.tocAnchorRef?.current;
      if (anchor) {
        const rect = anchor.getBoundingClientRect();
        setPanelLeft(rect.right + 8);
      }
    };
    updateLeft();
    window.addEventListener('resize', updateLeft);
    return () => window.removeEventListener('resize', updateLeft);
  }, [inspector]);

  if (!inspector?.isOpen) return null;

  const { activeComponent, setActiveComponent, closeInspector } = inspector;
  const tokens = componentTokenMap[activeComponent];
  const styleVars = getThemeVariables(theme.palette, theme.style);

  return (
    <div
      className={styles.panel}
      role="dialog"
      aria-label="Component Inspector"
      style={panelLeft != null ? { left: panelLeft } : undefined}
    >
      <div className={styles.panelHeader}>
        <p className={styles.panelTitle}>Component Inspector</p>
        <button
          type="button"
          className={styles.closeButton}
          onClick={closeInspector}
          aria-label="닫기"
        >
          ✕
        </button>
      </div>

      <div className={styles.panelBody}>
        {/* 컴포넌트 탭 */}
        <TabBar
          variant="pill"
          tabs={COMPONENT_ORDER.map((key) => ({ id: key, label: key }))}
          activeTab={activeComponent}
          onChange={(id) => setActiveComponent(id as InspectorComponentKey)}
        />

        {/* Preview 섹션 */}
        <section className={styles.inspectorSection}>
          <h3 className={styles.inspectorSectionTitle}>Preview</h3>
          <div className={styles.inspectorSectionContent}>
            <ComponentPreview activeComponent={activeComponent} styleVars={styleVars} />
          </div>
        </section>

        {/* Tokens 섹션 */}
        <section className={styles.inspectorSection}>
          <h3 className={styles.inspectorSectionTitle}>Design tokens</h3>
          <div className={styles.inspectorSectionContent}>
            <table className={styles.tokenTable}>
              <thead>
                <tr>
                  <th>역할</th>
                  <th>토큰</th>
                  <th>값</th>
                  <th aria-label="스와치" />
                </tr>
              </thead>
              <tbody>
                {Object.entries(tokens).map(([role, token]) => (
                  <TokenRow key={role} role={role} token={token} />
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
