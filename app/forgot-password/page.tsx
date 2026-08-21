import { redirect } from "next/navigation";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { AuthCard } from "@/components/auth/auth-card";
import { createClient } from "@/lib/supabase/server";

export default async function ForgotPasswordPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/");
  }

  return (
    <AuthCard
      title="Reset password"
      description="Enter your email and we'll send a link to choose a new password."
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
}
