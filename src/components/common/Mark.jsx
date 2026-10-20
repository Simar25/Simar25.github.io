import { motion } from 'framer-motion';

/* Highlighter swipe that runs across the words when they scroll in. */
const Mark = ({ children, color = 'var(--yellow)', delay = 0 }) => (
  <motion.span
    className="hl"
    style={{ '--hl': color }}
    initial={{ backgroundSize: '0% 72%' }}
    whileInView={{ backgroundSize: '100% 72%' }}
    viewport={{ once: true, margin: '0px 0px -15% 0px' }}
    transition={{ duration: 0.8, delay, ease: [0.65, 0, 0.35, 1] }}
  >
    {children}
  </motion.span>
);

export default Mark;
