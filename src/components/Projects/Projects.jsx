import { Fragment, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { FiArrowUpRight, FiGithub, FiLock } from 'react-icons/fi';
import SectionTitle from '../common/SectionTitle';
import TornEdge from '../common/TornEdge';
import Stamp from '../common/Stamp';
import CountUp from '../common/CountUp';
import Scribble from '../common/Scribble';
import Splat from '../common/Splat';
import ImageTrail from '../common/ImageTrail';
import { asset } from '../../lib/asset';
import { burstClip, tornClip } from '../../lib/random';
import './Projects.css';

const PROJECTS = [
  {
    id: 'ambient-vibe',
    title: 'Ambient Vibe Intelligence System',
    status: 'Patent filed',
    tags: 'Edge AI · Computer vision',
    lede: 'A small edge-AI device that tells a restaurant or venue what its atmosphere is like right now.',
    detail: [
      'A Raspberry Pi camera combines lighting, how full the room is, the look of the space and infrastructure signals into a live “vibe” score. A matching platform uses that score to pair venues with local musicians. There is a working end-to-end prototype (TRL-3), and the patent disclosure was filed through VIT Chennai.',
    ],
    note: 'Code is private while the patent is pending.',
    role: 'Co-inventor. Built the on-device inference pipeline and the REST API.',
    tech: ['Raspberry Pi', 'YOLOv8-nano', 'MobileNetV3', 'Flask/FastAPI'],
    accent: 'var(--pop-teal)',
    figure: { kind: 'flow', caption: 'How the prototype works. The models run on the Raspberry Pi itself.' },
  },
  {
    id: 'filinglens',
    title: 'FilingLens',
    status: 'In progress',
    tags: 'RAG · Data engineering',
    lede: 'An AI analyst for company annual reports. Ask a question in plain English and get an answer drawn from the report and the numbers, with citations.',
    detail: [
      'The data pipeline pulls 10-K filings, XBRL financial statements and daily stock prices from SEC EDGAR and Yahoo Finance into DuckDB, and every figure can be traced back to its filing. Reports are split into sections and passages, embedded, and searched by a RAG pipeline that answers with numbered citations.',
      'Next up: text-to-SQL for the numbers, and a small replication of the “Lazy Prices” paper on whether changes in report wording predict stock returns.',
    ],
    role: 'Solo project',
    tech: ['Python', 'DuckDB', 'ChromaDB', 'bge-base-en-v1.5', 'Gemini', 'pytest'],
    links: [{ label: 'Code on GitHub', href: 'https://github.com/Simar25/FilingLens', github: true }],
    burst: '★ Now building',
    accent: 'var(--pop-yellow)',
    figure: { kind: 'funnel', caption: 'From raw filings to passages an LLM can cite.' },
  },
  {
    id: 'churn',
    title: 'Customer Churn Prediction',
    status: 'Live demo',
    tags: 'Machine learning · Explainability',
    lede: 'Predicts which telecom customers are about to cancel, and explains why.',
    detail: [
      'Trained on the IBM Telco dataset: 7,043 customers, 26% of whom churned. I balanced the classes with SMOTE on the training split only, so nothing leaked into the test set, and compared Logistic Regression, Random Forest and XGBoost on recall and ROC-AUC instead of accuracy. The best model reached a ROC-AUC of 0.83, and it runs as a Streamlit app.',
    ],
    tech: ['pandas', 'scikit-learn', 'imbalanced-learn', 'XGBoost', 'SHAP', 'Streamlit'],
    links: [
      { label: 'Live demo', href: 'https://customer-churn-prediction-simar25.streamlit.app/' },
      { label: 'Code on GitHub', href: 'https://github.com/Simar25/Customer-Churn-Prediction', github: true },
    ],
    accent: 'var(--pop-red)',
    figure: {
      kind: 'churn',
      src: 'images/churn-shap.png',
      width: 803,
      height: 940,
      alt: 'SHAP summary plot ranking tenure, two-year contracts and number of services as the strongest churn factors',
      caption: 'SHAP summary from the project. Short tenure pushes churn risk up; two-year contracts pull it down.',
    },
  },
  {
    id: 'mannsay',
    title: 'Mannsay',
    status: 'Client project',
    tags: 'Full stack · Web',
    lede: 'A website for a clinical psychologist, where clients can read about therapy and book a session online.',
    detail: [
      'A responsive front end with appointment booking, sign-up and login, and a short wellness self-check. Behind it, a PHP and MySQL backend stores accounts, appointments and progress notes, and a dashboard lets the practice manage appointment status, with email notifications through EmailJS.',
    ],
    role: 'Developer, built for a real client',
    tech: ['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL', 'EmailJS'],
    links: [{ label: 'Visit the live site', href: 'https://www.mannsay.com' }],
    accent: 'var(--pop-blue)',
    figure: {
      kind: 'shot',
      src: 'images/mannsay.jpg',
      width: 1200,
      height: 708,
      alt: 'Mannsay homepage with the headline “We Have The Power To Help People Thrive” and a Book Appointment button',
      caption: 'The homepage of the client site.',
    },
  },
  {
    id: 'campus-finder',
    title: 'Campus Finder',
    status: 'Team project',
    tags: 'Databases · SQL',
    lede: 'A lost-and-found system for a college campus, built for our database course.',
    detail: [
      'Students report lost or found items, search every report and claim what is theirs. The interesting part is matching: a single SQL self-join scores every lost–found pair out of 100 on category, location, date and description, and surfaces the likely matches.',
    ],
    tech: ['SQLite', 'SQL', 'Python', 'HTML', 'CSS', 'JavaScript'],
    links: [{ label: 'Code on GitHub', href: 'https://github.com/PranjalSingh2217/DBMS_PROJECT', github: true }],
    accent: 'var(--pop-orange)',
    figure: {
      kind: 'shot',
      src: 'images/campus-finder.jpg',
      width: 1200,
      height: 744,
      alt: 'Campus Finder matches page showing lost and found reports paired with scores of 100 and 80 out of 100',
      caption: 'The Matches page. Each pair’s score comes straight from the SQL query.',
    },
  },
];

/* black-and-white photocopies on slightly different paper stock */
const POSTERS = [
  { paper: 'var(--sticker)', rotate: -1.1, seed: 31 },
  { paper: 'var(--paper-2)', rotate: 0.9, seed: 47 },
  { paper: 'var(--notebook)', rotate: -0.7, seed: 59 },
  { paper: 'var(--sticker)', rotate: 1.1, seed: 73 },
  { paper: 'var(--paper-2)', rotate: -0.9, seed: 89 },
];

const BURST = burstClip(18, 0.8, 11);

/* ---------- figures (fig. 01–05 from the old site, redrawn by hand) ---------- */

const FLOW = [
  { label: 'Input', nodes: [{ title: 'Raspberry Pi camera', text: 'live video of the room' }] },
  {
    label: 'On the device',
    nodes: [
      { title: 'YOLOv8-nano', text: 'how full the room is' },
      { title: 'MobileNetV3', text: 'what the space looks like' },
      { title: 'Lighting & infrastructure', text: 'extra signals' },
    ],
  },
  {
    label: 'Output',
    nodes: [
      { title: 'Vibe score', text: 'updated in real time', accent: true },
      { title: 'REST API', text: 'feeds artist–venue matching' },
    ],
  },
];

const FUNNEL = [
  { value: 84, label: '10-K annual reports' },
  { value: 1862, label: 'report sections' },
  { value: 21005, label: 'searchable passages' },
];

const CHURN_STATS = [
  { label: 'Customers', value: <CountUp to={7043} /> },
  { label: 'Churned', value: <CountUp to={26} suffix="%" /> },
  { label: 'Best ROC-AUC', value: <CountUp to={0.83} decimals={2} />, hi: true },
];

const Arrow = () => (
  <span className="fig-arrow" aria-hidden="true">
    <Scribble type="arrowDown" color="var(--ink)" strokeWidth={3.5} duration={0.4} />
  </span>
);

const Flow = () => (
  <div className="flow">
    {FLOW.map((col, i) => (
      <Fragment key={col.label}>
        {i > 0 && <Arrow />}
        <div className="flow__col">
          <span className="fig-label">{col.label}</span>
          <div className="flow__nodes">
            {col.nodes.map((n, j) => (
              <span
                key={n.title}
                className={`flow__node${n.accent ? ' flow__node--accent' : ''}`}
                style={{ rotate: `${(i + j) % 2 ? 1 : -1}deg` }}
              >
                <b>{n.title}</b>
                {n.text}
              </span>
            ))}
          </div>
        </div>
      </Fragment>
    ))}
  </div>
);

const Funnel = () => (
  <div className="funnel">
    {FUNNEL.map((step, i) => (
      <Fragment key={step.label}>
        {i > 0 && <Arrow />}
        <div className="funnel__step">
          <span className="funnel__big">
            <CountUp to={step.value} duration={1.4 + i * 0.3} />
          </span>
          <span className="funnel__label">{step.label}</span>
        </div>
      </Fragment>
    ))}
    <p className="funnel__foot">
      Each passage is embedded with bge-base-en-v1.5 and stored in ChromaDB, then filtered by company and year when a
      question comes in. Financials and prices sit next to them in DuckDB.
    </p>
  </div>
);

const Shot = ({ figure, className = '' }) => (
  <div className={`shot ${className}`}>
    <span className="tape tape--top" />
    <img src={asset(figure.src)} alt={figure.alt} width={figure.width} height={figure.height} loading="lazy" />
  </div>
);

const Figure = ({ figure, number }) => (
  <figure className={`poster__figure poster__figure--${figure.kind}`}>
    {figure.kind === 'flow' && <Flow />}
    {figure.kind === 'funnel' && <Funnel />}
    {figure.kind === 'churn' && (
      <>
        <dl className="churn-stats">
          {CHURN_STATS.map((s) => (
            <div key={s.label} className={s.hi ? 'is-hi' : undefined}>
              <dt>{s.label}</dt>
              <dd>{s.value}</dd>
            </div>
          ))}
        </dl>
        <Shot figure={figure} className="shot--plot" />
      </>
    )}
    {figure.kind === 'shot' && <Shot figure={figure} className="shot--photocopy" />}
    <figcaption>
      <span className="fig-no">Fig. {number}</span> {figure.caption}
    </figcaption>
  </figure>
);

/* ---------- poster ---------- */

const Poster = ({ project, index }) => {
  const style = POSTERS[index % POSTERS.length];
  const number = String(index + 1).padStart(2, '0');
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(rx, { stiffness: 200, damping: 20 });
  const rotateY = useSpring(ry, { stiffness: 200, damping: 20 });

  const tilt = (e) => {
    if (e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 3);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 2.4);
  };
  const reset = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.li
      id={project.id}
      className={`poster-slot${index % 2 ? ' poster-slot--flip' : ''}`}
      initial={{ opacity: 0, y: 90, rotate: style.rotate * 4, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, rotate: style.rotate, scale: 1 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ type: 'spring', stiffness: 110, damping: 17 }}
      style={{ '--accent': project.accent }}
    >
      {/* the wall got a coat of paint before the poster went up */}
      <Splat
        className="poster-slot__splat"
        seed={style.seed}
        color={project.accent}
        drips={4}
        opacity={0.92}
        delay={0.25}
      />
      <motion.article
        className="poster"
        style={{ '--paper-c': style.paper, rotateX, rotateY, transformPerspective: 1400 }}
        onPointerMove={tilt}
        onPointerLeave={reset}
      >
        <div className="poster__paper" style={{ clipPath: tornClip(style.seed, { top: true, bottom: true, amp: 8 }) }}>
          <header className="poster__head">
            <div className="poster__top">
              <span className="poster__num">{number}</span>
              <span className="poster__cat">{project.tags}</span>
              <span className="poster__stamp">
                <Stamp rotate={index % 2 ? 6 : -8} delay={0.4} color="var(--pop-red)">
                  {project.status}
                </Stamp>
              </span>
            </div>
            <h3 className="poster__title">{project.title}</h3>
            <p className="poster__lede">{project.lede}</p>
          </header>

          <Figure figure={project.figure} number={number} />

          <div className="poster__detail">
            {project.detail.map((p) => (
              <p key={p.slice(0, 24)} className="poster__desc">
                {p}
              </p>
            ))}
            {project.note && (
              <p className="poster__note">
                <FiLock aria-hidden="true" /> {project.note}
              </p>
            )}

            <dl className="poster__meta">
              {project.role && (
                <div>
                  <dt>Role</dt>
                  <dd>{project.role}</dd>
                </div>
              )}
              <div>
                <dt>Built with</dt>
                <dd>
                  <ul className="poster__tech">
                    {project.tech.map((t, i) => (
                      <li key={t} className="dymo" style={{ transform: `rotate(${i % 2 ? 1.5 : -1.5}deg)` }}>
                        {t}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>

            {project.links && (
              <div className="poster__links">
                {project.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="poster__link"
                    data-cursor="open"
                  >
                    {link.github && <FiGithub />} {link.label} <FiArrowUpRight />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <span className="tape tape--tl" />
        <span className="tape tape--tr" />

        {project.burst && (
          <motion.span
            className="poster__burst"
            style={{ clipPath: BURST }}
            initial={{ scale: 0, rotate: -90 }}
            whileInView={{ scale: 1, rotate: 12 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 300, damping: 12, delay: 0.7 }}
          >
            {project.burst}
          </motion.span>
        )}
      </motion.article>
    </motion.li>
  );
};

/* mini posters that get pasted up behind the cursor as it crosses the heading */
const PasteUp = ({ project, index }) =>
  project.figure.src ? (
    <span className="paste paste--print" style={{ '--accent': project.accent }}>
      <img src={asset(project.figure.src)} alt="" width={project.figure.width} height={project.figure.height} />
    </span>
  ) : (
    <span className="paste paste--card" style={{ '--accent': project.accent }}>
      <b>{String(index + 1).padStart(2, '0')}</b>
      {project.tags.split(' · ')[0]}
    </span>
  );

const Projects = () => {
  const introRef = useRef(null);

  return (
    <section id="projects" className="projects section">
      <TornEdge color="var(--wall)" fibre="rgba(255, 250, 240, 0.85)" seed={11} />
      <div className="projects__ghost" aria-hidden="true">
        WALL OF WORK
      </div>
      <div className="container">
        <div className="projects__intro" ref={introRef} data-cursor="paste">
          <ImageTrail containerRef={introRef} className="projects__trail">
            {PROJECTS.map((project, i) => (
              <PasteUp key={project.id} project={project} index={i} />
            ))}
          </ImageTrail>
          <SectionTitle
            index="02"
            kicker="wall of work"
            note="Five projects I’ve built or helped build."
            accent="#0858a8"
          >
            Selected Work
          </SectionTitle>
        </div>

        <ol className="posters">
          {PROJECTS.map((project, i) => (
            <Poster key={project.id} project={project} index={i} />
          ))}
        </ol>
      </div>
    </section>
  );
};

export default Projects;
