import Link from "next/link";
import { signOut } from "@/app/auth/actions";
import { createClient } from "@/lib/supabase/server";

export async function SiteHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let displayName: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name, full_name, username")
      .eq("id", user.id)
      .maybeSingle();
    displayName =
      profile?.full_name || profile?.username || profile?.display_name || user.email || "Profile";
  }

  const initial = displayName?.charAt(0).toUpperCase() ?? "P";

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-sm font-bold text-white">
            R
          </span>
          <span className="text-lg font-semibold tracking-tight text-stone-900">
            RecipeShare
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-stone-600 sm:flex">
          <Link href="/" className="transition-colors hover:text-stone-900">
            Browse
          </Link>
          {user ? (
            <Link href="/profile/saved" className="transition-colors hover:text-stone-900">
              Saved
            </Link>
          ) : null}
          <Link href="/recipes/new" className="transition-colors hover:text-stone-900">
            Share Recipe
          </Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <>
              <Link
                href="/profile"
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-100"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-sm font-semibold text-orange-700">
                  {initial}
                </span>
                <span className="hidden max-w-[10rem] truncate sm:inline">
                  {displayName}
                </span>
              </Link>
              <form action={signOut}>
                <button
                  type="submit"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-stone-600 transition-colors hover:text-stone-900"
                >
                  Log out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-3 py-2 text-sm font-medium text-stone-600 transition-colors hover:text-stone-900"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-orange-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600 sm:px-4"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
