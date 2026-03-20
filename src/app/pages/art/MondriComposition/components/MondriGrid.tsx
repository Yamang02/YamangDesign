import { useState, useCallback } from 'react';
import styles from './MondriGrid.module.css';

const COLS = 16;
const ROWS = 10;
const TOTAL = COLS * ROWS;

const COLOR_POOL = ['#7A9BBF', '#C47A6A', '#D4C06A', '#B0ADA8'];

function nextColor(index: number): string {
  return COLOR_POOL[index % COLOR_POOL.length];
}

export function MondriGrid() {
  const [cells, setCells] = useState<(string | null)[]>(Array(TOTAL).fill(null));
  const [colorIndex, setColorIndex] = useState(0);

  const handleEnter = useCallback((i: number) => {
    if (Math.random() > 0.25) return; // 25% 확률만 색 채움
    setCells(prev => {
      if (prev[i] !== null) return prev;
      const next = [...prev];
      next[i] = nextColor(colorIndex);
      return next;
    });
    setColorIndex(prev => (prev + 1) % COLOR_POOL.length);
  }, [colorIndex]);

  const handleReset = () => {
    setCells(Array(TOTAL).fill(null));
    setColorIndex(0);
  };

  return (
    <>
      <div className={styles.grid} aria-hidden>
        {cells.map((color, i) => (
          <div
            key={i}
            className={styles.cell}
            style={color ? { backgroundColor: color } : undefined}
            onMouseEnter={() => handleEnter(i)}
          />
        ))}
      </div>
      <button className={styles.resetBtn} onClick={handleReset} aria-label="격자 초기화">
        Reset
      </button>
    </>
  );
}
