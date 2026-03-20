/**
 * E22: Art Reference Gallery 공통 shell 레이아웃
 * 좌측 sticky 사이드바 (챕터 네비게이션 전용) + 우측 메인 스크롤 영역
 */
import { useState, useEffect, useRef, type ReactNode } from 'react';
import styles from './ArtShell.module.css';

export interface ArtChapter {
  id: string;
  number: string;   // "Ch.1"
  title: string;    // "The Painting"
}

interface ArtShellProps {
  chapters: ArtChapter[];
  children: ReactNode;
}

export function ArtShell({ chapters, children }: ArtShellProps) {
  const [activeId, setActiveId] = useState(chapters[0]?.id ?? '');
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
    );

    const obs = observerRef.current;
    chapters.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });

    return () => obs.disconnect();
  }, [chapters]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <ul className={styles.chapterList}>
          {chapters.map((ch) => (
            <li key={ch.id}>
              <button
                className={`${styles.chapterItem} ${activeId === ch.id ? styles.active : ''}`}
                onClick={() => scrollTo(ch.id)}
              >
                <span className={styles.dot} />
                <span className={styles.chapterLabel}>
                  {ch.number}<br />{ch.title}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
}
