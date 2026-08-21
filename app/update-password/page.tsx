import { redirect } from "next/navigation";
import { UpdatePasswordForm } from "@/components/auth/update-password-form";
import { AuthCard } from "@/components/auth/auth-card";
import { createClient } from "@/lib/supabase/server";

export default async function UpdatePasswordPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <AuthCard
      title="Choose a new password"
      description="You're signed in from the reset link. Set a new password for your account."
    >
      <UpdatePasswordForm />
    </AuthCard>
  );
}
