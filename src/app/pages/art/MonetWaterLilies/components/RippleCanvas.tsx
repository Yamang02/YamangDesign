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
  const lastMouseRippleAtRef = useRef<number>(0);
  const lastMouseRipplePosRef = useRef<{ x: number; y: number } | null>(null);
  const randomRippleTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pushRippleAt = (x: number, y: number, opts: { alpha: number; maxRadius: number }) => {
      const color = RIPPLE_COLORS[Math.floor(Math.random() * RIPPLE_COLORS.length)];
      ripplesRef.current.push({
        x,
        y,
        radius: 0,
        maxRadius: opts.maxRadius,
        alpha: opts.alpha,
        color,
      });
    };

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    globalThis.addEventListener('resize', resize);

    const addRipple = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // 마우스 이동 파문 빈도를 "조금" 줄이기 위한 스로틀링:
      // - 너무 자주 찍히는 연속 이벤트는 무시
      // - 아주 미세한 이동에서는 무시
      const now = performance.now();
      const MIN_MOUSE_RIPPLE_INTERVAL_MS = 90;
      const MIN_MOUSE_RIPPLE_DIST_PX = 10;

      if (now - lastMouseRippleAtRef.current < MIN_MOUSE_RIPPLE_INTERVAL_MS) return;

      const lastPos = lastMouseRipplePosRef.current;
      if (lastPos) {
        const dx = x - lastPos.x;
        const dy = y - lastPos.y;
        if (dx * dx + dy * dy < MIN_MOUSE_RIPPLE_DIST_PX * MIN_MOUSE_RIPPLE_DIST_PX) return;
      }

      pushRippleAt(x, y, {
        alpha: 0.5,
        maxRadius: 80 + Math.random() * 60,
      });

      lastMouseRippleAtRef.current = now;
      lastMouseRipplePosRef.current = { x, y };
    };

    canvas.addEventListener('mousemove', addRipple);

    // 아주 간헐적으로 랜덤 지점에 파문 생성
    const scheduleRandomRipple = () => {
      // "아주 간헐적"보다는 조금 더 자주 보이도록 간격을 축소
      const delay = 2800 + Math.random() * 3800; // 2.8s ~ 6.6s
      randomRippleTimeoutRef.current = globalThis.setTimeout(() => {
        // canvas 좌표계 기준
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        pushRippleAt(x, y, {
          alpha: 0.28 + Math.random() * 0.12,
          maxRadius: 55 + Math.random() * 45,
        });
        scheduleRandomRipple();
      }, delay);
    };

    scheduleRandomRipple();

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
      if (randomRippleTimeoutRef.current) {
        globalThis.clearTimeout(randomRippleTimeoutRef.current);
      }
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} />;
}
