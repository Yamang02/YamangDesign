import { AdminFilterBarBase } from '../AdminFilterBarBase';
import styles from './AdminTableTemplate.module.css';
import type { AdminTableTemplateProps } from './AdminTableTemplate.types';

export function AdminTableTemplate<TItem>({
  title = 'Admin Table',
  searchSlot,
  filterSlot,
  actionSlot,
  onRefresh,
  onReset,
  columns,
  items,
  getRowKey,
}: Readonly<AdminTableTemplateProps<TItem>>) {
  return (
    <section className={styles.wrapper}>
      <div className={styles.title}>{title}</div>
      <AdminFilterBarBase
        searchSlot={searchSlot}
        filterSlot={filterSlot}
        actionSlot={actionSlot}
        onRefresh={onRefresh}
        onReset={onReset}
      />
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={getRowKey(item)}>
              {columns.map((column) => (
                <td key={column.key}>{column.render(item)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
