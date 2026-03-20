import { useEffect, useRef } from 'react';
import styles from './RippleCanvas.module.css';

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
}

const RIPPLE_COLORS = ['91,143,168', '61,122,110', '155,139,180'];

export function RippleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ripplesRef = useRef<Ripple[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const addRipple = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const color = RIPPLE_COLORS[Math.floor(Math.random() * RIPPLE_COLORS.length)];
      ripplesRef.current.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        radius: 0,
        maxRadius: 80 + Math.random() * 60,
        alpha: 0.5,
        color,
      });
    };

    canvas.addEventListener('mousemove', addRipple);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ripplesRef.current = ripplesRef.current.filter((r) => r.alpha > 0.01);
      for (const r of ripplesRef.current) {
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${r.color}, ${r.alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        r.radius += 1.2;
        r.alpha *= 0.97;
      }
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', addRipple);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden />;
}
