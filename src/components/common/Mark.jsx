import { motion } from 'framer-motion';

/* Marker swipe that runs under the words when they scroll in. */
const Mark = ({ children, delay = 0 }) => (
  <motion.span
    className="hl"
    initial={{ backgroundSize: '0% 36%' }}
    whileInView={{ backgroundSize: '100% 36%' }}
    viewport={{ once: true, margin: '0px 0px -15% 0px' }}
    transition={{ duration: 0.8, delay, ease: [0.65, 0, 0.35, 1] }}
  >
    {children}
  </motion.span>
);

export default Mark;
