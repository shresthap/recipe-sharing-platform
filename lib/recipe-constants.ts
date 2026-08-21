import type { RecipeCategory } from "@/lib/supabase/types";

export const recipeCategories = [
  "Appetizers",
  "Main Courses",
  "Desserts",
  "Breakfast",
  "Soups",
] as const satisfies readonly RecipeCategory[];

export function isRecipeCategory(value: string): value is RecipeCategory {
  return (recipeCategories as readonly string[]).includes(value);
}

export const browseCategories = ["All", ...recipeCategories] as const;

export function parseLineList(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}
