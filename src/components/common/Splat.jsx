import { motion } from 'framer-motion';
import { splatShape } from '../../lib/random';

const cache = new Map();
const getShape = (seed, drips) => {
  const key = `${seed}-${drips}`;
  if (!cache.has(key)) cache.set(key, splatShape(seed, { drips }));
  return cache.get(key);
};

/* A paint splat with drips. Pops in when scrolled into view. */
const Splat = ({ seed = 1, color = 'var(--pink)', drips = 3, opacity = 1, className, style, delay = 0, onMount = false }) => {
  const { blobs, dots, runs } = getShape(seed, drips);
  const show = { scale: 1, opacity, transition: { type: 'spring', stiffness: 260, damping: 16, delay } };
  const trigger = onMount ? { animate: show } : { whileInView: show, viewport: { once: true } };

  return (
    <motion.svg
      className={className}
      style={style}
      viewBox="0 0 200 200"
      aria-hidden="true"
      initial={{ scale: 0.2, opacity: 0 }}
      {...trigger}
    >
      <g fill={color} filter="url(#f-rough)">
        {blobs.map((b, i) => (
          <circle key={`b${i}`} cx={b.cx} cy={b.cy} r={b.r} />
        ))}
        {dots.map((b, i) => (
          <circle key={`d${i}`} cx={b.cx} cy={b.cy} r={b.r} />
        ))}
        {runs.map((r, i) => (
          <g key={`r${i}`}>
            <rect x={r.x - r.w / 2} y={r.y} width={r.w} height={r.h} rx={r.w / 2} />
            <circle cx={r.x} cy={r.y + r.h - r.w * 0.3} r={r.w * 0.78} />
          </g>
        ))}
      </g>
    </motion.svg>
  );
};

export default Splat;
