import { useEffect, useRef } from 'react';
import { animate, motion, useInView, useMotionValue, useTransform } from 'framer-motion';

/* Number that counts up the first time it scrolls into view. */
const CountUp = ({ to, decimals = 0, duration = 1.6, suffix = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const value = useMotionValue(0);
  const text = useTransform(
    value,
    (v) => `${v.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`,
  );

  useEffect(() => {
    if (!inView) return undefined;
    const controls = animate(value, to, { duration, ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
  }, [inView, to, duration, value]);

  return <motion.span ref={ref}>{text}</motion.span>;
};

export default CountUp;
