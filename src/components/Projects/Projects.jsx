import { motion, useMotionValue, useSpring } from 'framer-motion';
import { FiArrowUpRight, FiFileText, FiGithub, FiHeart, FiMic, FiMusic } from 'react-icons/fi';
import SectionTitle from '../common/SectionTitle';
import TornEdge from '../common/TornEdge';
import Stamp from '../common/Stamp';
import Splat from '../common/Splat';
import { burstClip, tornClip } from '../../lib/random';
import './Projects.css';

const PROJECTS = [
  {
    title: 'FilingLens',
    description:
      'An AI analyst for company annual reports. Ask a question in plain English and get an answer drawn from the report and the numbers, with citations. 84 SEC 10-K filings, split into 21,005 searchable passages.',
    tech: ['Python', 'DuckDB', 'ChromaDB', 'Gemini'],
    category: 'AI/ML',
    status: 'In Progress',
    featured: true,
    repoUrl: 'https://github.com/Simar25/FilingLens',
    icon: FiFileText,
  },
  {
    title: 'Online Counselling Platform',
    description:
      'Built a responsive site for a clinical psychologist — real client, real requirements. Handled booking, service pages & contact forms end-to-end with a calm design.',
    tech: ['HTML', 'CSS', 'JavaScript'],
    category: 'Web Development',
    status: 'Deployed',
    liveUrl: 'https://www.mannsay.com',
    icon: FiHeart,
  },
  {
    title: 'VibeSync — Ambient Intelligence for Restaurants',
    description:
      'Reads restaurant crowd energy in real time and recommends music & lighting adjustments. Fuses audio, visual, and contextual signals into actionable staff suggestions.',
    tech: ['Python', 'Computer Vision', 'Multimodal Sensing'],
    category: 'AI/ML',
    status: 'Completed',
    icon: FiMusic,
  },
  {
    title: 'Gig Marketplace for Restaurants',
    description:
      'Marketplace connecting restaurants with local musicians for live gig opportunities. Building listings, search & booking flows for venue owners and artists.',
    tech: ['Web Development'],
    category: 'Web Development',
    status: 'In Progress',
    icon: FiMic,
  },
];

/* photocopies on the wall: off-white stock, printed in black or the one red */
const POSTERS = [
  { paper: 'var(--sticker)', accent: 'var(--spot)', rotate: -1.8, seed: 31 },
  { paper: 'var(--paper-2)', accent: 'var(--ink)', rotate: 1.4, seed: 47 },
  { paper: 'var(--notebook)', accent: 'var(--ink)', rotate: 1.2, seed: 59 },
  { paper: 'var(--sticker)', accent: 'var(--spot)', rotate: -1.4, seed: 73 },
];

const STATUS_COLOR = { Completed: 'var(--ink)', Deployed: 'var(--spot)', 'In Progress': 'var(--spot)' };
const FEATURED_BURST = burstClip(18, 0.8, 11);

const Poster = ({ project, index }) => {
  const style = POSTERS[index % POSTERS.length];
  const Icon = project.icon;
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(rx, { stiffness: 200, damping: 18 });
  const rotateY = useSpring(ry, { stiffness: 200, damping: 18 });

  const tilt = (e) => {
    if (e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 10);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 8);
  };
  const reset = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.li
      className={`poster-slot${index % 2 ? ' poster-slot--offset' : ''}`}
      initial={{ opacity: 0, y: 90, rotate: style.rotate * 5, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, rotate: style.rotate, scale: 1 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ type: 'spring', stiffness: 110, damping: 16, delay: (index % 2) * 0.12 }}
    >
      <motion.article
        className="poster"
        style={{ '--paper-c': style.paper, '--accent': style.accent, rotateX, rotateY, transformPerspective: 900 }}
        onPointerMove={tilt}
        onPointerLeave={reset}
        whileHover={{ y: -10, scale: 1.015 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <div className="poster__paper" style={{ clipPath: tornClip(style.seed, { top: true, bottom: true, amp: 9 }) }}>
          <div className="poster__top">
            <span className="poster__num">{String(index + 1).padStart(2, '0')}</span>
            <span className="poster__cat">{project.category}</span>
          </div>

          <div className="poster__art" aria-hidden="true">
            <Splat seed={style.seed} color={style.accent} drips={2} className="poster__splat" />
            <Icon className="poster__icon" />
          </div>

          <h3 className="poster__title">{project.title}</h3>
          <p className="poster__desc">{project.description}</p>

          <ul className="poster__tech" aria-label="Tech used">
            {project.tech.map((t, i) => (
              <li key={t} className="dymo" style={{ transform: `rotate(${i % 2 ? 1.5 : -1.5}deg)` }}>
                {t}
              </li>
            ))}
          </ul>

          <div className="poster__links">
            {project.liveUrl ? (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="poster__link" data-cursor="open">
                visit the live site <FiArrowUpRight />
              </a>
            ) : project.repoUrl ? (
              <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="poster__link" data-cursor="open">
                <FiGithub /> code on GitHub <FiArrowUpRight />
              </a>
            ) : (
              <a href="https://github.com/Simar25" target="_blank" rel="noopener noreferrer" className="poster__link poster__link--quiet">
                <FiGithub /> more on my GitHub
              </a>
            )}
          </div>
        </div>

        <span className="tape tape--tl" />
        <span className="tape tape--tr" />

        <div className="poster__stamp">
          <Stamp color={STATUS_COLOR[project.status]} rotate={index % 2 ? 10 : -12} delay={0.5}>
            {project.status}
          </Stamp>
        </div>

        {project.featured && (
          <motion.span
            className="poster__featured"
            style={{ clipPath: FEATURED_BURST }}
            initial={{ scale: 0, rotate: -90 }}
            whileInView={{ scale: 1, rotate: -14 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 300, damping: 12, delay: 0.7 }}
          >
            ★ Featured
          </motion.span>
        )}
      </motion.article>
    </motion.li>
  );
};

const Projects = () => (
  <section id="projects" className="projects section">
    <TornEdge color="var(--kraft)" fibre="rgba(255, 250, 240, 0.85)" seed={11} />
    <div className="projects__ghost" aria-hidden="true">
      WALL OF WORK
    </div>
    <div className="container">
      <SectionTitle
        index="03"
        kicker="wall of work"
        note="A curated selection of things I’ve built — from machine learning pipelines to production web apps."
      >
        Featured Projects
      </SectionTitle>

      <ul className="posters">
        {PROJECTS.map((project, i) => (
          <Poster key={project.title} project={project} index={i} />
        ))}
      </ul>
    </div>
  </section>
);

export default Projects;
