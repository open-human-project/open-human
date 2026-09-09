import type { Locale } from "@/lib/i18n/config";
import type { CategorySlug } from "@/lib/types";

export type Category = {
  slug: CategorySlug;
  index: string;
  name: string;
  shortName: string;
  eyebrow: string;
  description: string;
  introduction: string;
  question: string;
  accent: string;
};

const shared = {
  body: { index: "01", accent: "sage" },
  mind: { index: "02", accent: "blue" },
  "self-awareness": { index: "03", accent: "ochre" },
  "human-nature": { index: "04", accent: "clay" },
  "dark-library": { index: "05", accent: "charcoal" },
} as const;

const english: Category[] = [
  {
    slug: "body",
    ...shared.body,
    name: "Body",
    shortName: "Body",
    eyebrow: "The organism",
    description: "Understand the biological system you live inside.",
    introduction:
      "Your body is not a vehicle carrying your mind. It shapes attention, mood, energy, and every choice available to you. Begin with the systems that keep you alive.",
    question: "What does this organism need to function?",
  },
  {
    slug: "mind",
    ...shared.mind,
    name: "Mind",
    shortName: "Mind",
    eyebrow: "The interpreter",
    description: "Understand the machinery of thought and perception.",
    introduction:
      "The mind does not passively record reality. It selects, predicts, reconstructs, and interprets—usually before you notice it happening.",
    question: "How does my mind construct what feels true?",
  },
  {
    slug: "self-awareness",
    ...shared["self-awareness"],
    name: "Self Awareness",
    shortName: "Awareness",
    eyebrow: "The observer",
    description: "Learn to notice yourself with greater clarity.",
    introduction:
      "Awareness creates a small but consequential space between what happens, what you make it mean, and what you do next.",
    question: "What is happening in me right now?",
  },
  {
    slug: "human-nature",
    ...shared["human-nature"],
    name: "Human Nature",
    shortName: "Human Nature",
    eyebrow: "The social animal",
    description: "Understand what humans tend to do—and why.",
    introduction:
      "Humans cooperate and compete, conform and dissent, care and exploit. Describing these tendencies clearly is not the same as excusing them.",
    question: "What changes when other humans enter the room?",
  },
  {
    slug: "dark-library",
    ...shared["dark-library"],
    name: "Dark Library",
    shortName: "Dark Library",
    eyebrow: "The uncomfortable mechanisms",
    description: "Recognize manipulation, coercion, and group harm.",
    introduction:
      "Some human mechanisms are safer to understand than to ignore. This library explains how harmful influence works, what it looks like, and how to resist it.",
    question: "What becomes visible once I know the pattern?",
  },
];

const indonesian: Category[] = [
  {
    slug: "body",
    ...shared.body,
    name: "Tubuh",
    shortName: "Tubuh",
    eyebrow: "Sang organisme",
    description: "Pahami sistem biologis tubuh Anda.",
    introduction:
      "Tubuh bukan sekadar kendaraan yang membawa pikiran. Tubuh membentuk perhatian, suasana hati, energi, dan setiap pilihan yang tersedia bagi Anda. Mulailah dari sistem yang menjaga Anda tetap hidup.",
    question: "Apa yang dibutuhkan organisme ini agar dapat berfungsi?",
  },
  {
    slug: "mind",
    ...shared.mind,
    name: "Pikiran",
    shortName: "Pikiran",
    eyebrow: "Sang penafsir",
    description: "Pahami mekanisme pikiran dan persepsi.",
    introduction:
      "Pikiran tidak merekam kenyataan secara pasif. Ia menyeleksi, memprediksi, menyusun kembali, dan menafsirkan—biasanya sebelum Anda menyadarinya.",
    question: "Bagaimana pikiran saya membentuk apa yang terasa benar?",
  },
  {
    slug: "self-awareness",
    ...shared["self-awareness"],
    name: "Kesadaran Diri",
    shortName: "Kesadaran",
    eyebrow: "Sang pengamat",
    description: "Belajar mengamati diri sendiri dengan lebih jernih.",
    introduction:
      "Kesadaran menciptakan ruang kecil tetapi penting di antara apa yang terjadi, makna yang Anda berikan, dan tindakan Anda selanjutnya.",
    question: "Apa yang sedang terjadi di dalam diri saya sekarang?",
  },
  {
    slug: "human-nature",
    ...shared["human-nature"],
    name: "Sifat Manusia",
    shortName: "Sifat Manusia",
    eyebrow: "Makhluk sosial",
    description: "Pahami kecenderungan manusia—dan alasannya.",
    introduction:
      "Manusia bekerja sama dan bersaing, menyesuaikan diri dan menyuarakan perbedaan, peduli dan mengeksploitasi. Menjelaskan kecenderungan ini dengan jernih tidak sama dengan membenarkannya.",
    question: "Apa yang berubah ketika orang lain hadir?",
  },
  {
    slug: "dark-library",
    ...shared["dark-library"],
    name: "Perpustakaan Gelap",
    shortName: "Perpustakaan Gelap",
    eyebrow: "Mekanisme yang meresahkan",
    description: "Kenali manipulasi, pemaksaan, dan dampak buruk dalam kelompok.",
    introduction:
      "Sebagian mekanisme dalam perilaku manusia lebih aman untuk dipahami daripada diabaikan. Perpustakaan ini menjelaskan cara kerja pengaruh berbahaya, bentuknya, dan cara melawannya.",
    question: "Apa yang mulai terlihat setelah saya mengenali polanya?",
  },
];

const categoriesByLocale: Record<Locale, Category[]> = {
  en: english,
  id: indonesian,
};

export const categories = english;

export function getCategories(locale: Locale) {
  return categoriesByLocale[locale];
}

export function getCategory(locale: Locale, slug: string) {
  return categoriesByLocale[locale].find((category) => category.slug === slug);
}
