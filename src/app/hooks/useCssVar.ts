import { useState, useEffect } from 'react';

/** document.documentElement에서 CSS 변수 값을 500ms 간격으로 읽는다. */
export function useCssVar(name: string): string {
  const [value, setValue] = useState('');

  useEffect(() => {
    const read = () => {
      const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      setValue(v);
    };
    read();
    const id = window.setInterval(read, 500);
    return () => window.clearInterval(id);
  }, [name]);

  return value;
}
