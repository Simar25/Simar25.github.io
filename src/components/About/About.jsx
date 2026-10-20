import { motion } from 'framer-motion';
import SectionTitle from '../common/SectionTitle';
import TornEdge from '../common/TornEdge';
import Mark from '../common/Mark';
import Stamp from '../common/Stamp';
import CountUp from '../common/CountUp';
import Scribble from '../common/Scribble';
import './About.css';

/* the blackbook page — written in paint pens */
const CODE = [
  [['k', 'const '], ['v', 'simarjot'], ['p', ' = {']],
  [['a', '  name'], ['p', ': '], ['s', '"Simarjot Singh Anand"'], ['p', ',']],
  [['a', '  role'], ['p', ': '], ['s', '"CS Undergrad & Developer"'], ['p', ',']],
  [['a', '  university'], ['p', ': '], ['s', '"VIT Chennai"'], ['p', ',']],
  [['a', '  batch'], ['p', ': '], ['s', '"2024–2028"'], ['p', ',']],
  [['a', '  interests'], ['p', ': [']],
  [['s', '    "AI/ML"'], ['p', ',']],
  [['s', '    "Deep Learning"'], ['p', ',']],
  [['s', '    "Web Development"']],
  [['p', '  ],']],
  [['a', '  openToWork'], ['p', ': '], ['b', 'true']],
  [['p', '};']],
];

const STATS = [
  { value: <CountUp to={4} suffix="+" />, label: 'Projects', color: 'var(--spot)', rotate: -10 },
  { value: '1', label: 'Live client site', color: 'var(--ink)', rotate: 6 },
  { value: <CountUp to={3} />, label: 'Certs', color: 'var(--spot)', rotate: -4 },
];

const page = {
  hidden: { opacity: 0, y: 60, rotate: -9 },
  shown: {
    opacity: 1,
    y: 0,
    rotate: -2.5,
    transition: { type: 'spring', stiffness: 120, damping: 16, staggerChildren: 0.07, delayChildren: 0.35 },
  },
};

const line = {
  hidden: { opacity: 0, x: -16 },
  shown: { opacity: 1, x: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

const para = {
  hidden: { opacity: 0, y: 24 },
  shown: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] } }),
};

const About = () => (
  <section id="about" className="about section">
    <TornEdge color="var(--paper-2)" seed={3} />
    <div className="container">
      <SectionTitle
        index="01"
        kicker="who dis?"
        note="A quick snapshot of who I am, what drives me, and where I'm headed."
      >
        About Me
      </SectionTitle>

      <div className="about__grid">
        <div className="about__visual">
          <motion.div
            className="blackbook"
            variants={page}
            initial="hidden"
            whileInView="shown"
            viewport={{ once: true, margin: '0px 0px -15% 0px' }}
          >
            <span className="tape tape--tl" />
            <span className="blackbook__band" aria-hidden="true" />
            <div className="blackbook__head">
              <span>simarjot.js</span>
              <span>pg. 01</span>
            </div>
            <pre className="blackbook__code" aria-label="A JavaScript object describing Simarjot">
              {CODE.map((segments, i) => (
                <motion.span className="blackbook__line" key={i} variants={line}>
                  <span className="blackbook__ln">{String(i + 1).padStart(2, '0')}</span>
                  {segments.map(([kind, text], j) => (
                    <span key={j} className={`c-${kind}`}>
                      {text}
                    </span>
                  ))}
                </motion.span>
              ))}
            </pre>
            <span className="blackbook__tag" aria-hidden="true">
              simar
            </span>
            <Scribble type="crown" className="blackbook__crown" color="var(--paper)" strokeWidth={3.5} delay={1.2} />
          </motion.div>

          <motion.div
            className="sticky-note"
            initial={{ opacity: 0, scale: 0.6, rotate: 20 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 4 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 260, damping: 15, delay: 0.9 }}
          >
            <span className="tape tape--top" />
            status:
            <strong>open to work &amp; collabs ✓</strong>
          </motion.div>
        </div>

        <div className="about__text">
          <motion.p className="about__lead" variants={para} custom={0} initial="hidden" whileInView="shown" viewport={{ once: true }}>
            I&apos;m a <Mark>B.Tech Computer Science</Mark> student at <Mark delay={0.15}>VIT Chennai (2024–2028)</Mark>.
          </motion.p>

          <motion.p variants={para} custom={1} initial="hidden" whileInView="shown" viewport={{ once: true }}>
            I&apos;m deeply passionate about <Mark>Artificial Intelligence &amp; Machine Learning</Mark>,
            with a growing focus on deep learning architectures and their real-world applications. Alongside that, I love
            crafting polished, performant web experiences — from pixel-perfect frontends to scalable backend systems.
          </motion.p>

          <motion.p variants={para} custom={2} initial="hidden" whileInView="shown" viewport={{ once: true }}>
            I&apos;ve had the opportunity to deploy a <Mark>real-world project for a clinical psychologist</Mark>,
            turning research-backed insights into a functional tool that makes a tangible difference. Right now I&apos;m
            building <Mark>FilingLens</Mark>, an AI analyst that answers questions about company annual reports, with
            citations back to the source.
          </motion.p>

          <ul className="about__stamps">
            {STATS.map((s, i) => (
              <li key={s.label}>
                <Stamp color={s.color} rotate={s.rotate} delay={0.15 + i * 0.14} round>
                  <span className="about__stamp-value">{s.value}</span>
                  <span className="about__stamp-label">{s.label}</span>
                </Stamp>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </section>
);

export default About;
