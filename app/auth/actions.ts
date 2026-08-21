"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export interface AuthState {
  error?: string;
  message?: string;
}

function getString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function mapAuthError(error: { code?: string; message: string }) {
  if (error.code === "email_address_invalid") {
    return "That email isn’t accepted. Gmail addresses need at least 6 characters before @ (test@gmail.com is blocked). Use a real address like jane.doe@gmail.com.";
  }

  if (
    error.code === "over_email_send_rate_limit" ||
    error.message.toLowerCase().includes("rate limit")
  ) {
    return "Too many emails were sent. Wait a few minutes, or in Supabase go to Authentication → Providers → Email and turn off Confirm email for local testing.";
  }

  return error.message;
}

function getSafeNextPath(formData: FormData) {
  const next = getString(formData, "next");
  if (next.startsWith("/") && !next.startsWith("//")) {
    return next;
  }

  return "/";
}

async function getOrigin() {
  const headerStore = await headers();
  const origin = headerStore.get("origin");
  if (origin) {
    return origin;
  }

  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  const protocol = headerStore.get("x-forwarded-proto") ?? "http";
  return host ? `${protocol}://${host}` : "http://localhost:3000";
}

export async function login(
  _prev: AuthState | undefined,
  formData: FormData,
): Promise<AuthState> {
  const email = getString(formData, "email");
  const password = getString(formData, "password");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  redirect(getSafeNextPath(formData));
}

export async function signup(
  _prev: AuthState | undefined,
  formData: FormData,
): Promise<AuthState> {
  const email = getString(formData, "email");
  const password = getString(formData, "password");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }

  const origin = await getOrigin();
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return { error: mapAuthError(error) };
  }

  if (!data.session) {
    return {
      message: "Check your email for a confirmation link to finish signing up.",
    };
  }

  redirect(getSafeNextPath(formData));
}

export async function requestPasswordReset(
  _prev: AuthState | undefined,
  formData: FormData,
): Promise<AuthState> {
  const email = getString(formData, "email");

  if (!email) {
    return { error: "Email is required." };
  }

  const origin = await getOrigin();
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/update-password`,
  });

  if (error) {
    return { error: mapAuthError(error) };
  }

  return {
    message: "If an account exists for that email, we sent a reset link.",
  };
}

export async function updatePassword(
  _prev: AuthState | undefined,
  formData: FormData,
): Promise<AuthState> {
  const password = getString(formData, "password");
  const confirmPassword = getString(formData, "confirmPassword");

  if (!password || !confirmPassword) {
    return { error: "Please enter and confirm your new password." };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: error.message };
  }

  redirect("/");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
