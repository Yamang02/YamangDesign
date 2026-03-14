/**
 * E06 P06: Context — Shell
 * 앱 크롬(Header/Navigation/Footer)을 디자인 아티팩트로 시각화.
 * Overview + Token Map + Live Preview.
 */
import { useState } from 'react';
import { Header, HeaderNav, Footer } from '../../../components';
import { LabSection } from '../../../layouts';
import styles from './ShellContext.module.css';

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

  return (
    <div className={styles.wrapper}>
      <LabSection title="Overview" id="overview" card>
        <p style={{ margin: '0 0 var(--ds-spacing-4) 0', color: 'var(--shell-text-secondary)', fontSize: 'var(--ds-text-sm)' }}>
          크롬 구조와 영역별 --shell-* 토큰 매핑
        </p>
        <div className={styles.diagram}>
          <div className={styles.diagramRow}>
            <div className={styles.diagramLabel}>Header</div>
            <div className={`${styles.diagramBlock} ${styles.diagramBlockHeader}`}>
              <span>로고 + 네비게이션</span>
              <span className={styles.tokenTag}>--shell-bg-base</span>
              <span className={styles.tokenTag}>--shell-text-primary</span>
            </div>
          </div>
          <div className={styles.diagramRow}>
            <div className={styles.diagramLabel}>Navigation (호버/활성)</div>
            <div className={`${styles.diagramBlock} ${styles.diagramBlockNav}`}>
              <span>드롭다운, 포커스</span>
              <span className={styles.tokenTag}>--shell-bg-hover</span>
              <span className={styles.tokenTag}>--shell-text-hover</span>
              <span className={styles.tokenTag}>--shell-border-focus</span>
            </div>
          </div>
          <div className={styles.diagramRow}>
            <div className={styles.diagramLabel}>Footer</div>
            <div className={`${styles.diagramBlock} ${styles.diagramBlockFooter}`}>
              <span>저작권, 링크</span>
              <span className={styles.tokenTag}>--shell-bg-subtle</span>
              <span className={styles.tokenTag}>--shell-text-secondary</span>
            </div>
          </div>
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
