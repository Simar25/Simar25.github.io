import { motion } from 'framer-motion';
import './Stamp.css';

/* Rubber stamp that slams onto the page when it scrolls into view. */
const Stamp = ({ children, color = 'var(--red)', rotate = -8, delay = 0, round = false, className = '' }) => (
  <motion.span
    className={`stamp${round ? ' stamp--round' : ''} ${className}`}
    style={{ '--stamp': color }}
    initial={{ opacity: 0, scale: 2.4, rotate: rotate - 22 }}
    whileInView={{ opacity: 1, scale: 1, rotate }}
    viewport={{ once: true, margin: '0px 0px -8% 0px' }}
    transition={{ type: 'spring', stiffness: 640, damping: 24, mass: 0.9, delay }}
  >
    <span className="stamp__ink">{children}</span>
  </motion.span>
);

export default Stamp;
