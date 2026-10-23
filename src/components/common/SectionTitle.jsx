import { motion } from 'framer-motion';
import Scribble from './Scribble';
import { ProximityField, ProximityLetter } from './TextCursorProximity';
import './SectionTitle.css';

const INK = '#15130f';
const PAPER = '#f4efe6';

const letter = {
  hidden: { opacity: 0, y: -40, rotate: -12, scale: 1.3 },
  shown: (i) => ({
    opacity: 1,
    y: 0,
    rotate: (i % 3) - 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 520, damping: 20, delay: 0.15 + i * 0.045 },
  }),
};

/* Big drippy section heading: tape kicker, yellow offset, marker underline. Letters swell toward the cursor. */
const SectionTitle = ({ index, kicker, children, dark = false, note, accent = '#d01818' }) => {
  const words = String(children)
    .split(' ')
    .map((word, w, all) => ({ word, start: all.slice(0, w).join('').length }));

  return (
    <header className={`stitle${dark ? ' stitle--dark' : ''}`}>
      <motion.p
        className="stitle__kicker"
        initial={{ opacity: 0, y: 14, rotate: -6 }}
        whileInView={{ opacity: 1, y: 0, rotate: -2 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 300, damping: 18 }}
      >
        <span className="stitle__num">{index}</span>
        {kicker}
      </motion.p>

      <motion.h2
        className="stitle__title"
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      >
        <span className="sr-only">{children}</span>
        <ProximityField from={dark ? PAPER : INK} to={accent} radius={110} scale={1.3}>
          <span className="stitle__text" aria-hidden="true">
            {words.map(({ word, start }, w) => (
              <span className="stitle__word" key={start}>
                {[...word].map((ch, j) => (
                  <motion.span key={j} className="stitle__letter" custom={start + j} variants={letter}>
                    <ProximityLetter>{ch}</ProximityLetter>
                  </motion.span>
                ))}
                {w === words.length - 1 && (
                  <Scribble
                    type="underline"
                    className="stitle__underline"
                    color={dark ? 'var(--paper)' : 'var(--ink)'}
                    strokeWidth={5}
                    delay={0.55}
                  />
                )}
              </span>
            ))}
          </span>
        </ProximityField>
      </motion.h2>

      {note && (
        <motion.p
          className="stitle__note"
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          {note}
        </motion.p>
      )}
    </header>
  );
};

export default SectionTitle;
