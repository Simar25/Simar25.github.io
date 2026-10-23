import { createContext, useContext, useEffect, useMemo, useRef } from 'react';
import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';

/*
 * Letters that swell and pick up colour as the cursor comes near.
 * Adapted from "Text Cursor Proximity" by Daniel Petho (Fancy Components, MIT) via 21st.dev:
 * one shared loop measures every registered letter, and only when the pointer or page has moved.
 */

const FINE = '(hover: hover) and (pointer: fine)';

const FieldContext = createContext(null);

export const ProximityField = ({ radius = 100, scale = 1.35, from, to, children }) => {
  const reduce = useReducedMotion();
  const letters = useRef(new Map());
  const pointer = useRef({ x: -1e4, y: -1e4 });
  const dirty = useRef(false);
  const enabled = useRef(false);

  useEffect(() => {
    enabled.current = !reduce && window.matchMedia(FINE).matches;
    if (!enabled.current) return undefined;
    const move = (e) => {
      pointer.current = { x: e.clientX, y: e.clientY };
      dirty.current = true;
    };
    const scroll = () => {
      dirty.current = true;
    };
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('scroll', scroll, { passive: true });
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('scroll', scroll);
    };
  }, [reduce]);

  useAnimationFrame(() => {
    if (!enabled.current || !dirty.current) return;
    dirty.current = false;
    const { x, y } = pointer.current;
    letters.current.forEach((value, el) => {
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) {
        if (value.get() !== 0) value.set(0);
        return;
      }
      const d = Math.hypot(x - (r.left + r.width / 2), y - (r.top + r.height / 2));
      value.set(Math.exp(-((d / (radius / 2)) ** 2) / 2)); // gaussian falloff
    });
  });

  const field = useMemo(
    () => ({
      scale,
      from,
      to,
      register: (el, value) => {
        letters.current.set(el, value);
        return () => letters.current.delete(el);
      },
    }),
    [scale, from, to],
  );

  return <FieldContext.Provider value={field}>{children}</FieldContext.Provider>;
};

export const ProximityLetter = ({ children }) => {
  const field = useContext(FieldContext);
  const ref = useRef(null);
  const proximity = useMotionValue(0);
  const scale = useTransform(proximity, [0, 1], [1, field.scale]);
  const color = useTransform(proximity, [0, 1], [field.from, field.to]);

  useEffect(() => field.register(ref.current, proximity), [field, proximity]);

  return (
    <motion.span ref={ref} className="proximity-letter" style={{ scale, color }}>
      {children}
    </motion.span>
  );
};
