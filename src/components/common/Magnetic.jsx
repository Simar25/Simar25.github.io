import { useState } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';

const FINE = '(hover: hover) and (pointer: fine)';

/* Leans toward the cursor while it hovers, then springs back. */
const Magnetic = ({ children, strength = 0.35 }) => {
  const reduce = useReducedMotion();
  const [fine] = useState(() => window.matchMedia(FINE).matches);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 15, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 15, mass: 0.4 });

  if (!fine || reduce) return <span className="magnetic">{children}</span>;

  const pull = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const release = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span className="magnetic" style={{ x: sx, y: sy }} onPointerMove={pull} onPointerLeave={release}>
      {children}
    </motion.span>
  );
};

export default Magnetic;
