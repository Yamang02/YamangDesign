/**
 * E06 P06: Context — Service
 * E08 P02: 실제 서비스 페이지 목업 (Landing / Dashboard / Article). Component Set 제거.
 */
import { useState } from 'react';
import { Button, Card, Input, Select } from '../../../components';
import { LabSection } from '../../../layouts';
import {
  getThemeVariables,
  getSystemColorVariables,
  getNeutralPresetVariables,
  comparisonPresets,
} from '../../../constants';
import { landingHero } from '../../../constants/landing-content';
import { fontFamily } from '../../../tokens/global/typography';
import type { PaletteName, StyleName, SystemPresetName } from '../../../@types/theme';
import type { NeutralPresetName } from '../../../tokens/global/neutral-presets';
import styles from './ServiceContext.module.css';

type PageTab = 'landing' | 'dashboard' | 'article';

type FontKey = 'sans' | 'mono';

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const paletteOptions = comparisonPresets.palettes.map((p) => ({
  value: p,
  label: capitalize(p),
}));
const systemPresetOptions = comparisonPresets.systemPresets.map((s) => ({
  value: s,
  label: capitalize(s),
}));
const neutralPresetOptions = comparisonPresets.neutralPresets.map((n) => ({
  value: n,
  label: capitalize(n),
}));
const styleOptions = comparisonPresets.styles.map((s) => ({
  value: s,
  label: capitalize(s),
}));
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
      <LabSection title="Controls" id="controls" card>
        <div className={styles.selectRow}>
          <Select
            label="Palette (Brand)"
            options={paletteOptions}
            value={palette}
            onChange={(v) => setPalette(v as PaletteName)}
            placeholder="Palette 선택"
          />
          <Select
            label="System"
            options={systemPresetOptions}
            value={systemPreset}
            onChange={(v) => setSystemPreset(v as SystemPresetName)}
            placeholder="System 선택"
          />
          <Select
            label="Neutral"
            options={neutralPresetOptions}
            value={neutralPreset}
            onChange={(v) => setNeutralPreset(v as NeutralPresetName)}
            placeholder="Neutral 선택"
          />
          <Select
            label="Style"
            options={styleOptions}
            value={style}
            onChange={(v) => setStyle(v as StyleName)}
            placeholder="Style 선택"
          />
          <Select
            label="Font"
            options={fontOptions}
            value={font}
            onChange={(v) => setFont(v as FontKey)}
            placeholder="Font 선택"
          />
        </div>
      </LabSection>

      <LabSection title="Page Preview" id="page-preview" card>
        <p style={{ margin: '0 0 var(--ds-spacing-4) 0', color: 'var(--shell-text-secondary)', fontSize: 'var(--ds-text-sm)' }}>
          Landing / Dashboard / Article 목업. data-context=&quot;preview&quot; + 선택된 테마 적용.
        </p>
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
