import { useState } from 'react';
import {
  AdminHeaderBar,
  AdminModalTemplate,
  AdminShellLayout,
  AdminSidebarNav,
  AdminTableTemplate,
  AdminTopBarActions,
} from '@app/components';
import { LabSection } from '../../../layouts';
import { Button, Input, Select } from '@app/components';
import type { AdminSidebarNavItem, AdminTableColumn } from '@app/components';
import styles from './AdminShellContext.module.css';

const SIDEBAR_ITEMS: readonly AdminSidebarNavItem[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'users', label: 'Users' },
  { id: 'workspaces', label: 'Workspaces' },
  { id: 'subscriptions', label: 'Subscriptions' },
] as const;

interface DemoUserRow {
  id: string;
  name: string;
  email: string;
  status: string;
}

const DEMO_ROWS: readonly DemoUserRow[] = [
  { id: 'u-001', name: 'Yamang Admin', email: 'admin@yamang.design', status: '활성' },
  { id: 'u-002', name: 'Recon Operator', email: 'ops@yamang.design', status: '활성' },
  { id: 'u-003', name: 'Reviewer', email: 'review@yamang.design', status: '대기' },
] as const;

const DEMO_COLUMNS: readonly AdminTableColumn<DemoUserRow>[] = [
  { key: 'name', header: '이름', render: (row) => row.name },
  { key: 'email', header: '이메일', render: (row) => row.email },
  { key: 'status', header: '상태', render: (row) => row.status },
] as const;

export function AdminShellContext() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItemId, setActiveItemId] = useState<string>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className={styles.wrapper}>
      <LabSection title="Overview" id="overview" card>
        <ul className={styles.summaryList}>
          <li>`AdminShellLayout`로 사이드바/헤더/콘텐츠 슬롯 구조를 고정한다.</li>
          <li>`AdminSidebarNav`는 `AdminSidebarItem` 조합으로 접힘/활성 상태를 표현한다.</li>
          <li>`AdminHeaderBar`와 `AdminTopBarActions`로 헤더 우측 액션 영역을 구성한다.</li>
          <li>검색/필터 베이스는 `AdminFilterBarBase`로 분리해 P04에서 재사용한다.</li>
        </ul>
      </LabSection>

      <LabSection title="Layout Demo" id="layout-demo" card>
        <div className={styles.previewFrame}>
          <AdminShellLayout
            sidebar={(
              <AdminSidebarNav
                items={SIDEBAR_ITEMS}
                activeItemId={activeItemId}
                isCollapsed={isCollapsed}
                onSelectItem={setActiveItemId}
              />
            )}
            header={(
              <AdminHeaderBar
                isSidebarCollapsed={isCollapsed}
                onToggleSidebar={() => setIsCollapsed((prev) => !prev)}
                title="Admin Shell Demo"
                actions={(
                  <AdminTopBarActions
                    userDisplayName="Yamang Admin"
                    userEmail="admin@yamang.design"
                    roleLabel="운영자"
                    environmentLabel="DEV"
                    avatarInitials="YA"
                  />
                )}
              />
            )}
          >
            <div className={styles.placeholder}>
              <AdminTableTemplate
                title="User Table Demo"
                searchSlot={<Input placeholder="이메일 검색" />}
                filterSlot={(
                  <Select
                    value="all"
                    onChange={() => {}}
                    options={[
                      { value: 'all', label: '전체 상태' },
                      { value: 'active', label: '활성' },
                      { value: 'pending', label: '대기' },
                    ]}
                  />
                )}
                actionSlot={(
                  <Button size="sm" onClick={() => setIsModalOpen(true)}>
                    사용자 추가
                  </Button>
                )}
                onRefresh={() => {}}
                onReset={() => {}}
                columns={DEMO_COLUMNS}
                items={DEMO_ROWS}
                getRowKey={(row) => row.id}
              />
            </div>
          </AdminShellLayout>
        </div>
        <AdminModalTemplate
          isOpen={isModalOpen}
          title="사용자 추가 (Demo)"
          onCancel={() => setIsModalOpen(false)}
          onConfirm={() => setIsModalOpen(false)}
        >
          P04에서 실제 폼/검증/제출 로직을 연결한다.
        </AdminModalTemplate>
      </LabSection>
    </div>
  );
}
