import { notFound, redirect } from "next/navigation";
import { RecipeForm } from "@/components/recipe-form";
import { getRecipeById } from "@/lib/recipes";
import { createClient } from "@/lib/supabase/server";

interface EditRecipePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditRecipePage({ params }: EditRecipePageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=/recipes/${id}/edit`);
  }

  const recipe = await getRecipeById(id);

  if (!recipe) {
    notFound();
  }

  if (recipe.userId !== user.id) {
    redirect(`/recipes/${id}`);
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6 sm:py-12">
      <h1 className="text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
        Edit recipe
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-stone-500">
        Update the details below, then save. Ingredients and steps should each go
        on their own line.
      </p>
      <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <RecipeForm
          recipe={{
            id: recipe.id,
            title: recipe.title,
            description: recipe.description,
            category: recipe.category,
            ingredients: recipe.ingredients,
            steps: recipe.steps,
            imageUrl: recipe.imageUrl,
            prepTimeMinutes: recipe.prepTimeMinutes,
          }}
        />
      </div>
    </div>
  );
}
