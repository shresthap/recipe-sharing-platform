import { notFound } from "next/navigation";
import { RecipeComments } from "@/components/recipe-comments";
import { RecipeImage } from "@/components/recipe-image";
import { RecipeLikeButton } from "@/components/recipe-like-button";
import { RecipeOwnerActions } from "@/components/recipe-owner-actions";
import { getRecipeComments } from "@/lib/comments";
import { getRecipeLikeState } from "@/lib/likes";
import { getRecipeById } from "@/lib/recipes";
import { createClient } from "@/lib/supabase/server";

interface RecipePageProps {
  params: Promise<{ id: string }>;
}

export default async function RecipePage({ params }: RecipePageProps) {
  const { id } = await params;
  const [recipe, supabase] = await Promise.all([getRecipeById(id), createClient()]);

  if (!recipe) {
    notFound();
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isOwner = user?.id === recipe.userId;
  const [likeState, comments] = await Promise.all([
    getRecipeLikeState(recipe.id, user?.id),
    getRecipeComments(recipe.id),
  ]);

  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-12">
      <div className="rounded-2xl border border-stone-200 bg-white p-6 text-stone-900 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium text-orange-700">{recipe.category}</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-900">
              {recipe.title}
            </h1>
            <p className="mt-3 text-sm text-stone-700">
              By {recipe.author}
              {recipe.prepTimeMinutes ? ` · ${recipe.prepTimeMinutes} min` : ""}
            </p>
            <div className="mt-4">
              <RecipeLikeButton
                recipeId={recipe.id}
                likeCount={likeState.likeCount}
                isLiked={likeState.isLiked}
                isSignedIn={Boolean(user)}
              />
            </div>
          </div>
          {isOwner ? <RecipeOwnerActions recipeId={recipe.id} /> : null}
        </div>

        {recipe.description ? (
          <p className="mt-6 text-base leading-relaxed text-stone-800">
            {recipe.description}
          </p>
        ) : null}

        <RecipeImage
          src={recipe.imageUrl}
          alt=""
          className="mt-8 aspect-[2/1] w-full rounded-xl border border-stone-200"
        />

        <section className="mt-10">
          <h2 className="text-lg font-semibold text-stone-900">Ingredients</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-stone-800">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={`${index}-${ingredient}`}>{ingredient}</li>
            ))}
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-lg font-semibold text-stone-900">Steps</h2>
          <ol className="mt-4 list-decimal space-y-3 pl-5 text-base leading-relaxed text-stone-800">
            {recipe.steps.map((step, index) => (
              <li key={`${index}-${step}`}>{step}</li>
            ))}
          </ol>
        </section>

        <RecipeComments
          recipeId={recipe.id}
          comments={comments}
          currentUserId={user?.id}
        />
      </div>
    </article>
  );
}
