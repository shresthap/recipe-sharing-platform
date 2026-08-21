"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isRecipeCategory, parseLineList } from "@/lib/recipe-constants";
import type { RecipeCategory } from "@/lib/supabase/types";

export interface RecipeFormState {
  error?: string;
}

interface ParsedRecipeInput {
  title: string;
  description: string | null;
  category: RecipeCategory;
  ingredients: string[];
  steps: string[];
  imageUrl: string | null;
  prepTimeMinutes: number | null;
}

function normalizeImageUrl(value: string) {
  if (!value) {
    return null;
  }

  if (value.startsWith("//")) {
    return `https:${value}`;
  }

  if (!/^https?:\/\//i.test(value)) {
    return `https://${value}`;
  }

  return value;
}

function getString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function parseRecipeInput(
  formData: FormData,
): { error: string } | { data: ParsedRecipeInput } {
  const title = getString(formData, "title");
  const description = getString(formData, "description");
  const category = getString(formData, "category");
  const imageUrl = getString(formData, "imageUrl");
  const prepTimeRaw = getString(formData, "prepTimeMinutes");
  const ingredients = parseLineList(getString(formData, "ingredients"));
  const steps = parseLineList(getString(formData, "steps"));

  if (!title) {
    return { error: "Title is required." };
  }

  if (title.length > 120) {
    return { error: "Title must be 120 characters or fewer." };
  }

  if (!isRecipeCategory(category)) {
    return { error: "Choose a valid category." };
  }

  if (description.length > 1000) {
    return { error: "Description must be 1000 characters or fewer." };
  }

  if (ingredients.length < 1) {
    return { error: "Add at least one ingredient." };
  }

  if (steps.length < 1) {
    return { error: "Add at least one step." };
  }

  let prepTimeMinutes: number | null = null;
  if (prepTimeRaw) {
    const parsed = Number(prepTimeRaw);
    if (!Number.isInteger(parsed) || parsed <= 0) {
      return { error: "Prep time must be a positive number of minutes." };
    }
    prepTimeMinutes = parsed;
  }

  return {
    data: {
      title,
      description: description || null,
      category,
      ingredients,
      steps,
      imageUrl: normalizeImageUrl(imageUrl),
      prepTimeMinutes,
    },
  };
}

async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { supabase, user };
}

export async function createRecipe(
  _prev: RecipeFormState | undefined,
  formData: FormData,
): Promise<RecipeFormState> {
  const { supabase, user } = await getCurrentUser();

  if (!user) {
    redirect("/login?next=/recipes/new");
  }

  const parsed = parseRecipeInput(formData);
  if ("error" in parsed) {
    return parsed;
  }

  const { data, error } = await supabase
    .from("recipes")
    .insert({
      user_id: user.id,
      title: parsed.data.title,
      description: parsed.data.description,
      category: parsed.data.category,
      ingredients: parsed.data.ingredients,
      steps: parsed.data.steps,
      image_url: parsed.data.imageUrl,
      prep_time_minutes: parsed.data.prepTimeMinutes,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { error: error?.message ?? "Could not save this recipe. Try again." };
  }

  redirect(`/recipes/${data.id}`);
}

export async function updateRecipe(
  _prev: RecipeFormState | undefined,
  formData: FormData,
): Promise<RecipeFormState> {
  const recipeId = getString(formData, "recipeId");
  const { supabase, user } = await getCurrentUser();

  if (!recipeId) {
    return { error: "Missing recipe." };
  }

  if (!user) {
    redirect(`/login?next=/recipes/${recipeId}/edit`);
  }

  const parsed = parseRecipeInput(formData);
  if ("error" in parsed) {
    return parsed;
  }

  const { data, error } = await supabase
    .from("recipes")
    .update({
      title: parsed.data.title,
      description: parsed.data.description,
      category: parsed.data.category,
      ingredients: parsed.data.ingredients,
      steps: parsed.data.steps,
      image_url: parsed.data.imageUrl,
      prep_time_minutes: parsed.data.prepTimeMinutes,
    })
    .eq("id", recipeId)
    .eq("user_id", user.id)
    .select("id")
    .maybeSingle();

  if (error) {
    return { error: error.message };
  }

  if (!data) {
    return { error: "You can only edit your own recipes." };
  }

  redirect(`/recipes/${data.id}`);
}

export async function deleteRecipe(formData: FormData) {
  const recipeId = getString(formData, "recipeId");
  const { supabase, user } = await getCurrentUser();

  if (!recipeId) {
    redirect("/");
  }

  if (!user) {
    redirect(`/login?next=/recipes/${recipeId}`);
  }

  await supabase.from("recipes").delete().eq("id", recipeId).eq("user_id", user.id);

  redirect("/");
}
