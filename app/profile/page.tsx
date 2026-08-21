import { redirect } from "next/navigation";
import { AccountNav } from "@/components/account-nav";
import { ProfileForm } from "@/components/profile-form";
import { createClient } from "@/lib/supabase/server";

interface ProfilePageProps {
  searchParams: Promise<{ saved?: string }>;
}

export default async function ProfilePage({ searchParams }: ProfilePageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/profile");
  }

  const { saved } = await searchParams;
  const { data: profile } = await supabase
    .from("profiles")
    .select("username, full_name, bio, display_name")
    .eq("id", user.id)
    .maybeSingle();

  const fullName = profile?.full_name || profile?.display_name || "";
  const initial = (fullName || user.email || "P").charAt(0).toUpperCase();

  return (
    <div className="mx-auto w-full max-w-md px-4 py-10 sm:py-12">
      <div className="flex items-center gap-4">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xl font-semibold text-orange-700">
          {initial}
        </span>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-stone-900">
            Profile
          </h1>
          <p className="mt-1 text-sm text-stone-500">{user.email}</p>
        </div>
      </div>

      <div className="mt-8">
        <AccountNav active="profile" />
      </div>

      <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <ProfileForm
          username={profile?.username ?? ""}
          fullName={fullName}
          bio={profile?.bio ?? ""}
          saved={saved === "1"}
        />
      </div>
    </div>
  );
}
