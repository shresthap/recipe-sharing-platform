import { createClient } from "@/lib/supabase/server";

export interface RecipeLikeState {
  likeCount: number;
  isLiked: boolean;
}

export async function getRecipeLikeState(
  recipeId: string,
  userId?: string,
): Promise<RecipeLikeState> {
  const supabase = await createClient();

  const countPromise = supabase
    .from("recipe_likes")
    .select("*", { count: "exact", head: true })
    .eq("recipe_id", recipeId);

  if (!userId) {
    const { count } = await countPromise;
    return { likeCount: count ?? 0, isLiked: false };
  }

  const [{ count }, { data: like }] = await Promise.all([
    countPromise,
    supabase
      .from("recipe_likes")
      .select("user_id")
      .eq("recipe_id", recipeId)
      .eq("user_id", userId)
      .maybeSingle(),
  ]);

  return {
    likeCount: count ?? 0,
    isLiked: Boolean(like),
  };
}

export async function getRecipeLikeStates(
  recipeIds: string[],
  userId?: string,
): Promise<Record<string, RecipeLikeState>> {
  const states: Record<string, RecipeLikeState> = {};

  for (const recipeId of recipeIds) {
    states[recipeId] = { likeCount: 0, isLiked: false };
  }

  if (recipeIds.length === 0) {
    return states;
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("recipe_likes")
    .select("recipe_id, user_id")
    .in("recipe_id", recipeIds);

  for (const row of data ?? []) {
    const current = states[row.recipe_id] ?? { likeCount: 0, isLiked: false };
    current.likeCount += 1;
    if (userId && row.user_id === userId) {
      current.isLiked = true;
    }
    states[row.recipe_id] = current;
  }

  return states;
}
