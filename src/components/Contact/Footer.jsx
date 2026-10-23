import { motion } from 'framer-motion';
import { FiArrowUp } from 'react-icons/fi';
import TornEdge from '../common/TornEdge';
import Scribble from '../common/Scribble';
import './Contact.css';

const Footer = () => (
  <footer className="footer">
    <TornEdge color="var(--black-paper)" seed={29} fibre="rgba(255, 255, 255, 0.9)" height={24} />
    <div className="container footer__inner">
      <p className="footer__text">
        <span>
          Designed with <strong>React</strong>, <strong>Framer Motion</strong> and <strong>Vite</strong>, hosted on
          GitHub Pages
        </span>
        <span className="footer__aside">no walls were harmed in the making of this site.</span>
      </p>
      <motion.a
        href="#home"
        className="footer__top"
        whileHover={{ y: -4, rotate: -6 }}
        whileTap={{ scale: 0.92 }}
        onClick={(e) => {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      >
        <FiArrowUp /> back to top
      </motion.a>
    </div>
    <Scribble type="zigzag" className="footer__zig" color="var(--pop-yellow)" strokeWidth={3} />
  </footer>
);

export default Footer;
