import { createClient } from "@/lib/supabase/server";

export interface RecipeComment {
  id: string;
  recipeId: string;
  userId: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  authorName: string;
}

export async function getRecipeComments(recipeId: string): Promise<RecipeComment[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("recipe_comments")
    .select(
      "id, recipe_id, user_id, body, created_at, updated_at, profiles!recipe_comments_user_id_fkey(full_name, display_name, username)",
    )
    .eq("recipe_id", recipeId)
    .order("created_at", { ascending: true });

  if (error || !data) {
    return [];
  }

  return data.map((row) => {
    const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;

    return {
      id: row.id,
      recipeId: row.recipe_id,
      userId: row.user_id,
      body: row.body,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      authorName:
        profile?.full_name || profile?.display_name || profile?.username || "Community cook",
    };
  });
}
