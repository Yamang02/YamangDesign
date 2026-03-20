import { Card } from '@app/components';
import { useLayoutPreviewControls } from '@app/context/LayoutPreviewControlsContext';
import { FloatingLayoutControlPanel } from './FloatingLayoutControlPanel';
import styles from './LayoutDashboard.module.css';

export function LayoutDashboard() {
  const { themeVars, fontFamilyValue } = useLayoutPreviewControls();

  return (
    <div style={{ ...themeVars, fontFamily: fontFamilyValue }}>
      <div className={styles.container}>
        <h1 style={{ margin: '0 0 var(--ds-spacing-6) 0' }}>Dashboard</h1>
        <section className={styles.statsGrid}>
          {[
            { label: '총 사용자', value: '12,847' },
            { label: '이번 달 매출', value: '₩24.5M' },
            { label: '전환율', value: '3.2%' },
          ].map((stat) => (
            <Card key={stat.label} variant="elevated" padding="md">
              <Card.Body>
                <div style={{ color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-text-sm)' }}>{stat.label}</div>
                <div style={{ color: 'var(--ds-color-text-primary)', fontSize: 'var(--ds-text-2xl)', fontWeight: 'var(--ds-font-weight-semibold)' }}>{stat.value}</div>
              </Card.Body>
            </Card>
          ))}
        </section>

        <Card variant="outlined" padding="none">
          <Card.Body>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: 'var(--ds-spacing-3)' }}>이름</th>
                  <th style={{ textAlign: 'left', padding: 'var(--ds-spacing-3)' }}>상태</th>
                  <th style={{ textAlign: 'left', padding: 'var(--ds-spacing-3)' }}>날짜</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: '항목 A', status: '완료', date: '2025-03-14' },
                  { name: '항목 B', status: '진행 중', date: '2025-03-13' },
                  { name: '항목 C', status: '대기', date: '2025-03-12' },
                ].map((row) => (
                  <tr key={row.name}>
                    <td style={{ padding: 'var(--ds-spacing-3)' }}>{row.name}</td>
                    <td style={{ padding: 'var(--ds-spacing-3)' }}>{row.status}</td>
                    <td style={{ padding: 'var(--ds-spacing-3)' }}>{row.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card.Body>
        </Card>
      </div>
      <FloatingLayoutControlPanel />
    </div>
  );
}
