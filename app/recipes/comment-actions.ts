"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export interface CommentFormState {
  error?: string;
}

export async function addRecipeComment(
  _prev: CommentFormState | undefined,
  formData: FormData,
): Promise<CommentFormState> {
  const recipeId = String(formData.get("recipeId") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();

  if (!recipeId) {
    return { error: "Missing recipe." };
  }

  if (!body) {
    return { error: "Write a comment first." };
  }

  if (body.length > 1000) {
    return { error: "Comments must be 1000 characters or fewer." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=/recipes/${recipeId}`);
  }

  const { error } = await supabase.from("recipe_comments").insert({
    recipe_id: recipeId,
    user_id: user.id,
    body,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/recipes/${recipeId}`);
  return {};
}

export async function updateRecipeComment(
  _prev: CommentFormState | undefined,
  formData: FormData,
): Promise<CommentFormState> {
  const recipeId = String(formData.get("recipeId") ?? "").trim();
  const commentId = String(formData.get("commentId") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();

  if (!recipeId || !commentId) {
    return { error: "Missing comment." };
  }

  if (!body) {
    return { error: "Write a comment first." };
  }

  if (body.length > 1000) {
    return { error: "Comments must be 1000 characters or fewer." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=/recipes/${recipeId}`);
  }

  const { error } = await supabase
    .from("recipe_comments")
    .update({ body })
    .eq("id", commentId)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/recipes/${recipeId}`);
  return {};
}

export async function deleteRecipeComment(formData: FormData) {
  const recipeId = String(formData.get("recipeId") ?? "").trim();
  const commentId = String(formData.get("commentId") ?? "").trim();

  if (!recipeId || !commentId) {
    return;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=/recipes/${recipeId}`);
  }

  await supabase
    .from("recipe_comments")
    .delete()
    .eq("id", commentId)
    .eq("user_id", user.id);

  revalidatePath(`/recipes/${recipeId}`);
}
