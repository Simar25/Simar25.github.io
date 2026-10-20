import { tornStripPath } from '../../lib/random';

const cache = new Map();
const getPath = (seed, height) => {
  const key = `${seed}-${height}`;
  if (!cache.has(key)) cache.set(key, tornStripPath(seed, 1200, height));
  return cache.get(key);
};

/* Ragged paper edge that sits on top of a section, in that section's colour.
   A lighter "fibre" layer peeks out underneath like real torn stock. */
const TornEdge = ({ color, fibre = 'rgba(255, 255, 255, 0.75)', seed = 1, height = 30 }) => (
  <svg
    className="torn torn--top"
    viewBox={`0 0 1200 ${height}`}
    preserveAspectRatio="none"
    style={{ height }}
    aria-hidden="true"
  >
    <path d={getPath(seed + 100, height)} fill={fibre} />
    <path d={getPath(seed, height)} fill={color} transform={`translate(0 ${height * 0.18})`} />
  </svg>
);

export default TornEdge;
