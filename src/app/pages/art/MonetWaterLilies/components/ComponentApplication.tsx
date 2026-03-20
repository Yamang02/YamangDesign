/**
 * E22 P04: Chapter 3 — The Application
 * 모네 팔레트 + DS 토큰을 실제 컴포넌트에 적용한 섹션
 * TODO: P04에서 구체적인 컴포넌트 구현 예정
 */
import styles from './ComponentApplication.module.css';

export function ComponentApplication() {
  return (
    <section id="chapter-3" className={styles.section}>
      <span className={styles.chapterLabel}>Chapter 3 — The Application</span>
      <p className={styles.placeholder}>
        모네 팔레트 × DS 토큰 컴포넌트 시연 — P04에서 구현 예정
      </p>
    </section>
  );
}
