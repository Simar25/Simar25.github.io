import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import SectionTitle from '../common/SectionTitle';
import TornEdge from '../common/TornEdge';
import CountUp from '../common/CountUp';
import Scribble from '../common/Scribble';
import './Skills.css';

const LANGUAGES = [
  { name: 'Python', value: 90 },
  { name: 'C', value: 80 },
  { name: 'C++', value: 75 },
  { name: 'Java', value: 70 },
];

const MORE_LANGUAGES = ['SQL', 'JavaScript', 'PHP', 'R'];

const BOARDS = [
  {
    name: 'Machine learning',
    paper: 'var(--sticker)',
    rotate: -1.2,
    wide: true,
    skills: ['scikit-learn', 'XGBoost', 'SHAP', 'YOLOv8', 'MobileNetV3', 'RAG', 'embeddings', 'Gemini API'],
  },
  {
    name: 'Data & backend',
    paper: 'var(--paper)',
    rotate: 0.8,
    wide: true,
    skills: ['pandas', 'NumPy', 'DuckDB', 'MySQL', 'SQLite', 'ChromaDB', 'Flask', 'FastAPI', 'Streamlit'],
  },
  {
    name: 'Web',
    paper: 'var(--paper-2)',
    rotate: -1.6,
    skills: ['HTML', 'CSS', 'JavaScript', 'PHP'],
  },
  {
    name: 'Tools',
    paper: 'var(--sticker)',
    rotate: 2,
    skills: ['Git', 'GitHub', 'pytest', 'Raspberry Pi', 'Kaggle'],
  },
];

/* round stickers come in red or black; the rest are white or label tape */
const CIRCLE_COLORS = ['var(--spot)', 'var(--ink)'];
const TILTS = [-6, 4, -3, 7, -8, 3, 5, -4];

const stickerKind = (name, i) => (name.length <= 4 ? 'circle' : ['pill', 'dymo', 'tag'][i % 3]);

/* ---------- spray-painted proficiency streak ---------- */

const SprayBar = ({ name, value, index }) => {
  const trackRef = useRef(null);
  const inView = useInView(trackRef, { once: true, margin: '0px 0px -10% 0px' });
  const delay = 0.2 + index * 0.18;
  return (
    <li className="sbar">
      <div className="sbar__head">
        <span className="sbar__name">{name}</span>
        <span className="sbar__value">
          <CountUp to={value} suffix="%" duration={1.4} />
        </span>
      </div>
      <div
        ref={trackRef}
        className="sbar__track"
        role="meter"
        aria-label={`${name} proficiency`}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <motion.div
          className="sbar__paint"
          initial={{ width: '0%' }}
          animate={{ width: inView ? `${value}%` : '0%' }}
          transition={{ duration: 1.2, delay, ease: [0.6, 0.05, 0.3, 1] }}
        >
          <span className="sbar__fill" />
          <span className="sbar__mist" />
        </motion.div>
        {[3, 11].map((offset, d) => (
          <motion.span
            key={offset}
            className="sbar__drip"
            style={{ left: `calc(${value - offset}% - 3px)`, '--h': `${d ? 18 : 30}px` }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: inView ? 1 : 0 }}
            transition={{ duration: 1.1, delay: delay + 1 + d * 0.25, ease: [0.3, 0, 0.2, 1] }}
          />
        ))}
      </div>
    </li>
  );
};

/* ---------- sticker board ---------- */

const Board = ({ board, index }) => {
  const ref = useRef(null);
  return (
    <motion.article
      ref={ref}
      className={`board${board.wide ? ' board--wide' : ''}`}
      style={{ '--paper-c': board.paper }}
      initial={{ opacity: 0, y: 60, rotate: board.rotate * 4 }}
      whileInView={{ opacity: 1, y: 0, rotate: board.rotate }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ type: 'spring', stiffness: 140, damping: 17, delay: index * 0.1 }}
    >
      <span className={`tape ${index % 2 ? 'tape--tr' : 'tape--tl'}`} />
      <header className="board__head">
        <h3 className="board__name">{board.name}</h3>
        <span className="board__count">
          {board.skills.length} {board.skills.length === 1 ? 'skill' : 'skills'}
        </span>
      </header>
      <ul className="board__stickers">
        {board.skills.map((skill, i) => {
          const kind = stickerKind(skill, i + index);
          const tilt = TILTS[(i + index * 3) % TILTS.length];
          return (
            <motion.li
              key={skill}
              className={`skill-sticker skill-sticker--${kind}`}
              style={{ '--s': CIRCLE_COLORS[(i + index) % CIRCLE_COLORS.length] }}
              data-cursor="drag"
              drag
              dragConstraints={ref}
              dragElastic={0.25}
              dragTransition={{ bounceStiffness: 300, bounceDamping: 16 }}
              initial={{ opacity: 0, scale: 0, rotate: tilt - 30 }}
              whileInView={{ opacity: 1, scale: 1, rotate: tilt }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 420, damping: 14, delay: 0.35 + index * 0.1 + i * 0.07 }}
              whileHover={{ scale: 1.08, rotate: tilt + 4 }}
              whileDrag={{ scale: 1.15, rotate: 0, zIndex: 20 }}
            >
              <span className="skill-sticker__label">{skill}</span>
            </motion.li>
          );
        })}
      </ul>
    </motion.article>
  );
};

const Skills = () => (
  <section id="skills" className="skills section">
    <TornEdge color="var(--black-paper)" fibre="rgba(255, 255, 255, 0.9)" seed={7} />
    <div className="skills__ghost" aria-hidden="true">
      TOOLS
    </div>

    <div className="container">
      <SectionTitle
        index="02"
        kicker="the paint rack"
        dark
        note="What I reach for, from models to databases."
      >
        Toolkit
      </SectionTitle>

      <div className="skills__layout">
        <div className="skills__langs">
          <h3 className="skills__h">
            Languages
            <Scribble type="zigzag" className="skills__h-line" color="var(--spot)" strokeWidth={4} />
          </h3>
          <ul className="sbars">
            {LANGUAGES.map((lang, i) => (
              <SprayBar key={lang.name} {...lang} index={i} />
            ))}
          </ul>
          <p className="skills__more">
            <span>also writes</span>
            {MORE_LANGUAGES.map((lang, i) => (
              <span key={lang} className="dymo" style={{ transform: `rotate(${i % 2 ? 2 : -2}deg)` }}>
                {lang}
              </span>
            ))}
          </p>
          <motion.p
            className="skills__tag"
            aria-hidden="true"
            initial={{ clipPath: 'inset(-20% 100% -40% 0%)' }}
            whileInView={{ clipPath: 'inset(-20% 0% -40% 0%)' }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, delay: 0.4, ease: [0.65, 0, 0.35, 1] }}
          >
            always
            <br />
            learning
          </motion.p>
        </div>

        <div className="skills__boards">
          {BOARDS.map((board, i) => (
            <Board key={board.name} board={board} index={i} />
          ))}
        </div>
      </div>

      <p className="skills__hint">
        <Scribble type="arrow" className="skills__hint-arrow" color="var(--paper)" strokeWidth={3} />
        psst — the stickers peel off. drag &apos;em around.
      </p>
    </div>
  </section>
);

export default Skills;
