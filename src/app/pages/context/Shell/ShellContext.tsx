/**
 * E06 P06: Context — Shell
 * E08 P04: Overview = 실제 Shell 구성 컴포넌트 인벤토리 카드.
 * 앱 크롬(Header/Navigation/Footer)을 디자인 아티팩트로 시각화.
 * P03: 인벤토리 데이터를 shell-components.ts로 분리.
 */
import { useState, useCallback } from 'react';
import { Header, HeaderNav, Footer } from '../../../components';
import { LabSection } from '../../../layouts';
import { SHELL_INVENTORY, SHELL_TOKEN_MAP } from '@app/content/context/shell-components';
import styles from './ShellContext.module.css';

export function ShellContext() {
  const [previewPage, setPreviewPage] = useState<string>('shell');

  const scrollToLivePreview = useCallback(() => {
    document.getElementById('live-preview')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className={styles.wrapper}>
      <LabSection title="Overview" id="overview" card>
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
