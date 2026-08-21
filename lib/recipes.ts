import type { Recipe } from "@/lib/mock-recipes";
import { isRecipeCategory } from "@/lib/recipe-constants";
import { createClient } from "@/lib/supabase/server";
import type { RecipeCategory } from "@/lib/supabase/types";

export interface RecipeDetail {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  category: RecipeCategory;
  ingredients: string[];
  steps: string[];
  imageUrl: string | null;
  prepTimeMinutes: number | null;
  author: string;
  createdAt: string;
}

function formatPrepTime(minutes: number | null) {
  if (!minutes) {
    return "—";
  }

  return `${minutes} min`;
}

export interface RecipeListFilters {
  query?: string;
  category?: RecipeCategory;
}

function escapeIlike(value: string) {
  return value.replace(/[%_,.()]/g, " ").replace(/\s+/g, " ").trim();
}

export async function getRecipes(filters: RecipeListFilters = {}): Promise<Recipe[]> {
  const supabase = await createClient();
  let query = supabase
    .from("recipes")
    .select("id, title, description, category, prep_time_minutes, image_url, profiles!recipes_user_id_fkey(display_name, full_name, username)")
    .order("created_at", { ascending: false });

  if (filters.category) {
    query = query.eq("category", filters.category);
  }

  const search = filters.query ? escapeIlike(filters.query) : "";
  if (search) {
    const pattern = `%${search}%`;
    query = query.or(
      `title.ilike.${pattern},description.ilike.${pattern},ingredients.ilike.${pattern}`,
    );
  }

  const { data, error } = await query;

  if (error || !data) {
    return [];
  }

  return data.map(mapRecipeRow);
}

export async function getRecipesForUser(userId: string): Promise<Recipe[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("recipes")
    .select("id, title, description, category, prep_time_minutes, image_url, profiles!recipes_user_id_fkey(display_name, full_name, username)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map(mapRecipeRow);
}

function mapRecipeRow(row: {
  id: string;
  title: string;
  description: string | null;
  category: string;
  prep_time_minutes: number | null;
  image_url: string | null;
  profiles:
    | { display_name: string; full_name?: string | null; username?: string | null }
    | { display_name: string; full_name?: string | null; username?: string | null }[]
    | null;
}): Recipe {
  const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;

  return {
    id: row.id,
    title: row.title,
    description: row.description ?? "",
    category: row.category,
    prepTime: formatPrepTime(row.prep_time_minutes),
    author: profile?.full_name || profile?.display_name || profile?.username || "Community cook",
    imageUrl: row.image_url,
  };
}

export async function getLikedRecipesForUser(userId: string): Promise<Recipe[]> {
  const supabase = await createClient();
  const { data: likes, error: likesError } = await supabase
    .from("recipe_likes")
    .select("recipe_id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (likesError || !likes?.length) {
    return [];
  }

  const likedIds = likes.map((like) => like.recipe_id);
  const { data, error } = await supabase
    .from("recipes")
    .select(
      "id, title, description, category, prep_time_minutes, image_url, profiles!recipes_user_id_fkey(display_name, full_name, username)",
    )
    .in("id", likedIds);

  if (error || !data) {
    return [];
  }

  const recipesById = new Map(data.map((row) => [row.id, mapRecipeRow(row)]));

  return likedIds.flatMap((id) => {
    const recipe = recipesById.get(id);
    return recipe ? [recipe] : [];
  });
}

export async function getRecipeById(id: string): Promise<RecipeDetail | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("recipes")
    .select(
      "id, user_id, title, description, category, ingredients, steps, image_url, prep_time_minutes, created_at, profiles!recipes_user_id_fkey(display_name, full_name, username)",
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !data || !isRecipeCategory(data.category)) {
    return null;
  }

  const profile = Array.isArray(data.profiles) ? data.profiles[0] : data.profiles;

  return {
    id: data.id,
    userId: data.user_id,
    title: data.title,
    description: data.description,
    category: data.category,
    ingredients: data.ingredients,
    steps: data.steps,
    imageUrl: data.image_url,
    prepTimeMinutes: data.prep_time_minutes,
    author: profile?.full_name || profile?.display_name || profile?.username || "Community cook",
    createdAt: data.created_at,
  };
}
