/* Shared SVG filters referenced from CSS (`filter: url(#f-…)`). */
const FilterDefs = () => (
  <svg aria-hidden="true" width="0" height="0" style={{ position: 'absolute' }} focusable="false">
    <defs>
      {/* wobbly, hand-cut edges */}
      <filter id="f-rough" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="3" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="5" xChannelSelector="R" yChannelSelector="G" />
      </filter>

      {/* speckled spray-paint edges + a touch of overspray */}
      <filter id="f-spray" x="-10%" y="-60%" width="120%" height="220%">
        <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="2" seed="11" result="grain" />
        <feDisplacementMap in="SourceGraphic" in2="grain" scale="9" xChannelSelector="R" yChannelSelector="G" result="d" />
        <feGaussianBlur in="d" stdDeviation="0.7" />
      </filter>

      {/* worn rubber-stamp ink */}
      <filter id="f-ink" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="2" seed="4" result="noise" />
        <feColorMatrix
          in="noise"
          type="matrix"
          values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -2.6 0 0 0 2.15"
          result="mask"
        />
        <feComposite in="SourceGraphic" in2="mask" operator="in" />
      </filter>
    </defs>
  </svg>
);

export default FilterDefs;
