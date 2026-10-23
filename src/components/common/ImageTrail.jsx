import { Children, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, useAnimate, useAnimationFrame, useReducedMotion } from 'framer-motion';

/*
 * Slaps its children down one after another behind the cursor while it moves over `containerRef`.
 * Adapted from "Image Trail" by Daniel Petho (Fancy Components, MIT) via 21st.dev.
 */

const FINE = '(hover: hover) and (pointer: fine)';
const INTERVAL = 110; // ms between paste-ups
const TILT = 14; // max degrees either way

const PASTE = [
  [{ scale: 1.12, opacity: 1 }, { duration: 0.12, ease: 'circOut' }],
  [{ scale: 1 }, { duration: 0.18, ease: 'easeOut' }],
  [{ scale: 0, opacity: 0 }, { duration: 0.5, ease: 'circIn', delay: 0.5 }],
];

const TrailItem = ({ item, onDone }) => {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    const controls = animate(PASTE.map(([target, transition]) => [scope.current, target, transition]));
    controls.then(() => onDone(item.id));
    return () => controls.stop();
  }, [animate, scope, item, onDone]);

  return (
    <motion.div
      ref={scope}
      className="trail__item"
      initial={{ scale: 0, opacity: 0 }}
      style={{ left: item.x, top: item.y, rotate: item.rotation }}
    >
      <div className="trail__inner">{item.child}</div>
    </motion.div>
  );
};

const ImageTrail = ({ containerRef, children, className = '' }) => {
  const reduce = useReducedMotion();
  const [trail, setTrail] = useState([]);
  const items = useMemo(() => Children.toArray(children), [children]);
  const pointer = useRef(null);
  const last = useRef({ time: 0, x: null, y: null });
  const next = useRef(0);
  const ids = useRef(0);
  const [fine] = useState(() => window.matchMedia(FINE).matches);
  const enabled = fine && !reduce;

  useEffect(() => {
    const el = containerRef.current;
    if (!enabled || !el) return undefined;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      pointer.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const leave = () => {
      pointer.current = null;
    };
    el.addEventListener('pointermove', move, { passive: true });
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    };
  }, [enabled, containerRef]);

  useAnimationFrame((time) => {
    const p = pointer.current;
    if (!p || (p.x === last.current.x && p.y === last.current.y)) return;
    if (time - last.current.time < INTERVAL) return;
    last.current = { time, x: p.x, y: p.y };

    const item = {
      id: ids.current++,
      x: p.x,
      y: p.y,
      rotation: (Math.random() - 0.5) * TILT * 2,
      child: items[next.current],
    };
    next.current = (next.current + 1) % items.length;
    setTrail((t) => [...t, item]);
  });

  const remove = useCallback((id) => setTrail((t) => t.filter((item) => item.id !== id)), []);

  if (!enabled) return null;

  return (
    <div className={`trail ${className}`} aria-hidden="true">
      {trail.map((item) => (
        <TrailItem key={item.id} item={item} onDone={remove} />
      ))}
    </div>
  );
};

export default ImageTrail;
