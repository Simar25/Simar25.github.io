import { motion } from 'framer-motion';

/* Hand-drawn marker marks that draw themselves in. */
const SHAPES = {
  underline: {
    viewBox: '0 0 300 26',
    d: ['M3 15 C 40 9, 80 6, 130 10 S 230 19, 297 8', 'M34 21 C 100 15, 180 16, 268 14'],
  },
  circle: {
    viewBox: '0 0 220 100',
    d: [
      'M120 8 C 175 6, 214 26, 210 52 C 206 80, 150 94, 96 90 C 42 86, 6 70, 10 44 C 14 20, 62 6, 128 10 C 152 12, 172 18, 186 26',
    ],
  },
  arrow: {
    viewBox: '0 0 120 90',
    d: ['M8 12 C 46 4, 92 18, 100 70', 'M82 58 L 101 75 L 113 52'],
  },
  arrowDown: {
    viewBox: '0 0 60 110',
    d: ['M30 4 C 16 30, 46 56, 28 96', 'M13 80 L 28 99 L 45 83'],
  },
  star: {
    viewBox: '0 0 60 60',
    d: ['M30 4 L 36.5 22 L 56 23 L 41 35 L 46.5 54 L 30 43 L 13.5 54 L 19 35 L 4 23 L 23.5 22 Z'],
  },
  crown: {
    viewBox: '0 0 90 62',
    d: ['M10 54 L 6 18 L 26 36 L 45 6 L 64 36 L 84 18 L 80 54 Z', 'M14 46 C 36 50, 58 42, 78 46'],
  },
  sparkle: {
    viewBox: '0 0 40 40',
    d: ['M20 2 C 21 14, 26 19, 38 20 C 26 21, 21 26, 20 38 C 19 26, 14 21, 2 20 C 14 19, 19 14, 20 2 Z'],
  },
  zigzag: {
    viewBox: '0 0 200 24',
    d: ['M2 18 L 18 6 L 34 18 L 50 6 L 66 18 L 82 6 L 98 18 L 114 6 L 130 18 L 146 6 L 162 18 L 178 6 L 198 18'],
  },
  squiggle: {
    viewBox: '0 0 200 24',
    d: ['M2 12 C 12 0, 22 24, 32 12 S 52 0, 62 12 S 82 24, 92 12 S 112 0, 122 12 S 142 24, 152 12 S 172 0, 182 12 S 196 20, 198 14'],
  },
};

const Scribble = ({
  type = 'underline',
  color = 'currentColor',
  strokeWidth = 4,
  delay = 0,
  duration = 0.7,
  onMount = false,
  className,
  style,
}) => {
  const shape = SHAPES[type];
  const trigger = onMount
    ? { animate: 'drawn' }
    : { whileInView: 'drawn', viewport: { once: true, margin: '0px 0px -12% 0px' } };

  return (
    <motion.svg
      className={className}
      style={style}
      viewBox={shape.viewBox}
      fill="none"
      aria-hidden="true"
      initial="blank"
      {...trigger}
    >
      {shape.d.map((d, i) => {
        const start = delay + i * duration * 0.85;
        return (
          <motion.path
            key={d}
            d={d}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            variants={{
              blank: { pathLength: 0, opacity: 0 },
              drawn: {
                pathLength: 1,
                opacity: 1,
                transition: {
                  pathLength: { duration, delay: start, ease: [0.65, 0, 0.35, 1] },
                  opacity: { duration: 0.01, delay: start },
                },
              },
            }}
          />
        );
      })}
    </motion.svg>
  );
};

export default Scribble;
