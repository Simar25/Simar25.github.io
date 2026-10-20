/* Deterministic randomness so every render (and every visit) gets the same
   "hand-made" wobble — and so React's purity rules stay happy. */

export function mulberry32(seed) {
  let a = seed >>> 0;
  return function rand() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const between = (rand, min, max) => min + rand() * (max - min);

/** clip-path polygon with ragged, torn-paper edges. */
export function tornClip(seed, { top = true, bottom = false, amp = 8, steps = 24 } = {}) {
  const rand = mulberry32(seed);
  const jitter = 40 / steps;
  const x = (i) => {
    if (i === 0) return 0;
    if (i === steps) return 100;
    return Math.min(100, Math.max(0, (i / steps) * 100 + between(rand, -jitter, jitter)));
  };
  const pts = [];

  if (top) {
    for (let i = 0; i <= steps; i++) pts.push(`${x(i).toFixed(2)}% ${(rand() * amp).toFixed(1)}px`);
  } else {
    pts.push('0% 0%', '100% 0%');
  }

  if (bottom) {
    for (let i = steps; i >= 0; i--) {
      pts.push(`${x(i).toFixed(2)}% calc(100% - ${(rand() * amp).toFixed(1)}px)`);
    }
  } else {
    pts.push('100% 100%', '0% 100%');
  }

  return `polygon(${pts.join(', ')})`;
}

/** clip-path polygon for a starburst sticker. */
export function burstClip(points = 14, inner = 0.8, seed = 7) {
  const rand = mulberry32(seed);
  const pts = [];
  for (let i = 0; i < points * 2; i++) {
    const angle = (Math.PI * i) / points - Math.PI / 2;
    const r = (i % 2 === 0 ? 50 : 50 * inner) * between(rand, 0.95, 1.02);
    pts.push(`${(50 + Math.cos(angle) * r).toFixed(2)}% ${(50 + Math.sin(angle) * r).toFixed(2)}%`);
  }
  return `polygon(${pts.join(', ')})`;
}

/** SVG path for a torn strip that sits on top of a section. */
export function tornStripPath(seed, width = 1200, height = 30) {
  const rand = mulberry32(seed);
  let d = `M0 ${height} L0 ${(height * between(rand, 0.35, 0.7)).toFixed(1)}`;
  let x = 0;
  while (x < width) {
    x = Math.min(width, x + between(rand, 8, 26));
    const deep = rand() > 0.9;
    const y = deep ? between(rand, 0, height * 0.25) : between(rand, height * 0.3, height * 0.8);
    d += ` L${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return `${d} L${width} ${height} Z`;
}

/** A paint splat: overlapping blobs, flung droplets and a few drips. */
export function splatShape(seed, { drips = 3, droplets = 14 } = {}) {
  const rand = mulberry32(seed);
  const blobs = [];
  const dots = [];
  const runs = [];

  for (let i = 0; i < 9; i++) {
    const a = rand() * Math.PI * 2;
    const dist = between(rand, 0, 24);
    blobs.push({
      cx: 100 + Math.cos(a) * dist,
      cy: 92 + Math.sin(a) * dist * 0.8,
      r: between(rand, 22, 38),
    });
  }

  for (let i = 0; i < droplets; i++) {
    const a = rand() * Math.PI * 2;
    const dist = between(rand, 52, 92);
    dots.push({
      cx: 100 + Math.cos(a) * dist,
      cy: 92 + Math.sin(a) * dist * 0.85,
      r: between(rand, 1.5, 7),
    });
  }

  for (let i = 0; i < drips; i++) {
    const w = between(rand, 4, 9);
    runs.push({
      x: between(rand, 72, 126),
      y: 100,
      w,
      h: between(rand, 30, 88),
    });
  }

  return { blobs, dots, runs };
}
