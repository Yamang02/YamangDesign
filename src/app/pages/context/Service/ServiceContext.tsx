/**
 * E06 P06: Context — Service
 * E08 P02: 실제 서비스 페이지 목업 (Landing / Dashboard / Article). Component Set 제거.
 * P03: Overview + Token Map 섹션 추가. ShellContext 패턴과 통일.
 */
import { useState } from 'react';
import { Button, Card, Input } from '../../../components';
import { LabSection, PreviewControlPanel } from '../../../layouts';
import {
  getThemeVariables,
  getSystemColorVariables,
  getNeutralPresetVariables,
  comparisonPresets,
} from '@domain/constants';
import { landingHero } from '@app/content/landing-content';
import { fontFamily } from '@domain/tokens/global/typography';
import type { PaletteName, StyleName, SystemPresetName } from '@shared/@types/theme';
import type { NeutralPresetName } from '@domain/tokens/global/neutral-presets';
import styles from './ServiceContext.module.css';

type PageTab = 'landing' | 'dashboard' | 'article';

type FontKey = 'sans' | 'mono';

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/** 서비스 컴포넌트 인벤토리 */
const SERVICE_INVENTORY: { component: string; path: string; tokens: string[] }[] = [
  { component: 'Button', path: 'src/components/Button', tokens: ['--ds-color-primary-500', '--ds-radius-md'] },
  { component: 'Input', path: 'src/components/Input', tokens: ['--ds-color-border-default', '--ds-color-border-focus'] },
  { component: 'Card', path: 'src/components/Card', tokens: ['--ds-color-bg-base', '--ds-shadow-sm'] },
  { component: 'Select', path: 'src/components/Select', tokens: ['--ds-color-bg-surface', '--ds-color-border-default'] },
  { component: 'Badge', path: 'src/components/Badge', tokens: ['--ds-color-primary-100', '--ds-color-text-primary'] },
];

/** 서비스 레이어 토큰 맵 */
const SERVICE_TOKEN_MAP: { area: string; token: string }[] = [
  { area: '페이지 배경', token: '--ds-color-bg-base' },
  { area: '카드·표면', token: '--ds-color-bg-surface' },
  { area: '본문 텍스트', token: '--ds-color-text-primary' },
  { area: '보조 텍스트', token: '--ds-color-text-secondary' },
  { area: '주요 액션 색상', token: '--ds-color-primary-500' },
  { area: '기본 보더', token: '--ds-color-border-default' },
  { area: '포커스 보더', token: '--ds-color-border-focus' },
  { area: '그림자', token: '--ds-shadow-sm' },
];

const paletteOptions = comparisonPresets.palettes.map((p) => ({ value: p, label: capitalize(p) }));
const systemPresetOptions = comparisonPresets.systemPresets.map((s) => ({ value: s, label: capitalize(s) }));
const neutralPresetOptions = comparisonPresets.neutralPresets.map((n) => ({ value: n, label: capitalize(n) }));
const styleOptions = comparisonPresets.styles.map((s) => ({ value: s, label: capitalize(s) }));
const fontOptions = [
  { value: 'sans' as const, label: 'Sans' },
  { value: 'mono' as const, label: 'Mono' },
];

const PAGE_TABS: { id: PageTab; label: string }[] = [
  { id: 'landing', label: 'Landing' },
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'article', label: 'Article' },
];

export function ServiceContext() {
  const [palette, setPalette] = useState<PaletteName>(comparisonPresets.palettes[0]);
  const [systemPreset, setSystemPreset] = useState<SystemPresetName>(
    comparisonPresets.systemPresets[0]
  );
  const [neutralPreset, setNeutralPreset] = useState<NeutralPresetName>(
    comparisonPresets.neutralPresets[0]
  );
  const [style, setStyle] = useState<StyleName>(comparisonPresets.styles[0]);
  const [font, setFont] = useState<FontKey>('sans');
  const [pageTab, setPageTab] = useState<PageTab>('landing');

  const themeVars = {
    ...getThemeVariables(palette, style),
    ...getSystemColorVariables(systemPreset),
    ...getNeutralPresetVariables(neutralPreset),
  };
  const fontFamilyValue = font === 'sans' ? fontFamily.sans : fontFamily.mono;

  return (
    <div className={styles.wrapper}>
      <LabSection title="Overview" id="overview" card>
        <div className={styles.inventoryGrid}>
          {SERVICE_INVENTORY.map((item) => (
            <div key={item.component} className={styles.inventoryCard}>
              <div className={styles.inventoryCardTitle}>{item.component}</div>
              <div className={styles.inventoryCardPath}>{item.path}</div>
              <div className={styles.inventoryCardDivider} />
              <ul className={styles.inventoryCardTokens}>
                {item.tokens.map((t) => (
                  <li key={t} className={styles.tokenTag}>{t}</li>
                ))}
              </ul>
            </div>
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
            {SERVICE_TOKEN_MAP.map((row) => (
              <tr key={row.token}>
                <td>{row.area}</td>
                <td>{row.token}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </LabSection>

      <LabSection title="Controls" id="controls" card>
        <div className={styles.controlsStack}>
          <PreviewControlPanel
            label="Palette (Brand)"
            value={palette}
            options={paletteOptions}
            onChange={(v) => setPalette(v as PaletteName)}
          />
          <PreviewControlPanel
            label="System"
            value={systemPreset}
            options={systemPresetOptions}
            onChange={(v) => setSystemPreset(v as SystemPresetName)}
          />
          <PreviewControlPanel
            label="Neutral"
            value={neutralPreset}
            options={neutralPresetOptions}
            onChange={(v) => setNeutralPreset(v as NeutralPresetName)}
          />
          <PreviewControlPanel
            label="Style"
            value={style}
            options={styleOptions}
            onChange={(v) => setStyle(v as StyleName)}
          />
          <PreviewControlPanel
            label="Font"
            value={font}
            options={fontOptions}
            onChange={(v) => setFont(v as FontKey)}
          />
        </div>
      </LabSection>

      <LabSection title="Page Preview" id="page-preview" card>
        <div className={styles.tabRow}>
          {PAGE_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={styles.tabBtn}
              data-active={pageTab === tab.id}
              onClick={() => setPageTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className={styles.pagePreview}>
          <div
            className={styles.pagePreviewInner}
            data-context="preview"
            style={{ ...themeVars, fontFamily: fontFamilyValue }}
          >
            {pageTab === 'landing' && (
              <>
                <section className={styles.hero}>
                  <h1 className={styles.heroTitle}>{landingHero.title}</h1>
                  <p className={styles.heroSubtitle}>{landingHero.subtitle}</p>
                  <div className={styles.heroButtons}>
                    <Button variant="primary" size="lg">
                      {landingHero.primaryCta}
                    </Button>
                    <Button variant="outline" size="lg">
                      {landingHero.secondaryCta}
                    </Button>
                  </div>
                </section>
                <div className={styles.cardGrid}>
                  {[1, 2, 3].map((i) => (
                    <Card key={i} variant="elevated" hoverable>
                      <Card.Body>
                        <h3 style={{ margin: '0 0 var(--ds-spacing-2) 0', fontSize: 'var(--ds-text-lg)', fontWeight: 'var(--ds-font-weight-semibold)', color: 'var(--ds-color-text-primary)' }}>
                          Feature {i}
                        </h3>
                        <p style={{ margin: 0, fontSize: 'var(--ds-text-sm)', color: 'var(--ds-color-text-secondary)' }}>
                          서비스 UI에 적용된 테마로 렌더됩니다.
                        </p>
                        <div style={{ marginTop: 'var(--ds-spacing-3)' }}>
                          <Button variant="primary" size="sm">자세히</Button>
                        </div>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
                <section className={styles.formSection}>
                  <Card variant="elevated" padding="lg">
                    <Card.Body>
                      <Input label="이름" placeholder="이름을 입력하세요" fullWidth />
                      <div style={{ marginTop: 'var(--ds-spacing-4)' }}>
                        <Input label="이메일" type="email" placeholder="email@example.com" fullWidth />
                      </div>
                      <div style={{ marginTop: 'var(--ds-spacing-4)' }}>
                        <Button variant="primary" fullWidth>문의하기</Button>
                      </div>
                    </Card.Body>
                  </Card>
                </section>
              </>
            )}
            {pageTab === 'dashboard' && (
              <>
                <section className={styles.dashboardSection}>
                  <h2 className={styles.pageHeading}>대시보드</h2>
                  <div className={styles.statsRow}>
                    {[
                      { label: '총 사용자', value: '12,847' },
                      { label: '이번 달 매출', value: '₩24.5M' },
                      { label: '전환율', value: '3.2%' },
                    ].map((stat, i) => (
                      <Card key={i} variant="elevated" padding="md" className={styles.statCard}>
                        <Card.Body>
                          <span style={{ fontSize: 'var(--ds-text-sm)', color: 'var(--ds-color-text-secondary)' }}>{stat.label}</span>
                          <span style={{ fontSize: 'var(--ds-text-2xl)', fontWeight: 'var(--ds-font-weight-semibold)', color: 'var(--ds-color-text-primary)' }}>{stat.value}</span>
                        </Card.Body>
                      </Card>
                    ))}
                  </div>
                  <div className={styles.tableWrap}>
                    <table className={styles.previewTable}>
                      <thead>
                        <tr>
                          <th>이름</th>
                          <th>상태</th>
                          <th>날짜</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { name: '항목 A', status: '완료', date: '2025-03-14' },
                          { name: '항목 B', status: '진행 중', date: '2025-03-13' },
                          { name: '항목 C', status: '대기', date: '2025-03-12' },
                        ].map((row, i) => (
                          <tr key={i}>
                            <td>{row.name}</td>
                            <td>{row.status}</td>
                            <td>{row.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </>
            )}
            {pageTab === 'article' && (
              <article className={styles.articleSection}>
                <h1 className={styles.articleTitle}>아티클 제목 (타이포그래피 목업)</h1>
                <p className={styles.articleMeta} style={{ color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-text-sm)' }}>
                  2025년 3월 14일 · 5분 읽기
                </p>
                <div className={styles.articleBody}>
                  <p>
                    본문 단락. 디자인 시스템의 타이포그래피 토큰이 적용된 콘텐츠 레이아웃입니다.
                    제목, 부제, 본문, 인용, 리스트 등이 일관된 간격과 크기로 배치됩니다.
                  </p>
                  <h2>소제목 (H2)</h2>
                  <p>
                    두 번째 단락. 서비스 페이지의 아티클/블로그 스타일을 미리보기할 수 있습니다.
                  </p>
                  <ul>
                    <li>리스트 항목 1</li>
                    <li>리스트 항목 2</li>
                    <li>리스트 항목 3</li>
                  </ul>
                </div>
              </article>
            )}
            <footer className={styles.previewFooter}>
              © {new Date().getFullYear()} Service Preview · DS 테마 적용
            </footer>
          </div>
        </div>
      </LabSection>
    </div>
  );
}
