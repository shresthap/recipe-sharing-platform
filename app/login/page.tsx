import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { AuthCard } from "@/components/auth/auth-card";
import { createClient } from "@/lib/supabase/server";

interface LoginPageProps {
  searchParams: Promise<{ error?: string; next?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/");
  }

  const { error, next } = await searchParams;
  const nextPath = next?.startsWith("/") && !next.startsWith("//") ? next : undefined;

  return (
    <AuthCard title="Log in" description="Welcome back. Sign in to share and manage your recipes.">
      <LoginForm initialError={error} nextPath={nextPath} />
    </AuthCard>
  );
}
