import { useEffect, useRef } from 'react';
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';
import { mulberry32, between } from '../../lib/random';
import './Loader.css';

/* one jagged tear line shared by both halves so they fit together */
const TEAR = (() => {
  const rand = mulberry32(42);
  const pts = [];
  for (let i = 0; i <= 28; i++) pts.push([(i / 28) * 100, between(rand, 46, 55)]);
  return pts;
})();
const topClip = `polygon(0% 0%, 100% 0%, ${[...TEAR].reverse().map(([x, y]) => `${x}% ${y}%`).join(', ')})`;
const bottomClip = `polygon(${TEAR.map(([x, y]) => `${x}% ${y}%`).join(', ')}, 100% 100%, 0% 100%)`;

const SPRAY_TIME = 1.25;

const Loader = ({ onDone }) => {
  const reduce = useReducedMotion();
  const progress = useMotionValue(0);
  const percent = useTransform(progress, (v) => `${Math.round(v)}%`);
  const doneRef = useRef(onDone);

  useEffect(() => {
    doneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    const controls = animate(progress, 100, { duration: reduce ? 0.2 : 1.7, ease: 'easeInOut' });
    const t = setTimeout(() => doneRef.current(), reduce ? 350 : 2150);
    return () => {
      controls.stop();
      clearTimeout(t);
    };
  }, [progress, reduce]);

  const ease = [0.76, 0, 0.24, 1];

  return (
    <motion.div className="loader" role="status" aria-label="Loading" initial="in" animate="in" exit="out">
      <motion.div
        className="loader__half"
        variants={{ out: { y: '-62%', rotate: -3, transition: { duration: 0.95, ease } } }}
      >
        <div className="loader__sheet" style={{ clipPath: topClip }} />
      </motion.div>
      <motion.div
        className="loader__half"
        variants={{ out: { y: '62%', rotate: 2, transition: { duration: 0.95, ease } } }}
      >
        <div className="loader__sheet" style={{ clipPath: bottomClip }} />
      </motion.div>

      <motion.div
        className="loader__content"
        variants={{ out: { opacity: 0, scale: 0.92, transition: { duration: 0.25 } } }}
      >
        <div className="loader__tag" aria-hidden="true">
          <span className="loader__tag-ghost">simar</span>
          <motion.span
            className="loader__tag-paint"
            initial={{ clipPath: 'inset(-20% 100% -40% 0%)' }}
            animate={{ clipPath: 'inset(-20% 0% -40% 0%)' }}
            transition={{ duration: reduce ? 0 : SPRAY_TIME, ease: 'easeInOut', delay: 0.15 }}
          >
            simar
          </motion.span>

          {[22, 48, 71, 88].map((left, i) => (
            <motion.span
              key={left}
              className="loader__drip"
              style={{ left: `${left}%`, '--h': `${[46, 70, 34, 58][i]}px` }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.9, delay: 0.25 + SPRAY_TIME * (left / 100), ease: [0.3, 0, 0.2, 1] }}
            />
          ))}

          <motion.span
            className="loader__can"
            initial={{ left: '0%', rotate: -18 }}
            animate={{ left: '100%', rotate: 8, y: [0, -14, 6, -10, 0] }}
            transition={{ duration: reduce ? 0 : SPRAY_TIME, ease: 'easeInOut', delay: 0.15 }}
          >
            <svg viewBox="0 0 40 80" width="34" height="68">
              <rect x="16" y="1" width="8" height="6" rx="1.5" fill="#15130f" />
              <path d="M10 7h20v7a4 4 0 0 1-4 4H14a4 4 0 0 1-4-4z" fill="#e4412a" />
              <rect x="6" y="17" width="28" height="60" rx="6" fill="#ddd6cb" stroke="#15130f" strokeWidth="2.5" />
              <rect x="7.5" y="30" width="25" height="30" fill="#e4412a" />
              <rect x="11" y="19" width="3" height="56" rx="1.5" fill="#fff" opacity=".55" />
            </svg>
          </motion.span>
        </div>

        <p className="loader__caption">
          shaking the can… <motion.span className="loader__pct">{percent}</motion.span>
        </p>
      </motion.div>
    </motion.div>
  );
};

export default Loader;
