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

export const categories: Category[] = [
  {
    slug: "body",
    index: "01",
    name: "Body",
    shortName: "Body",
    eyebrow: "The organism",
    description: "Understand the biological system you live inside.",
    introduction:
      "Your body is not a vehicle carrying your mind. It shapes attention, mood, energy, and every choice available to you. Begin with the systems that keep you alive.",
    question: "What does this organism need to function?",
    accent: "sage",
  },
  {
    slug: "mind",
    index: "02",
    name: "Mind",
    shortName: "Mind",
    eyebrow: "The interpreter",
    description: "Understand the machinery of thought and perception.",
    introduction:
      "The mind does not passively record reality. It selects, predicts, reconstructs, and interprets—usually before you notice it happening.",
    question: "How does my mind construct what feels true?",
    accent: "blue",
  },
  {
    slug: "self-awareness",
    index: "03",
    name: "Self Awareness",
    shortName: "Awareness",
    eyebrow: "The observer",
    description: "Learn to notice yourself with greater clarity.",
    introduction:
      "Awareness creates a small but consequential space between what happens, what you make it mean, and what you do next.",
    question: "What is happening in me right now?",
    accent: "ochre",
  },
  {
    slug: "human-nature",
    index: "04",
    name: "Human Nature",
    shortName: "Human Nature",
    eyebrow: "The social animal",
    description: "Understand what humans tend to do—and why.",
    introduction:
      "Humans cooperate and compete, conform and dissent, care and exploit. Describing these tendencies clearly is not the same as excusing them.",
    question: "What changes when other humans enter the room?",
    accent: "clay",
  },
  {
    slug: "dark-library",
    index: "05",
    name: "Dark Library",
    shortName: "Dark Library",
    eyebrow: "The uncomfortable mechanisms",
    description: "Recognize manipulation, coercion, and group harm.",
    introduction:
      "Some human mechanisms are safer to understand than to ignore. This library explains how harmful influence works, what it looks like, and how to resist it.",
    question: "What becomes visible once I know the pattern?",
    accent: "charcoal",
  },
];

export function getCategory(slug: string) {
  return categories.find((category) => category.slug === slug);
}
