"use client";

import { useActionState } from "react";
import { createRecipe, updateRecipe } from "@/app/recipes/actions";
import {
  AuthMessage,
  authButtonClassName,
  authInputClassName,
} from "@/components/auth/auth-message";
import { recipeCategories } from "@/lib/recipe-constants";
import type { RecipeCategory } from "@/lib/supabase/types";

const textareaClassName = `${authInputClassName} min-h-32 resize-y`;

export interface RecipeFormValues {
  id: string;
  title: string;
  description: string | null;
  category: RecipeCategory;
  ingredients: string[];
  steps: string[];
  imageUrl: string | null;
  prepTimeMinutes: number | null;
}

interface RecipeFormProps {
  recipe?: RecipeFormValues;
}

export function RecipeForm({ recipe }: RecipeFormProps) {
  const isEditing = Boolean(recipe);
  const [state, formAction, isPending] = useActionState(
    isEditing ? updateRecipe : createRecipe,
    undefined,
  );

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <AuthMessage error={state?.error} />
      {recipe ? <input type="hidden" name="recipeId" value={recipe.id} /> : null}

      <div>
        <label htmlFor="title" className="text-sm font-medium text-stone-700">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          maxLength={120}
          defaultValue={recipe?.title}
          placeholder="Herb-crusted salmon"
          className={authInputClassName}
        />
      </div>

      <div>
        <label htmlFor="description" className="text-sm font-medium text-stone-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          maxLength={1000}
          defaultValue={recipe?.description ?? ""}
          placeholder="A short note about the dish"
          className={`${authInputClassName} min-h-24 resize-y`}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="category" className="text-sm font-medium text-stone-700">
            Category
          </label>
          <select
            id="category"
            name="category"
            required
            defaultValue={recipe?.category ?? ""}
            className={authInputClassName}
          >
            <option value="" disabled>
              Select a category
            </option>
            {recipeCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="prepTimeMinutes" className="text-sm font-medium text-stone-700">
            Prep time (minutes)
          </label>
          <input
            id="prepTimeMinutes"
            name="prepTimeMinutes"
            type="number"
            min={1}
            step={1}
            defaultValue={recipe?.prepTimeMinutes ?? undefined}
            placeholder="30"
            className={authInputClassName}
          />
        </div>
      </div>

      <div>
        <label htmlFor="imageUrl" className="text-sm font-medium text-stone-700">
          Image URL
          <span className="font-normal text-stone-400"> (optional)</span>
        </label>
        <input
          id="imageUrl"
          name="imageUrl"
          type="text"
          inputMode="url"
          defaultValue={recipe?.imageUrl ?? ""}
          placeholder="https://images.unsplash.com/..."
          className={authInputClassName}
        />
        <p className="mt-1 text-xs text-stone-400">
          Use a direct image link (right-click an image → Copy image address), not a webpage URL.
        </p>
      </div>

      <div>
        <label htmlFor="ingredients" className="text-sm font-medium text-stone-700">
          Ingredients
        </label>
        <textarea
          id="ingredients"
          name="ingredients"
          required
          defaultValue={recipe?.ingredients.join("\n")}
          placeholder={"2 cups flour\n1 tsp salt"}
          className={textareaClassName}
        />
        <p className="mt-1 text-xs text-stone-400">One ingredient per line.</p>
      </div>

      <div>
        <label htmlFor="steps" className="text-sm font-medium text-stone-700">
          Steps
        </label>
        <textarea
          id="steps"
          name="steps"
          required
          defaultValue={recipe?.steps.join("\n")}
          placeholder={"Preheat the oven to 375°F.\nBake for 20 minutes."}
          className={textareaClassName}
        />
        <p className="mt-1 text-xs text-stone-400">One step per line.</p>
      </div>

      <button type="submit" disabled={isPending} className={authButtonClassName}>
        {isPending
          ? isEditing
            ? "Saving..."
            : "Publishing..."
          : isEditing
            ? "Save changes"
            : "Publish recipe"}
      </button>
    </form>
  );
}
