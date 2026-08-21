"use client";

import type { FormEvent } from "react";
import Link from "next/link";
import { deleteRecipe } from "@/app/recipes/actions";

interface RecipeOwnerActionsProps {
  recipeId: string;
}

export function RecipeOwnerActions({ recipeId }: RecipeOwnerActionsProps) {
  function handleDelete(event: FormEvent<HTMLFormElement>) {
    if (!window.confirm("Delete this recipe? This cannot be undone.")) {
      event.preventDefault();
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/recipes/${recipeId}/edit`}
        className="rounded-lg border border-stone-200 px-3 py-1.5 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50"
      >
        Edit
      </Link>
      <form action={deleteRecipe} onSubmit={handleDelete}>
        <input type="hidden" name="recipeId" value={recipeId} />
        <button
          type="submit"
          className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-50"
        >
          Delete
        </button>
      </form>
    </div>
  );
}
