import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiCheck, FiCopy, FiMail, FiMapPin, FiPhone, FiSend } from 'react-icons/fi';
import SectionTitle from '../common/SectionTitle';
import TornEdge from '../common/TornEdge';
import { asset } from '../../lib/asset';
import './Contact.css';

const EMAIL = 'simaranand250@gmail.com';

const INFO = [
  { icon: FiMail, label: 'Email', value: EMAIL, copy: true },
  { icon: FiPhone, label: 'Phone', value: '6263753049', href: 'tel:6263753049' },
  { icon: FiMapPin, label: 'Location', value: 'Chennai, India' },
];

const TABS = [
  { label: 'email me', short: 'copy address', value: EMAIL, action: 'copy' },
  { label: 'GitHub', short: '@Simar25', href: 'https://github.com/Simar25' },
  { label: 'LinkedIn', short: 'Simarjot S. Anand', href: 'https://www.linkedin.com/in/simarjot-singh-anand' },
  { label: 'resume', short: 'PDF, 1 page', href: asset('Simarjot_Singh_Anand_Resume.pdf') },
];

const copyText = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

/* ---------- tear-off flyer ---------- */

const Flyer = () => {
  const [torn, setTorn] = useState(null);
  const [toast, setToast] = useState(null);

  const flash = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  const tear = async (i, tab, e) => {
    setTorn(i);
    setTimeout(() => setTorn(null), 1500);
    if (tab.action === 'copy') {
      e.preventDefault();
      flash((await copyText(tab.value)) ? 'email copied! ✓' : tab.value);
    }
  };

  const copyInfo = async (value) => flash((await copyText(value)) ? 'copied! ✓' : value);

  return (
    <motion.div
      className="flyer"
      initial={{ opacity: 0, y: 60, rotate: -7 }}
      whileInView={{ opacity: 1, y: 0, rotate: -1.6 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ type: 'spring', stiffness: 120, damping: 16 }}
    >
      <span className="tape tape--top" />
      <div className="flyer__sheet">
        <p className="flyer__wanted">Wanted:</p>
        <p className="flyer__what">an AI/ML or software engineering internship</p>
        <p className="flyer__copy">Email is the quickest way to reach me. Pull a tab, or just say hi.</p>

        <ul className="flyer__info">
          {INFO.map(({ icon: Icon, label, value, copy, href }) => (
            <li key={label} className="flyer__row">
              <span className="flyer__icon">
                <Icon />
              </span>
              <span className="flyer__row-text">
                <span className="flyer__row-label">{label}</span>
                {href ? <a href={href}>{value}</a> : <span>{value}</span>}
              </span>
              {copy && (
                <motion.button
                  type="button"
                  className="flyer__copy-btn"
                  onClick={() => copyInfo(value)}
                  whileTap={{ scale: 0.88 }}
                  aria-label={`Copy ${label.toLowerCase()}`}
                >
                  <FiCopy />
                </motion.button>
              )}
            </li>
          ))}
        </ul>
      </div>

      <ul className="flyer__tabs">
        {TABS.map((tab, i) => (
          <li key={tab.label} className="flyer__tab-slot">
            <motion.a
              href={tab.href ?? `mailto:${tab.value}`}
              target={tab.href ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="flyer__tab"
              onClick={(e) => tear(i, tab, e)}
              animate={torn === i ? { y: 160, rotate: i % 2 ? 24 : -24, opacity: 0 } : { y: 0, rotate: 0, opacity: 1 }}
              transition={
                torn === i
                  ? { duration: 0.7, ease: [0.5, 0, 0.75, 0] }
                  : { type: 'spring', stiffness: 260, damping: 18 }
              }
              whileHover={{ rotate: i % 2 ? 3 : -3, y: 4 }}
              data-cursor="open"
            >
              <span className="flyer__tab-label">{tab.label}</span>
              <span className="flyer__tab-value">{tab.short}</span>
            </motion.a>
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {toast && (
          <motion.p
            className="flyer__toast"
            role="status"
            initial={{ opacity: 0, y: 10, scale: 0.8, rotate: -6 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: -3 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {toast}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ---------- legal-pad form (opens the visitor's mail app) ---------- */

const NotePad = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const update = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const body = `${form.message}\n\n— ${form.name} (${form.email})`;
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <motion.form
      className="pad"
      onSubmit={submit}
      initial={{ opacity: 0, y: 60, rotate: 6 }}
      whileInView={{ opacity: 1, y: 0, rotate: 1.2 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ type: 'spring', stiffness: 120, damping: 16, delay: 0.12 }}
    >
      <div className="pad__binding" aria-hidden="true" />
      <p className="pad__heading">leave a note ✎</p>

      <div className="pad__row">
        <label className="pad__field">
          <span className="pad__label">Name</span>
          <input name="name" type="text" autoComplete="name" required value={form.name} onChange={update} placeholder="your name" />
        </label>
        <label className="pad__field">
          <span className="pad__label">Email</span>
          <input name="email" type="email" autoComplete="email" required value={form.email} onChange={update} placeholder="you@somewhere.com" />
        </label>
      </div>
      <label className="pad__field">
        <span className="pad__label">Subject</span>
        <input name="subject" type="text" required value={form.subject} onChange={update} placeholder="what's it about?" />
      </label>
      <label className="pad__field">
        <span className="pad__label">Message</span>
        <textarea name="message" rows={5} required value={form.message} onChange={update} placeholder="spill it…" />
      </label>

      <div className="pad__actions">
        <motion.button type="submit" className="btn-sticker pad__send" whileTap={{ scale: 0.94 }}>
          {sent ? (
            <>
              <FiCheck /> Opened your mail app
            </>
          ) : (
            <>
              <FiSend /> Send it
            </>
          )}
        </motion.button>
        <p className="pad__fine">
          {sent ? (
            <>
              Nothing popped up? Email me at <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            </>
          ) : (
            'opens your email app with everything filled in'
          )}
        </p>
      </div>
    </motion.form>
  );
};

/* ---------- section ---------- */

const Contact = () => (
  <section id="contact" className="contact section">
    <TornEdge color="var(--paper)" seed={23} />
    <div className="container">
      <SectionTitle
        index="04"
        kicker="open to internships"
        note="I’m looking for AI/ML and software engineering internships. Email is the quickest way to reach me."
      >
        Let&apos;s Talk
      </SectionTitle>

      <div className="contact__grid">
        <Flyer />
        <NotePad />
      </div>
    </div>
  </section>
);

export default Contact;
