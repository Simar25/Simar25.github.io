import { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import SectionTitle from '../common/SectionTitle';
import TornEdge from '../common/TornEdge';
import Scribble from '../common/Scribble';
import './Education.css';

const EDUCATION = [
  {
    institution: 'Vellore Institute of Technology, Chennai',
    degree: 'B.Tech — Computer Science & Engineering',
    period: '2024 – 2028',
    score: { label: 'CGPA', value: '8.2 / 10.0' },
    remark: 'keep it up!',
  },
  {
    institution: 'Class 12 (CBSE)',
    score: { label: 'Score', value: '93.0%' },
    remark: 'great work ★',
  },
  {
    institution: 'Class 10 (CBSE)',
    score: { label: 'Score', value: '91.2%' },
    remark: 'well done',
  },
];

const CERTIFICATIONS = [
  { title: 'Basics of Python', issuer: 'Infosys Springboard', date: 'Feb 2025', color: 'var(--pink)' },
  {
    title: 'Programming Fundamentals using Python – Part 1',
    issuer: 'Infosys Springboard',
    date: 'Feb 2025',
    color: 'var(--blue)',
  },
  {
    title: '19 Google Cloud Skill Courses, Study Jams 2025',
    issuer: 'GDG on Campus VITC',
    date: '2025',
    color: 'var(--green)',
  },
];

const Education = () => {
  const timelineRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: timelineRef, offset: ['start 75%', 'end 55%'] });
  const ink = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 });

  return (
    <section id="education" className="education section">
      <TornEdge color="var(--notebook)" seed={19} fibre="rgba(255, 255, 255, 0.95)" />
      <div className="container">
        <SectionTitle
          index="04"
          kicker="school daze"
          color="green"
          seed={15}
          note="My academic background and the certifications that form the foundation of my technical expertise."
        >
          Education
        </SectionTitle>

        <div className="timeline" ref={timelineRef}>
          <div className="timeline__track" aria-hidden="true">
            <motion.div className="timeline__ink" style={{ scaleY: ink }} />
          </div>

          <ol className="timeline__list">
            {EDUCATION.map((item, i) => (
              <motion.li
                key={item.institution}
                className="timeline__item"
                initial={{ opacity: 0, x: -40, rotate: -3 }}
                whileInView={{ opacity: 1, x: 0, rotate: i % 2 ? 0.8 : -0.8 }}
                viewport={{ once: true, margin: '0px 0px -15% 0px' }}
                transition={{ type: 'spring', stiffness: 140, damping: 18 }}
              >
                <span className="timeline__node" aria-hidden="true">
                  <Scribble type="star" color="var(--ink)" strokeWidth={4} duration={0.5} delay={0.15} />
                </span>

                <article className="index-card">
                  <span className="tape tape--top" />
                  <div className="index-card__body">
                    <div className="index-card__info">
                      {item.period && <span className="index-card__period">{item.period}</span>}
                      <h3 className="index-card__school">{item.institution}</h3>
                      {item.degree && <p className="index-card__degree">{item.degree}</p>}
                    </div>

                    <div className="index-card__grade">
                      <span className="index-card__grade-label">{item.score.label}</span>
                      <span className="index-card__grade-value">{item.score.value}</span>
                      <Scribble type="circle" className="index-card__ring" color="var(--red)" strokeWidth={3.5} delay={0.4} duration={0.8} />
                      <span className="index-card__remark">{item.remark}</span>
                    </div>
                  </div>
                </article>
              </motion.li>
            ))}
          </ol>
        </div>

        <h3 className="certs__title">
          Certifications
          <Scribble type="squiggle" className="certs__title-line" color="var(--blue)" strokeWidth={3.5} />
        </h3>

        <ul className="certs">
          {CERTIFICATIONS.map((cert, i) => (
            <motion.li
              key={cert.title}
              className="ticket"
              style={{ '--t': cert.color }}
              initial={{ opacity: 0, y: 50, rotate: i % 2 ? 8 : -8 }}
              whileInView={{ opacity: 1, y: 0, rotate: [-2, 1.5, -1][i] }}
              viewport={{ once: true, margin: '0px 0px -10% 0px' }}
              transition={{ type: 'spring', stiffness: 160, damping: 15, delay: i * 0.12 }}
              whileHover={{ y: -8, rotate: 0, transition: { type: 'spring', stiffness: 300, damping: 18 } }}
            >
              <div className="ticket__stub">
                <span className="ticket__admit">Admit one</span>
                <span className="ticket__no">№ 00{i + 1}</span>
              </div>
              <div className="ticket__main">
                <span className="ticket__issuer">{cert.issuer}</span>
                <h4 className="ticket__name">{cert.title}</h4>
                <span className="ticket__date">{cert.date}</span>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Education;
