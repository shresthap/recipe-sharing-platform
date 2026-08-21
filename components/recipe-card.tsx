import Link from "next/link";
import { RecipeImage } from "@/components/recipe-image";
import { RecipeLikeButton } from "@/components/recipe-like-button";
import type { Recipe } from "@/lib/mock-recipes";

interface RecipeCardProps {
  recipe: Recipe;
  likeCount?: number;
  isLiked?: boolean;
  isSignedIn?: boolean;
}

const categoryColors: Record<string, string> = {
  Appetizers: "bg-amber-100 text-amber-800",
  "Main Courses": "bg-orange-100 text-orange-800",
  Desserts: "bg-rose-100 text-rose-800",
  Breakfast: "bg-yellow-100 text-yellow-800",
  Soups: "bg-emerald-100 text-emerald-800",
};

export function RecipeCard({
  recipe,
  likeCount = 0,
  isLiked = false,
  isSignedIn = false,
}: RecipeCardProps) {
  const badgeClass =
    categoryColors[recipe.category] ?? "bg-stone-100 text-stone-700";

  return (
    <article className="relative flex flex-col overflow-hidden rounded-xl border border-stone-200 bg-white transition-shadow hover:shadow-md">
      <Link href={`/recipes/${recipe.id}`} className="group flex flex-1 flex-col">
        <div className="relative aspect-[4/3]">
          <RecipeImage src={recipe.imageUrl} alt="" className="h-full w-full" />
          <span
            className={`absolute left-3 top-3 z-10 rounded-full px-2.5 py-1 text-xs font-medium ${badgeClass}`}
          >
            {recipe.category}
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-2 p-4">
          <h3 className="font-semibold text-stone-900 group-hover:text-orange-600">
            {recipe.title}
          </h3>
          <p className="line-clamp-2 text-sm leading-relaxed text-stone-500">
            {recipe.description}
          </p>
          <div className="mt-auto flex items-center justify-between pt-2 text-xs text-stone-400">
            <span>{recipe.author}</span>
            <span>{recipe.prepTime}</span>
          </div>
        </div>
      </Link>

      <div className="absolute right-3 top-3 z-20">
        <RecipeLikeButton
          recipeId={recipe.id}
          likeCount={likeCount}
          isLiked={isLiked}
          isSignedIn={isSignedIn}
          variant="overlay"
        />
      </div>
    </article>
  );
}
