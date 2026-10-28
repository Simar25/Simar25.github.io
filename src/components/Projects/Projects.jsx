import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import {
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { FiArrowLeft, FiArrowRight, FiArrowUpRight, FiGithub, FiLock, FiPause, FiPlay } from 'react-icons/fi';
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
    figure: {
      kind: 'flow',
      steps: [
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
      ],
      caption: 'How the prototype works. The models run on the Raspberry Pi itself.',
    },
  },
  {
    id: 'liveness',
    title: 'Single-Frame Face Liveness Detection',
    status: 'Team project',
    tags: 'Edge AI · Biometric security',
    lede: 'Tells a real face from a printed photo or a video replayed on a phone, running entirely on a Raspberry Pi 5 with an ordinary camera.',
    detail: [
      'No depth or infrared sensor, and the user never has to blink or turn their head. MediaPipe finds the face and turns away ones that are too far or not facing the camera. Two small MiniFASNet networks score it at two crop sizes, and an FFT check looks for the moiré pattern a screen leaves. Scores are smoothed over 20 frames so the verdict does not flicker, and a Flask dashboard streams it to any browser on the network.',
      'It reached an ACER of 3.4% on OULU-NPU Protocol 1, cross-dataset HTERs of 24.5% and 27.2%, and 16.2 ms per frame on a laptop CPU. INT8 quantisation cost only 0.8 ACER points. Our first two versions used blink and head-turn challenges; we dropped them because they were slow and a replayed video could pass them.',
    ],
    tech: ['Raspberry Pi 5', 'MediaPipe', 'MiniFASNet', 'ONNX Runtime', 'OpenCV', 'Flask'],
    accent: 'var(--pop-olive)',
    figure: {
      kind: 'flow',
      steps: [
        { label: 'Input', nodes: [{ title: 'Pi Camera v2', text: 'one RGB frame, 640×480' }] },
        {
          label: 'On the Pi',
          nodes: [
            { title: 'MediaPipe', text: 'finds the face, checks pose' },
            { title: '2 × MiniFASNet', text: 'real-face score' },
            { title: 'FFT cue', text: 'screen moiré texture' },
          ],
        },
        {
          label: 'Output',
          nodes: [
            { title: 'LIVE / SPOOF', text: 'steady over 20 frames', accent: true },
            { title: 'Flask dashboard', text: 'any browser on the network' },
          ],
        },
      ],
      caption: 'What runs on the Pi for every frame. No depth sensor, no cloud.',
    },
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
      alt: 'Mannsay homepage with the headline “Your mind matters. Let’s talk.” and a Book a session button',
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
  { paper: 'var(--notebook)', rotate: 0.8, seed: 97 },
];

const BURST = burstClip(18, 0.8, 11);

/* ---------- figures (fig. 01–05 from the old site, redrawn by hand) ---------- */

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

const Flow = ({ steps }) => (
  <div className="flow">
    {steps.map((col, i) => (
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
    {figure.kind === 'flow' && <Flow steps={figure.steps} />}
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

const Poster = ({ project, index, trackRef }) => {
  const style = POSTERS[index % POSTERS.length];
  const number = String(index + 1).padStart(2, '0');
  const slotRef = useRef(null);
  const reduce = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(rx, { stiffness: 200, damping: 20 });
  const rotateY = useSpring(ry, { stiffness: 200, damping: 20 });

  // 0.5 = centred in the row: full size; posters sliding off either side shrink back
  const { scrollXProgress } = useScroll({
    container: trackRef,
    target: slotRef,
    axis: 'x',
    offset: ['start end', 'end start'],
    layoutEffect: false, // the track ref lives in the parent, so wait until it's attached
  });
  const scale = useTransform(scrollXProgress, [0, 0.5, 1], [0.86, 1, 0.86]);
  const fade = useTransform(scrollXProgress, [0, 0.5, 1], [0.5, 1, 0.5]);

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
      ref={slotRef}
      id={project.id}
      className={`poster-slot${index % 2 ? ' poster-slot--flip' : ''}`}
      initial={{ opacity: 0, y: 50, rotate: style.rotate * 4 }}
      whileInView={{ opacity: 1, y: 0, rotate: style.rotate }}
      viewport={{ once: true }}
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
        style={{
          '--paper-c': style.paper,
          rotateX,
          rotateY,
          transformPerspective: 1400,
          ...(!reduce && { scale, opacity: fade }),
        }}
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

const pad = (n) => String(n).padStart(2, '0');
const AUTOPLAY_MS = 6000;

const Projects = () => {
  const introRef = useRef(null);
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const drag = useRef(null);
  const reduce = useReducedMotion();
  const [at, setAt] = useState(0);
  const last = PROJECTS.length - 1;

  // padding centres the first and last poster, so scroll progress maps straight onto the index
  const { scrollXProgress } = useScroll({ container: trackRef });
  useMotionValueEvent(scrollXProgress, 'change', (p) => setAt(Math.round(p * last)));
  const bar = useTransform(scrollXProgress, [0, 1], [1 / PROJECTS.length, 1]);

  // scrolling down into the section: the wall text drifts and the row glides in from the right
  const { scrollYProgress: sectionY } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const ghostX = useTransform(sectionY, [0, 1], ['14%', '-14%']);
  const { scrollYProgress: trackY } = useScroll({ target: trackRef, offset: ['start end', 'start 35%'] });
  const glide = useTransform(trackY, [0, 1], ['32%', '0%']);

  const go = useCallback(
    (i) => {
      const el = trackRef.current;
      const card = el.children[Math.max(0, Math.min(last, i))];
      el.scrollTo({ left: card.offsetLeft - (el.clientWidth - card.offsetWidth) / 2, behavior: reduce ? 'auto' : 'smooth' });
    },
    [last, reduce]
  );

  // autoplay: on while the row is on screen, held while a mouse or focus is on it, off once touched
  const [paused, setPaused] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [hold, setHold] = useState(false);
  const inView = useInView(trackRef, { amount: 0.3 });
  useEffect(() => {
    if (paused || hold || !inView) return undefined;
    const id = setTimeout(() => go(at === last ? 0 : at + 1), AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [at, paused, hold, inView, go, last]);

  // mouse drag to slide; touch and trackpads scroll natively
  const dragStart = (e) => {
    if (e.pointerType !== 'mouse') {
      setPaused(true);
      return;
    }
    if (e.button !== 0) return;
    drag.current = { x: e.clientX, left: trackRef.current.scrollLeft, moved: false };
  };
  const dragMove = (e) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    if (!d.moved) {
      if (Math.abs(dx) < 6) return;
      d.moved = true;
      trackRef.current.setPointerCapture(e.pointerId);
      trackRef.current.classList.add('is-dragging');
      window.getSelection()?.removeAllRanges();
    }
    trackRef.current.scrollLeft = d.left - dx;
  };
  const dragEnd = () => {
    const d = drag.current;
    if (!d?.moved) {
      drag.current = null;
      return;
    }
    const el = trackRef.current;
    el.classList.remove('is-dragging');
    go(Math.round((el.scrollLeft / (el.scrollWidth - el.clientWidth)) * last));
    // keep `moved` until the click that ends the drag has been swallowed
    setTimeout(() => (drag.current = null));
  };

  return (
    <section id="projects" className="projects section" ref={sectionRef}>
      <TornEdge color="var(--wall)" fibre="rgba(255, 250, 240, 0.85)" seed={11} />
      <motion.div className="projects__ghost" aria-hidden="true" style={reduce ? undefined : { x: ghostX }}>
        WALL OF WORK
      </motion.div>
      <div className="container">
        <div className="projects__intro" ref={introRef} data-cursor="paste">
          <ImageTrail containerRef={introRef} className="projects__trail">
            {PROJECTS.map((project, i) => (
              <PasteUp key={project.id} project={project} index={i} />
            ))}
          </ImageTrail>
          <SectionTitle index="02" kicker="wall of work" accent="#0858a8">
            Selected Work
          </SectionTitle>
        </div>

        <div
          onMouseEnter={() => setHold(true)}
          onMouseLeave={() => setHold(false)}
          onFocus={() => setHold(true)}
          onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setHold(false)}
        >
          <div className="posters__nav">
            <button type="button" className="posters__btn" onClick={() => go(at - 1)} disabled={at === 0} aria-label="Previous project">
              <FiArrowLeft />
            </button>
            <span className="posters__count" aria-live={paused ? 'polite' : 'off'}>
              <b>{pad(at + 1)}</b> / {pad(PROJECTS.length)}
            </span>
            <span className="posters__bar" aria-hidden="true">
              <motion.span style={{ scaleX: bar }} />
            </span>
            <button
              type="button"
              className="posters__btn posters__btn--play"
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? 'Play slideshow' : 'Pause slideshow'}
            >
              {paused ? <FiPlay /> : <FiPause />}
            </button>
            <button type="button" className="posters__btn" onClick={() => go(at + 1)} disabled={at === last} aria-label="Next project">
              <FiArrowRight />
            </button>
          </div>

          <motion.ol
            ref={trackRef}
            className="posters"
            tabIndex={0}
            aria-label="Projects. Scroll sideways to see more."
            data-cursor="drag"
            style={reduce ? undefined : { x: glide }}
            onPointerDown={dragStart}
            onPointerMove={dragMove}
            onPointerUp={dragEnd}
            onPointerCancel={dragEnd}
            onDragStart={(e) => e.preventDefault()}
            onClickCapture={(e) => drag.current?.moved && e.preventDefault()}
          >
            {PROJECTS.map((project, i) => (
              <Poster key={project.id} project={project} index={i} trackRef={trackRef} />
            ))}
          </motion.ol>
        </div>
      </div>
    </section>
  );
};

export default Projects;
