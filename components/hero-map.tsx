export function HeroMap() {
  return (
    <div className="hero-map" aria-label="A map connecting body, mind, awareness, and society">
      <svg viewBox="0 0 520 520" role="img" aria-hidden="true">
        <g className="map-lines">
          <path d="M260 260 132 138M260 260l149-104M260 260l-133 135M260 260l150 112" />
          <path d="M132 138 409 156M127 395l283-23M132 138l-5 257M409 156l1 216" />
          <circle cx="260" cy="260" r="91" />
          <circle cx="260" cy="260" r="156" />
        </g>
        <g className="map-node map-node-center">
          <circle cx="260" cy="260" r="49" />
          <circle cx="260" cy="260" r="5" className="node-dot" />
        </g>
        <g className="map-node">
          <circle cx="132" cy="138" r="32" />
          <circle cx="132" cy="138" r="4" className="node-dot" />
        </g>
        <g className="map-node">
          <circle cx="409" cy="156" r="27" />
          <circle cx="409" cy="156" r="4" className="node-dot" />
        </g>
        <g className="map-node">
          <circle cx="127" cy="395" r="28" />
          <circle cx="127" cy="395" r="4" className="node-dot" />
        </g>
        <g className="map-node">
          <circle cx="410" cy="372" r="35" />
          <circle cx="410" cy="372" r="4" className="node-dot" />
        </g>
      </svg>
      <span className="map-label label-self">Self</span>
      <span className="map-label label-body">Body</span>
      <span className="map-label label-mind">Mind</span>
      <span className="map-label label-nature">Nature</span>
      <span className="map-label label-systems">Systems</span>
      <p className="map-caption">A small map of a very large subject.</p>
    </div>
  );
}
