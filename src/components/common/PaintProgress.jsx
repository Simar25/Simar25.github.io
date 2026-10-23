import { motion, useScroll, useSpring } from 'framer-motion';

/* A stripe of spray paint across the top of the page that grows as you scroll. */
const PaintProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, restDelta: 0.001 });

  return <motion.div className="paint-progress" style={{ scaleX }} aria-hidden="true" />;
};

export default PaintProgress;
