import Link from "next/link";
import { redirect } from "next/navigation";
import { AccountNav } from "@/components/account-nav";
import { RecipeCard } from "@/components/recipe-card";
import { getRecipeLikeStates } from "@/lib/likes";
import { getLikedRecipesForUser } from "@/lib/recipes";
import { createClient } from "@/lib/supabase/server";

export default async function SavedRecipesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/profile/saved");
  }

  const recipes = await getLikedRecipesForUser(user.id);
  const likeStates = await getRecipeLikeStates(
    recipes.map((recipe) => recipe.id),
    user.id,
  );

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
      <div className="max-w-md">
        <AccountNav active="saved" />
      </div>

      <h1 className="mt-8 text-2xl font-semibold tracking-tight text-stone-900">
        Saved recipes
      </h1>
      <p className="mt-1 text-sm text-stone-500">
        Recipes you’ve liked, newest first.
      </p>

      {recipes.length > 0 ? (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              likeCount={likeStates[recipe.id]?.likeCount ?? 0}
              isLiked={likeStates[recipe.id]?.isLiked ?? false}
              isSignedIn
            />
          ))}
        </div>
      ) : (
        <p className="mt-8 rounded-xl border border-dashed border-stone-300 bg-white px-6 py-10 text-center text-sm text-stone-500">
          No saved recipes yet.{" "}
          <Link href="/" className="font-medium text-orange-700 hover:text-orange-800">
            Browse recipes
          </Link>{" "}
          and tap the heart to save them here.
        </p>
      )}
    </div>
  );
}
