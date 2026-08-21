"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

import { USERNAME_PATTERN } from "@/lib/username";

export interface ProfileFormState {
  error?: string;
}

export async function updateProfile(
  _prev: ProfileFormState | undefined,
  formData: FormData,
): Promise<ProfileFormState> {
  const username = String(formData.get("username") ?? "").trim();
  const fullName = String(formData.get("fullName") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();

  if (!username) {
    return { error: "Username is required." };
  }

  if (!USERNAME_PATTERN.test(username)) {
    return {
      error: "Username must be unique and use letters, numbers, periods, or underscores.",
    };
  }

  if (!fullName) {
    return { error: "Full name is required." };
  }

  if (fullName.length > 80) {
    return { error: "Full name must be 80 characters or fewer." };
  }

  if (bio.length > 300) {
    return { error: "Bio must be 300 characters or fewer." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/profile");
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      username,
      full_name: fullName,
      display_name: fullName,
      bio: bio || null,
    })
    .eq("id", user.id);

  if (error) {
    if (error.code === "23505") {
      return { error: "That username is already taken." };
    }

    return { error: error.message };
  }

  redirect("/profile?saved=1");
}
