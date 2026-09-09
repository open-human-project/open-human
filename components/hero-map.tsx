import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

export function HeroMap({ locale }: { locale: Locale }) {
  const copy = getDictionary(locale).heroMap;
  return (
    <div className="hero-map" role="img" aria-label={copy.label}>
      <svg viewBox="0 0 520 520" aria-hidden="true">
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
      <span className="map-label label-self">{copy.nodes[0]}</span>
      <span className="map-label label-body">{copy.nodes[1]}</span>
      <span className="map-label label-mind">{copy.nodes[2]}</span>
      <span className="map-label label-nature">{copy.nodes[3]}</span>
      <span className="map-label label-systems">{copy.nodes[4]}</span>
      <p className="map-caption">{copy.caption}</p>
    </div>
  );
}
