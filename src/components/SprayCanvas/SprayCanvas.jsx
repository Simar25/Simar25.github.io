import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react';
import './SprayCanvas.css';

const TAU = Math.PI * 2;

const hexToRgb = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

/* One puff from the can: a soft mist + a spatter of particles. */
function puff(ctx, x, y, rgb, radius, density) {
  const [r, g, b] = rgb;
  const mist = ctx.createRadialGradient(x, y, 0, x, y, radius);
  mist.addColorStop(0, `rgba(${r},${g},${b},0.16)`);
  mist.addColorStop(0.6, `rgba(${r},${g},${b},0.05)`);
  mist.addColorStop(1, `rgba(${r},${g},${b},0)`);
  ctx.fillStyle = mist;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, TAU);
  ctx.fill();

  ctx.fillStyle = `rgb(${r},${g},${b})`;
  for (let i = 0; i < density; i++) {
    const a = Math.random() * TAU;
    // Rayleigh-ish distribution: dense core, sparse overspray
    const d = radius * 0.42 * Math.sqrt(-2 * Math.log(Math.random() + 1e-6));
    if (d > radius * 1.25) continue;
    const s = Math.random() * 1.4 + 0.35;
    ctx.globalAlpha = Math.random() * 0.55 + 0.3;
    ctx.fillRect(x + Math.cos(a) * d, y + Math.sin(a) * d, s, s);
  }
  ctx.globalAlpha = 1;
}

/**
 * A wall you can spray-paint. Hold still and the paint pools and drips.
 * Exposes `clear()` and `save()` through the ref.
 */
const SprayCanvas = forwardRef(function SprayCanvas({ color, enabled, onSpray }, ref) {
  const canvasRef = useRef(null);
  const colorRef = useRef(hexToRgb(color));
  const onSprayRef = useRef(onSpray);
  const s = useRef({
    drawing: false,
    x: 0,
    y: 0,
    lastX: 0,
    lastY: 0,
    still: 0,
    rect: null,
    drips: [],
    raf: 0,
    last: 0,
    w: 0,
    h: 0,
  });

  useEffect(() => {
    colorRef.current = hexToRgb(color);
  }, [color]);

  useEffect(() => {
    onSprayRef.current = onSpray;
  }, [onSpray]);

  /* keep the bitmap sized to the wall, without losing the paint */
  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas.parentElement;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      const { width, height } = parent.getBoundingClientRect();
      const w = Math.round(width);
      const h = Math.round(height);
      if (w === s.current.w && h === s.current.h) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      let snapshot = null;
      if (canvas.width && canvas.height) {
        snapshot = document.createElement('canvas');
        snapshot.width = canvas.width;
        snapshot.height = canvas.height;
        snapshot.getContext('2d').drawImage(canvas, 0, 0);
      }

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (snapshot && s.current.w) ctx.drawImage(snapshot, 0, 0, s.current.w, s.current.h);
      s.current.w = w;
      s.current.h = h;
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(parent);
    return () => ro.disconnect();
  }, []);

  /* drawing loop: keeps spraying while held, and runs the drips */
  const loop = useCallback((now) => {
    const st = s.current;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const dt = Math.min(0.05, (now - (st.last || now)) / 1000);
    st.last = now;
    const rgb = colorRef.current;

    if (st.drawing) {
      const moved = Math.hypot(st.x - st.lastX, st.y - st.lastY);
      if (moved < 1.5) {
        st.still += dt;
        puff(ctx, st.x, st.y, rgb, 22, 40);
        // paint pools when you linger → it starts to run
        if (st.still > 0.32 && Math.random() < dt * 5) {
          st.drips.push({
            x: st.x + (Math.random() - 0.5) * 18,
            y: st.y + 6 + Math.random() * 6,
            len: 0,
            max: 40 + Math.random() * 120,
            v: 55 + Math.random() * 55,
            w: 2.2 + Math.random() * 2.6,
            rgb,
          });
          st.still = 0.15;
        }
      } else {
        st.still = Math.max(0, st.still - dt * 2);
      }
      st.lastX = st.x;
      st.lastY = st.y;
    }

    st.drips = st.drips.filter((d) => {
      const step = d.v * dt;
      ctx.strokeStyle = `rgb(${d.rgb.join(',')})`;
      ctx.lineCap = 'round';
      ctx.lineWidth = d.w;
      ctx.beginPath();
      ctx.moveTo(d.x, d.y + d.len);
      ctx.lineTo(d.x, d.y + d.len + step);
      ctx.stroke();
      d.len += step;
      d.v *= 0.985;
      d.w *= 0.998;
      if (d.len >= d.max || d.v < 8) {
        ctx.fillStyle = ctx.strokeStyle;
        ctx.beginPath();
        ctx.arc(d.x, d.y + d.len, d.w * 0.95, 0, TAU);
        ctx.fill();
        return false;
      }
      return true;
    });

    if (st.drawing || st.drips.length) {
      st.raf = requestAnimationFrame(loop);
    } else {
      st.raf = 0;
      st.last = 0;
    }
  }, []);

  const kick = useCallback(() => {
    if (!s.current.raf) s.current.raf = requestAnimationFrame(loop);
  }, [loop]);

  useEffect(() => {
    const st = s.current;
    return () => cancelAnimationFrame(st.raf);
  }, []);

  const point = (e) => {
    const r = s.current.rect;
    return [e.clientX - r.left, e.clientY - r.top];
  };

  const handleDown = (e) => {
    if (!enabled || e.button > 0) return;
    const st = s.current;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    st.rect = e.currentTarget.getBoundingClientRect();
    const [x, y] = point(e);
    Object.assign(st, { drawing: true, x, y, lastX: x, lastY: y, still: 0 });
    puff(canvasRef.current.getContext('2d'), x, y, colorRef.current, 22, 60);
    onSprayRef.current?.();
    kick();
  };

  const handleMove = (e) => {
    const st = s.current;
    if (!st.drawing) return;
    const ctx = canvasRef.current.getContext('2d');
    const [x, y] = point(e);
    const dist = Math.hypot(x - st.x, y - st.y);
    // faster strokes spread wider and thinner, like a real can
    const radius = Math.min(34, 18 + dist * 0.35);
    const steps = Math.max(1, Math.ceil(dist / 4));
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      puff(ctx, st.x + (x - st.x) * t, st.y + (y - st.y) * t, colorRef.current, radius, 26);
    }
    st.x = x;
    st.y = y;
  };

  const handleUp = () => {
    s.current.drawing = false;
  };

  useImperativeHandle(ref, () => ({
    clear() {
      const canvas = canvasRef.current;
      s.current.drips = [];
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    },
    save() {
      const canvas = canvasRef.current;
      const out = document.createElement('canvas');
      out.width = canvas.width;
      out.height = canvas.height;
      const ctx = out.getContext('2d');
      ctx.fillStyle = '#f4efe6';
      ctx.fillRect(0, 0, out.width, out.height);
      ctx.drawImage(canvas, 0, 0);
      const link = document.createElement('a');
      link.download = 'my-tag-on-simars-wall.png';
      link.href = out.toDataURL('image/png');
      link.click();
    },
  }));

  return (
    <canvas
      ref={canvasRef}
      className={`spray-canvas${enabled ? ' is-on' : ''}`}
      data-cursor={enabled ? 'spray' : undefined}
      onPointerDown={handleDown}
      onPointerMove={handleMove}
      onPointerUp={handleUp}
      onPointerCancel={handleUp}
      onLostPointerCapture={handleUp}
      aria-hidden="true"
    />
  );
});

export default SprayCanvas;
