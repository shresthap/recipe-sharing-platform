import { redirect } from "next/navigation";
import { RecipeForm } from "@/components/recipe-form";
import { createClient } from "@/lib/supabase/server";

export default async function NewRecipePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/recipes/new");
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6 sm:py-12">
      <h1 className="text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
        Share a recipe
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-stone-500">
        Add the details below. Ingredients and steps should each go on their own line.
      </p>
      <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <RecipeForm />
      </div>
    </div>
  );
}
