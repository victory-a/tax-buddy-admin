import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * A `tailwind-merge` instance taught about our custom design-token utilities.
 *
 * Without this, tailwind-merge groups every `text-*` class into the same
 * conflict bucket, so a class string like
 *   `bg-primary text-on-primary text-body-md`
 * incorrectly drops `text-on-primary` (a color) because `text-body-md`
 * (a font-size token from `@theme`) shows up later. Listing our custom
 * font-size, radius, and shadow tokens here keeps colors and sizes in
 * separate conflict groups so both win.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "headline-lg",
            "headline-md",
            "headline-sm",
            "body-lg",
            "body-md",
            "body-sm",
            "label-md",
            "data-tabular",
          ],
        },
      ],
      shadow: ["shadow-elevated"],
    },
  },
});

/**
 * Merge Tailwind classes safely while preserving conditional logic.
 * Combines `clsx` (conditional class composition) with `tailwind-merge`
 * (resolves conflicting Tailwind utilities so the last one wins).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
