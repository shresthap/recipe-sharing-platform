import { redirect } from "next/navigation";
import { SignupForm } from "@/components/auth/signup-form";
import { AuthCard } from "@/components/auth/auth-card";
import { createClient } from "@/lib/supabase/server";

export default async function SignupPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/");
  }

  return (
    <AuthCard
      title="Create an account"
      description="Sign up with email to start sharing recipes with the community."
    >
      <SignupForm />
    </AuthCard>
  );
}
