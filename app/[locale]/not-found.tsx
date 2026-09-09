"use client";

import { useParams } from "next/navigation";
import { NotFoundContent } from "@/components/not-found-content";
import { defaultLocale, isLocale } from "@/lib/i18n/config";

export default function NotFound() {
  const params = useParams<{ locale?: string }>();
  const locale = params.locale && isLocale(params.locale) ? params.locale : defaultLocale;
  return <NotFoundContent locale={locale} />;
}
