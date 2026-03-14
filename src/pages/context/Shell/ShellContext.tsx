/**
 * E06 P06: Context — Shell
 * E08 P04: Overview = 실제 Shell 구성 컴포넌트 인벤토리 카드.
 * 앱 크롬(Header/Navigation/Footer)을 디자인 아티팩트로 시각화.
 */
import { useState, useCallback } from 'react';
import { Header, HeaderNav, Footer } from '../../../components';
import { LabSection } from '../../../layouts';
import styles from './ShellContext.module.css';

/** E08 P04: Shell 컴포넌트별 담당 토큰 */
const SHELL_INVENTORY: { component: string; path: string; tokens: string[] }[] = [
  { component: 'Header', path: 'src/components/Header', tokens: ['--shell-bg-base', '--shell-text-primary'] },
  { component: 'HeaderNav', path: 'src/components/Header/HeaderNav', tokens: ['--shell-bg-hover', '--shell-text-hover', '--shell-border-focus'] },
  { component: 'Navigation', path: 'src/components/Navigation', tokens: ['--shell-bg-hover', '--shell-action-primary'] },
  { component: 'NavDropdown', path: 'src/components/Header/HeaderNavDropdown', tokens: ['--shell-bg-surface', '--shell-border-subtle'] },
  { component: 'Footer', path: 'src/components/Footer', tokens: ['--shell-bg-subtle', '--shell-text-secondary'] },
];

const SHELL_TOKEN_MAP: { area: string; token: string }[] = [
  { area: 'Header 배경', token: '--shell-bg-base' },
  { area: 'Header 텍스트', token: '--shell-text-primary' },
  { area: 'Nav 호버 배경', token: '--shell-bg-hover' },
  { area: 'Nav 호버 텍스트', token: '--shell-text-hover' },
  { area: 'Nav 활성 테두리', token: '--shell-border-focus' },
  { area: 'ComparisonCard 선택', token: '--shell-action-primary (border)' },
  { area: '버튼 배경', token: '--shell-action-primary' },
  { area: '포커스 링', token: '--shell-focus-ring' },
];

export function ShellContext() {
  const [previewPage, setPreviewPage] = useState<string>('shell');

  const scrollToLivePreview = useCallback(() => {
    document.getElementById('live-preview')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className={styles.wrapper}>
      <LabSection title="Overview" id="overview" card>
        <p style={{ margin: '0 0 var(--ds-spacing-4) 0', color: 'var(--shell-text-secondary)', fontSize: 'var(--ds-text-sm)' }}>
          Shell을 구성하는 컴포넌트와 담당 토큰. 카드 클릭 시 Live Preview로 스크롤.
        </p>
        <div className={styles.inventoryGrid}>
          {SHELL_INVENTORY.map((item) => (
            <button
              key={item.component}
              type="button"
              className={styles.inventoryCard}
              onClick={scrollToLivePreview}
            >
              <div className={styles.inventoryCardTitle}>{item.component}</div>
              <div className={styles.inventoryCardPath}>{item.path}</div>
              <div className={styles.inventoryCardDivider} />
              <ul className={styles.inventoryCardTokens}>
                {item.tokens.map((t) => (
                  <li key={t} className={styles.tokenTag}>{t}</li>
                ))}
              </ul>
            </button>
          ))}
        </div>
      </LabSection>

      <LabSection title="Token Map" id="token-map" card>
        <table className={styles.tokenMapTable}>
          <thead>
            <tr>
              <th>영역</th>
              <th>토큰</th>
            </tr>
          </thead>
          <tbody>
            {SHELL_TOKEN_MAP.map((row) => (
              <tr key={row.token}>
                <td>{row.area}</td>
                <td>{row.token}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </LabSection>

      <LabSection title="Live Preview" id="live-preview" card>
        <p style={{ margin: '0 0 var(--ds-spacing-4) 0', color: 'var(--shell-text-secondary)', fontSize: 'var(--ds-text-sm)' }}>
          실제 Header + Nav + Footer를 축소 프레임에 렌더. [data-shell] 컨텍스트 적용.
        </p>
        <div className={styles.livePreviewFrame}>
          <div className={styles.livePreviewScale}>
            <div className={styles.livePreviewInner} data-shell>
              <Header onLogoClick={() => {}}>
                <HeaderNav activePage={previewPage} onSelect={setPreviewPage} />
              </Header>
              <div style={{ flex: 1, minHeight: 120, background: 'var(--shell-bg-surface)' }} />
              <Footer />
            </div>
          </div>
          <div className={styles.livePreviewCaption}>
            Live Preview — 실제 &lt;Header&gt;, &lt;HeaderNav&gt;, &lt;Footer&gt; 컴포넌트
          </div>
        </div>
      </LabSection>
    </div>
  );
}
