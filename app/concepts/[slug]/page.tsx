import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { KnowledgeArticle } from "@/components/knowledge-article";
import { assertValidContentGraph, getAllConcepts, getConceptBySlug } from "@/lib/content";

export function generateStaticParams() {
  assertValidContentGraph();
  return getAllConcepts().map((concept) => ({ slug: concept.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const concept = getConceptBySlug(slug);
  if (!concept) return {};
  return {
    title: concept.title,
    description: concept.description,
    openGraph: { type: "article", title: concept.title, description: concept.description },
    twitter: { card: "summary_large_image", title: concept.title, description: concept.description },
    alternates: { canonical: `/concepts/${concept.slug}` },
  };
}

export default async function ConceptPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const concept = getConceptBySlug(slug);
  if (!concept) notFound();
  return <KnowledgeArticle concept={concept} />;
}
