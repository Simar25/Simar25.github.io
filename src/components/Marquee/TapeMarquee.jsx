import { useRef } from 'react';
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion';
import './TapeMarquee.css';

const wrap = (min, max, v) => {
  const r = max - min;
  return ((((v - min) % r) + r) % r) + min;
};

/* A strip of tape whose text runs faster (and flips direction) as you scroll. */
const Tape = ({ items, baseVelocity, className }) => {
  const reduce = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [0, 1000], [0, 4], { clamp: false });
  const x = useTransform(baseX, (v) => `${wrap(-50, -25, v)}%`);
  const direction = useRef(1);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    let moveBy = direction.current * baseVelocity * (delta / 1000);
    const f = factor.get();
    if (f < 0) direction.current = -1;
    else if (f > 0) direction.current = 1;
    moveBy += direction.current * moveBy * f;
    baseX.set(baseX.get() + moveBy);
  });

  const run = (
    <span className="tape-run__chunk">
      {items.map((item) => (
        <span key={item} className="tape-run__item">
          {item}
          <span className="tape-run__sep">✶</span>
        </span>
      ))}
    </span>
  );

  return (
    <div className={`tape-run ${className}`}>
      <motion.div className="tape-run__track" style={{ x }}>
        {run}
        {run}
        {run}
        {run}
      </motion.div>
    </div>
  );
};

const TapeMarquee = () => (
  <div className="tapes" aria-hidden="true">
    <Tape
      className="tape-run--spot"
      baseVelocity={-2.2}
      items={['AI / ML', 'Deep Learning', 'Python', 'Web Dev', 'Computer Vision', 'Open to work']}
    />
    <Tape
      className="tape-run--ink"
      baseVelocity={1.8}
      items={['Build', 'Break', 'Learn', 'Repeat', 'VIT Chennai ’28', 'Ship it']}
    />
  </div>
);

export default TapeMarquee;
