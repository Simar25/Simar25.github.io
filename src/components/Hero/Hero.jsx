import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiArrowRight, FiCamera, FiDownload, FiGithub, FiLinkedin, FiMail, FiTrash2 } from 'react-icons/fi';
import SprayCanvas from '../SprayCanvas/SprayCanvas';
import Scribble from '../common/Scribble';
import Mark from '../common/Mark';
import { asset } from '../../lib/asset';
import { between, burstClip, mulberry32 } from '../../lib/random';
import './Hero.css';

const NAME = 'SIMARJOT';
const TILT = (() => {
  const rand = mulberry32(9);
  return [...NAME].map(() => between(rand, -6, 6));
})();

const ROLES = ['B.Tech CS student @ VIT', 'AI / ML enthusiast', 'web developer'];

const CANS = [
  { name: 'Ink black', hex: '#15130f' },
  { name: 'Chrome', hex: '#a9a6a0' },
  { name: 'Buff white', hex: '#fffdf8' },
];

const SOCIALS = [
  { icon: FiGithub, href: 'https://github.com/Simar25', label: 'GitHub', bg: 'var(--ink)', fg: 'var(--sticker)', rot: -8 },
  { icon: FiLinkedin, href: 'https://linkedin.com/in/simarjot-singh-anand', label: 'LinkedIn', bg: 'var(--sticker)', fg: 'var(--ink)', rot: 6 },
  { icon: FiMail, href: 'mailto:simaranand250@gmail.com', label: 'Email', bg: 'var(--ink)', fg: 'var(--sticker)', rot: -4 },
];

const BURST = burstClip(16, 0.76, 3);

const chennaiTime = () =>
  new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' }).format(new Date());

/* label-maker tape with the time in Chennai, ticking over every half minute */
const LocalTime = () => {
  const [time, setTime] = useState(chennaiTime);

  useEffect(() => {
    const id = setInterval(() => setTime(chennaiTime()), 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="dymo">
      Chennai · <time>{time}</time> IST
    </span>
  );
};

const letterVariants = {
  hidden: (i) => ({ opacity: 0, y: -140, rotate: TILT[i] * 5, scale: 1.5 }),
  shown: (i) => ({
    opacity: 1,
    y: 0,
    rotate: TILT[i],
    scale: 1,
    transition: { type: 'spring', stiffness: 480, damping: 17, delay: 0.3 + i * 0.075 },
  }),
};

const rise = (delay) => ({
  initial: { opacity: 0, y: 26 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
});

/* ---------- pieces ---------- */

const ThrowUp = () => (
  <span className="throwup" aria-hidden="true">
    {[...NAME].map((ch, i) => (
      <motion.span
        key={i}
        className="throwup__letter"
        custom={i}
        variants={letterVariants}
        initial="hidden"
        animate="shown"
        whileHover={{ y: -14, rotate: TILT[i] * -1.5, transition: { type: 'spring', stiffness: 600, damping: 12 } }}
      >
        <span className="throwup__shadow">{ch}</span>
        <span className="throwup__outline">{ch}</span>
        <span className="throwup__fill">{ch}</span>
      </motion.span>
    ))}
  </span>
);

const roleVariants = {
  enter: { clipPath: 'inset(-10% 100% -10% 0%)', opacity: 1 },
  shown: { clipPath: 'inset(-10% 0% -10% 0%)', opacity: 1, transition: { duration: 0.7, ease: [0.65, 0, 0.35, 1] } },
  exit: { opacity: 0, y: 10, rotate: 2, transition: { duration: 0.25, delay: 0.32 } },
};

const strikeVariants = {
  enter: { scaleX: 0 },
  shown: { scaleX: 0 },
  exit: { scaleX: 1, transition: { duration: 0.3, ease: 'easeOut' } },
};

const RoleSwapper = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((v) => (v + 1) % ROLES.length), 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="roles__slot" aria-live="polite">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={index}
          className="roles__word"
          variants={roleVariants}
          initial="enter"
          animate="shown"
          exit="exit"
        >
          {ROLES[index]}
          <motion.span className="roles__strike" variants={strikeVariants} aria-hidden="true" />
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

const SprayCan = ({ hex }) => (
  <svg viewBox="0 0 40 80" className="can__svg" aria-hidden="true">
    <rect x="16" y="1" width="8" height="6" rx="1.5" fill="#15130f" />
    <path d="M10 7h20v7a4 4 0 0 1-4 4H14a4 4 0 0 1-4-4z" fill={hex} />
    <rect x="6" y="17" width="28" height="60" rx="6" fill="#ddd6cb" stroke="#15130f" strokeWidth="2.5" />
    <rect x="7.5" y="30" width="25" height="30" fill={hex} />
    <path d="M12 40 q8 -6 16 0" stroke="#fff" strokeWidth="2" fill="none" opacity=".75" />
    <rect x="11" y="19" width="3" height="56" rx="1.5" fill="#fff" opacity=".55" />
  </svg>
);

const Sticker = ({ className = '', rotate = 0, delay = 0, constraints, label, children }) => (
  <motion.div
    className={`hsticker ${className}`}
    role="img"
    aria-label={label}
    data-cursor="drag"
    drag
    dragConstraints={constraints}
    dragElastic={0.2}
    dragTransition={{ bounceStiffness: 320, bounceDamping: 18 }}
    initial={{ opacity: 0, scale: 0, rotate: rotate - 50 }}
    animate={{ opacity: 1, scale: 1, rotate }}
    transition={{ type: 'spring', stiffness: 360, damping: 15, delay }}
    whileHover={{ scale: 1.07, rotate: rotate + 5 }}
    whileDrag={{ scale: 1.16, rotate: 0, zIndex: 40 }}
    whileTap={{ cursor: 'grabbing' }}
  >
    {children}
  </motion.div>
);

/* ---------- hero ---------- */

const Hero = () => {
  const heroRef = useRef(null);
  const wallRef = useRef(null);
  const [color, setColor] = useState(CANS[0].hex);
  const [sprayOn, setSprayOn] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches,
  );
  const [sprayed, setSprayed] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  const pickCan = (hex) => {
    setColor(hex);
    setShakeKey((k) => k + 1);
    if (!sprayOn) setSprayOn(true);
  };

  return (
    <section id="home" className={`hero${sprayOn ? ' hero--spraying' : ''}`} ref={heroRef}>
      <div className="hero__bg" aria-hidden="true">
        <span className="hero__ghost hero__ghost--1">AI·ML</span>
        <span className="hero__ghost hero__ghost--2">VIT</span>
        <span className="hero__ghost hero__ghost--3">&lt;/&gt;</span>
      </div>

      <SprayCanvas
        ref={wallRef}
        color={color}
        enabled={sprayOn}
        onSpray={() => setSprayed(true)}
      />

      <div className="container hero__inner">
        <div className="hero__text">
          <motion.div className="hero__kicker" {...rise(0.1)}>
            <LocalTime />
            <span className="hero__hey">hey there, I&apos;m</span>
          </motion.div>

          <h1 className="hero__name">
            <span className="sr-only">Simarjot Singh Anand</span>
            <ThrowUp />
            <motion.span
              className="hero__tag"
              aria-hidden="true"
              initial={{ clipPath: 'inset(-30% 100% -30% 0%)' }}
              animate={{ clipPath: 'inset(-30% 0% -30% 0%)' }}
              transition={{ duration: 0.9, delay: 1.05, ease: [0.65, 0, 0.35, 1] }}
            >
              Singh Anand
            </motion.span>
            <Scribble type="crown" className="hero__crown" color="var(--ink)" strokeWidth={4} onMount delay={1.6} />
          </h1>

          <motion.p className="hero__roles" {...rise(1.25)}>
            <span className="hero__roles-pre">I&apos;m a</span>
            <RoleSwapper />
          </motion.p>

          <motion.div className="hero__tagline" {...rise(1.4)}>
            <p className="hero__statement">
              I build AI projects that work <Mark delay={1.9}>outside the notebook</Mark>, from collecting the data to
              deploying the result.
            </p>
            <dl className="hero__facts">
              <div>
                <dt>Now</dt>
                <dd>
                  Building <a href="#filinglens">FilingLens</a>, an AI analyst for company annual reports
                </dd>
              </div>
              <div>
                <dt>Looking for</dt>
                <dd>AI/ML and software engineering internships</dd>
              </div>
            </dl>
          </motion.div>

          <motion.div className="hero__ctas" {...rise(1.55)}>
            <a href="#projects" className="btn-sticker">
              See my work <FiArrowRight />
            </a>
            <a href={asset('Simarjot_Singh_Anand_Resume.pdf')} className="btn-marker" target="_blank" rel="noopener noreferrer">
              <FiDownload /> Download CV
            </a>
          </motion.div>

          <motion.ul className="hero__socials" {...rise(1.7)}>
            {SOCIALS.map(({ icon: Icon, href, label, bg, fg, rot }) => (
              <li key={label}>
                <motion.a
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="hero__social"
                  style={{ '--bg': bg, '--fg': fg, rotate: rot }}
                  whileHover={{ scale: 1.15, rotate: rot + 20 }}
                  whileTap={{ scale: 0.92 }}
                >
                  <Icon />
                </motion.a>
              </li>
            ))}
          </motion.ul>
        </div>

      </div>

      {/* loose stickers — peel them off and move them around */}
      <Sticker className="hs-burst" rotate={12} delay={1.5} constraints={heroRef} label="AI and ML">
        <span className="hs-burst__shape" style={{ clipPath: BURST }}>
          AI / ML
        </span>
      </Sticker>
      <Sticker className="hs-circle" rotate={-14} delay={1.65} constraints={heroRef} label="VIT class of 2028">
        <span>VIT</span>
        <small>&apos;28</small>
      </Sticker>
      <Sticker className="hs-pill" rotate={-6} delay={1.8} constraints={heroRef} label="Open to work">
        <span className="hs-pill__dot" /> open to work
      </Sticker>
      <Sticker className="hs-code" rotate={4} delay={2.1} constraints={heroRef} label="Code">
        <span className="dymo">&lt;/&gt; ship it</span>
      </Sticker>

      {/* paint rack */}
      <motion.div
        className="rack"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, type: 'spring', stiffness: 160, damping: 18 }}
      >
        <p className="rack__hint" aria-live="polite">
          {sprayed ? 'nice tag. now save it' : sprayOn ? 'click + drag on the wall to spray' : 'grab a can & tag the wall'}
        </p>
        <div className="rack__cans" role="radiogroup" aria-label="Spray paint colour">
          {CANS.map((can) => {
            const active = can.hex === color;
            return (
              <motion.button
                key={can.hex}
                type="button"
                role="radio"
                aria-checked={active}
                aria-label={can.name}
                className={`can${active ? ' is-active' : ''}`}
                onClick={() => pickCan(can.hex)}
                animate={{ y: active ? -10 : 0 }}
                transition={{ type: 'spring', stiffness: 420, damping: 18 }}
                whileHover={{ y: active ? -13 : -5 }}
              >
                {/* remounts on every pick so the can gets a fresh shake */}
                <motion.span
                  key={active ? `shake-${shakeKey}` : 'idle'}
                  className="can__body"
                  animate={active ? { rotate: [0, -16, 13, -9, 6, 0] } : { rotate: 0 }}
                  transition={{ duration: 0.55, ease: 'easeInOut' }}
                >
                  <SprayCan hex={can.hex} />
                </motion.span>
              </motion.button>
            );
          })}
        </div>
        <div className="rack__tools">
          <button
            type="button"
            className={`rack__btn${sprayOn ? ' is-on' : ''}`}
            onClick={() => setSprayOn((v) => !v)}
            aria-pressed={sprayOn}
          >
            spray {sprayOn ? 'on' : 'off'}
          </button>
          <button type="button" className="rack__btn rack__btn--icon" onClick={() => wallRef.current?.save()} aria-label="Save your tag as an image">
            <FiCamera />
          </button>
          <button
            type="button"
            className="rack__btn rack__btn--icon"
            onClick={() => {
              wallRef.current?.clear();
              setSprayed(false);
            }}
            aria-label="Buff the wall (clear paint)"
          >
            <FiTrash2 />
          </button>
        </div>
      </motion.div>

      <motion.a
        href="#about"
        className="hero__scroll"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.3 }}
      >
        scroll, there&apos;s more
        <motion.span
          className="hero__scroll-arrow"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Scribble type="arrowDown" color="var(--ink)" strokeWidth={4} onMount delay={2.4} />
        </motion.span>
      </motion.a>
    </section>
  );
};

export default Hero;
