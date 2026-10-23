import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import './Cursor.css';

const FINE = '(hover: hover) and (pointer: fine)';
const LABELS = { drag: 'drag me', spray: 'spray!', open: 'open ↗', paste: 'paste up' };

/* Marker-cap cursor: a dot that tracks exactly, and a ring that trails it. */
const Cursor = () => {
  const [enabled] = useState(() => window.matchMedia(FINE).matches);
  const [mode, setMode] = useState(null);
  const [visible, setVisible] = useState(false);
  const [down, setDown] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 520, damping: 38, mass: 0.6 });
  const ry = useSpring(y, { stiffness: 520, damping: 38, mass: 0.6 });

  useEffect(() => {
    if (!enabled) return undefined;
    document.body.classList.add('has-cursor');

    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };
    const over = (e) => {
      const el = e.target.closest?.('[data-cursor], a, button, input, textarea, label');
      if (!el) return setMode(null);
      if (el.dataset.cursor) return setMode(el.dataset.cursor);
      if (el.matches('input, textarea')) return setMode('text');
      return setMode('link');
    };
    const leave = () => setVisible(false);
    const press = () => setDown(true);
    const release = () => setDown(false);

    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerover', over, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    window.addEventListener('pointerdown', press);
    window.addEventListener('pointerup', release);
    return () => {
      document.body.classList.remove('has-cursor');
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerover', over);
      document.documentElement.removeEventListener('pointerleave', leave);
      window.removeEventListener('pointerdown', press);
      window.removeEventListener('pointerup', release);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const label = LABELS[mode];
  const big = mode && mode !== 'text';

  return (
    <div className={`cursor${visible ? ' is-visible' : ''}`} aria-hidden="true">
      <motion.div className="cursor__ring" style={{ x: rx, y: ry }}>
        <motion.div
          className={`cursor__ring-inner cursor__ring-inner--${mode ?? 'none'}`}
          animate={{ scale: down ? 0.75 : big ? (label ? 2.2 : 1.6) : mode === 'text' ? 0.5 : 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 24 }}
        />
        <AnimatePresence mode="wait">
          {label && (
            <motion.span
              key={label}
              className="cursor__label"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.15 }}
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
      <motion.div className="cursor__dot" style={{ x, y }} />
    </div>
  );
};

export default Cursor;
