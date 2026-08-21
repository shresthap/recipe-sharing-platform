"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function toggleRecipeLike(formData: FormData) {
  const recipeId = String(formData.get("recipeId") ?? "").trim();

  if (!recipeId) {
    return;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=/recipes/${recipeId}`);
  }

  const { data: existing } = await supabase
    .from("recipe_likes")
    .select("user_id")
    .eq("recipe_id", recipeId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("recipe_likes")
      .delete()
      .eq("recipe_id", recipeId)
      .eq("user_id", user.id);
  } else {
    await supabase.from("recipe_likes").insert({
      recipe_id: recipeId,
      user_id: user.id,
    });
  }

  revalidatePath(`/recipes/${recipeId}`);
  revalidatePath("/");
  revalidatePath("/profile/saved");
}
