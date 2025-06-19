// /data/index.ts
import { Heart, Star, Smile, ThumbsUp } from "lucide-react";

export const values = [
  {
    icon: (
      <Heart className="w-7 h-7 text-[var(--cake-pink)]" aria-hidden="true" />
    ),
    title: "Made with Love",
    description:
      "Every cake is baked from scratch, with care and attention to detail.",
  },
  {
    icon: (
      <Star className="w-7 h-7 text-[var(--cake-yellow)]" aria-hidden="true" />
    ),
    title: "Quality Ingredients",
    description:
      "We use only premium, locally sourced ingredients for the best taste.",
  },
  {
    icon: (
      <Smile className="w-7 h-7 text-[var(--cake-mint)]" aria-hidden="true" />
    ),
    title: "For Every Occasion",
    description: "Custom cakes for birthdays, milestones, or just because!",
  },
  {
    icon: (
      <ThumbsUp
        className="w-7 h-7 text-[var(--cake-lavender)]"
        aria-hidden="true"
      />
    ),
    title: "Customer Happiness",
    description:
      "Our mission: bring joy and make your celebrations unforgettable.",
  },
];
