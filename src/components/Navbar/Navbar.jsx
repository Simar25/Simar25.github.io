import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import './Navbar.css';

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
];

const MOBILE_COLORS = ['var(--pink)', 'var(--yellow)', 'var(--blue)', 'var(--green)', 'var(--orange)', 'var(--paper)'];

const Circle = () => (
  <motion.svg
    layoutId="nav-circle"
    className="nav__circle"
    viewBox="0 0 220 100"
    preserveAspectRatio="none"
    aria-hidden="true"
    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
  >
    <motion.path
      d="M120 8 C 175 6, 214 26, 210 52 C 206 80, 150 94, 96 90 C 42 86, 6 70, 10 44 C 14 20, 62 6, 128 10 C 152 12, 172 18, 186 26"
      fill="none"
      stroke="var(--pink)"
      strokeWidth="9"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    />
  </motion.svg>
);

const Navbar = () => {
  const [active, setActive] = useState('home');
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  /* hide on scroll down, show on scroll up */
  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 30);
        if (Math.abs(y - lastY) > 8) setHidden(y > lastY && y > 140);
        lastY = y;
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* which section is on screen */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.classList.toggle('is-locked', open);
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const go = (id) => (e) => {
    e.preventDefault();
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <motion.header
        className={`nav${scrolled ? ' nav--scrolled' : ''}`}
        initial={{ y: -120 }}
        animate={{ y: hidden && !open ? -130 : 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 28 }}
      >
        <div className="nav__strip">
          <a href="#home" className="nav__logo" onClick={go('home')} aria-label="Back to top">
            simar<span className="nav__logo-dot" />
          </a>

          <nav aria-label="Primary">
            <ul className="nav__links">
              {NAV_ITEMS.map(({ id, label }) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    onClick={go(id)}
                    className={`nav__link${active === id ? ' is-active' : ''}`}
                    aria-current={active === id ? 'true' : undefined}
                  >
                    {label}
                    {active === id && <Circle />}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <button
            type="button"
            className="nav__toggle"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? 'close ✕' : 'menu'}
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="mnav"
            initial={{ clipPath: 'circle(0% at 92% 4%)' }}
            animate={{ clipPath: 'circle(150% at 92% 4%)' }}
            exit={{ clipPath: 'circle(0% at 92% 4%)' }}
            transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
          >
            <ul className="mnav__list">
              {NAV_ITEMS.map(({ id, label }, i) => (
                <motion.li
                  key={id}
                  initial={{ opacity: 0, x: -50, rotate: -8 }}
                  animate={{ opacity: 1, x: 0, rotate: i % 2 ? 2 : -2 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ delay: 0.15 + i * 0.06, type: 'spring', stiffness: 300, damping: 22 }}
                >
                  <a
                    href={`#${id}`}
                    onClick={go(id)}
                    className={`mnav__link${active === id ? ' is-active' : ''}`}
                    style={{ '--c': MOBILE_COLORS[i] }}
                  >
                    <span className="mnav__num">0{i}</span>
                    {label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <p className="mnav__foot">simaranand250@gmail.com</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
