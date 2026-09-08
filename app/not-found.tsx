import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <section className="not-found-page">
      <div className="shell">
        <p className="eyebrow with-line">404 / An unmapped corner</p>
        <h1>We do not have a path to that idea <em>yet.</em></h1>
        <p>The library is growing. Try searching for the question underneath the link.</p>
        <div>
          <Link className="button button-primary" href="/search"><Search size={16} /> Search the library</Link>
          <Link className="text-link" href="/"><ArrowLeft size={15} /> Return home</Link>
        </div>
      </div>
    </section>
  );
}
